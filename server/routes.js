const express = require('express');
const db = require('./db');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const router = express.Router();

// ─── Auth Middleware ──────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  // Admin tokens
  if (token === 'admin123') {
    req.user = { role: 'admin', id: 'admin' };
    return next();
  }
  // User tokens (simple hash-based for now)
  const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
  if (user) {
    req.user = { role: 'user', id: user.id, name: user.name };
    return next();
  }
  return res.status(401).json({ error: 'Invalid token' });
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin only' });
}

// ─── SSE Broadcast Helpers ──────────────────────────────────────
const sseClients = [];

function broadcastUpdate(data, type) {
  const payload = JSON.stringify({ ...data, type });
  sseClients.forEach((res) => {
    try { res.write('data: ' + payload + '\n\n'); } catch (e) {}
  });
}

router.broadcastUpdate = broadcastUpdate;

// ─── GET /api/sse/updates - Server Sent Events ──────────────────
router.get('/sse/updates', authenticate, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// ╔══════════════════════════════════════════════════════════════╗
// ║       USER AUTH — Login / Signup / Guest                    ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── POST /api/auth/signup ──────────────────────────────────────
router.post('/auth/signup', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'Name and password required' });
  try {
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const token = crypto.randomBytes(24).toString('hex');
    db.prepare('INSERT INTO users (id, name, password, token) VALUES (?, ?, ?, ?)').run(id, name, password, token);
    res.json({ id, name, token, message: 'Account created' });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Name already taken' });
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ─── POST /api/auth/login ───────────────────────────────────────
router.post('/auth/login', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.status(400).json({ error: 'Name and password required' });
  
  // Check admin credentials first
  if (name === 'admin' && password === 'admin123') {
    return res.json({ id: 'admin', name: 'admin', token: 'admin123', role: 'admin', message: 'Admin logged in' });
  }
  
  // Check regular users
  const user = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?').get(name, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ id: user.id, name: user.name, token: user.token, role: 'user', message: 'Logged in' });
});

// ─── POST /api/auth/guest ───────────────────────────────────────
router.post('/auth/guest', (req, res) => {
  const guestNum = Math.floor(Math.random() * 90000) + 10000;
  const name = 'Guest_' + guestNum;
  const id = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  const token = crypto.randomBytes(24).toString('hex');
  try {
    db.prepare('INSERT INTO users (id, name, password, token) VALUES (?, ?, ?, ?)').run(id, name, 'guest', token);
    res.json({ id, name, token, role: 'user', message: 'Guest access granted' });
  } catch (e) {
    res.json({ id, name, token, role: 'user', message: 'Guest access granted' });
  }
});

// ─── GET /api/auth/me ───────────────────────────────────────────
router.get('/auth/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, role: req.user.role });
});

// ╔══════════════════════════════════════════════════════════════╗
// ║       STORIES CRUD                                          ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── GET /api/stories - Get stories (public feed) ──────────────
router.get('/stories', (req, res) => {
  const { category, status = 'approved', limit = 20, page = 1, country } = req.query;
  
  let query = 'SELECT * FROM stories WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (!status || status === 'approved') {
    query += " AND status = 'approved'";
  } else if (status === 'pending' || status === 'rejected') {
    query += " AND status = '" + status + "'";
  } else if (status === 'all') {
    // no filter
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit) || 20, parseInt((page - 1) * (parseInt(limit) || 20)));

  const stmt = db.prepare(query);
  const stories = stmt.all(...params);

  const parsedStories = stories.map(s => ({
    ...s,
    extendedSummary: JSON.parse(s.extendedSummary || '[]'),
    hindiExtendedSummary: JSON.parse(s.hindiExtendedSummary || '[]'),
    regions: JSON.parse(s.regions || '["global"]'),
    country: s.country || 'global'
  }));

  // If country filter, sort so matching country stories come first
  if (country && country !== 'global') {
    parsedStories.sort((a, b) => {
      const aMatch = a.regions.includes(country) || a.country === country ? 1 : 0;
      const bMatch = b.regions.includes(country) || b.country === country ? 1 : 0;
      return bMatch - aMatch;
    });
  }

  res.json(parsedStories);
});

// ─── GET /api/stories/admin - Get all stories (admin dashboard) ──
router.get('/stories/admin', authenticate, adminOnly, (req, res) => {
  const { status = 'all', category = 'all', search = '' } = req.query;
  
  let query = 'SELECT * FROM stories WHERE 1=1';
  const params = [];

  if (status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (headline LIKE ? OR summary LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY createdAt DESC';

  const stmt = db.prepare(query);
  const stories = stmt.all(...params);

  const parsedStories = stories.map(s => ({
    ...s,
    extendedSummary: JSON.parse(s.extendedSummary || '[]'),
    hindiExtendedSummary: JSON.parse(s.hindiExtendedSummary || '[]'),
    regions: JSON.parse(s.regions || '["global"]'),
    country: s.country || 'global'
  }));

  res.json(parsedStories);
});

// ─── POST /api/stories - Create story (admin only) ──────────────
router.post('/stories', authenticate, adminOnly, (req, res) => {
  const {
    id, headline, summary, extendedSummary = [], hindiHeadline = '', 
    hindiSummary = '', hindiExtendedSummary = [], category, source = '', 
    link = '', regions = ['global'], status = 'pending', country = 'global'
  } = req.body;

  if (!headline || !summary || !category) {
    return res.status(400).json({ error: 'headline, summary, and category are required' });
  }

  const storyId = id || `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    db.prepare(`
      INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, hindiSummary, hindiExtendedSummary, category, source, link, regions, status, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      storyId, headline, summary, JSON.stringify(extendedSummary),
      hindiHeadline, hindiSummary, JSON.stringify(hindiExtendedSummary),
      category, source, link, JSON.stringify(regions), status, country
    );

    if (typeof router.broadcastUpdate === 'function') {
      router.broadcastUpdate({ type: 'story', id: storyId, headline, category }, 'story');
    }

    res.status(201).json({ id: storyId, message: 'Story created successfully' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Story ID already exists' });
    }
    throw error;
  }
});

// ─── PUT /api/stories/:id - Update story (admin only) ───────────
router.put('/stories/:id', authenticate, adminOnly, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Story not found' });

  const { headline, summary, extendedSummary, hindiHeadline, hindiSummary, hindiExtendedSummary, category, source, link, regions, country } = req.body;

  try {
    db.prepare(`UPDATE stories SET 
      headline = COALESCE(?, headline), summary = COALESCE(?, summary),
      extendedSummary = COALESCE(?, extendedSummary),
      hindiHeadline = COALESCE(?, hindiHeadline),
      hindiSummary = COALESCE(?, hindiSummary),
      hindiExtendedSummary = COALESCE(?, hindiExtendedSummary),
      category = COALESCE(?, category), source = COALESCE(?, source),
      link = COALESCE(?, link), regions = COALESCE(?, regions),
      country = COALESCE(?, country)
    `).run(
      headline || null, summary || null,
      extendedSummary !== undefined ? JSON.stringify(extendedSummary) : null,
      hindiHeadline || null, hindiSummary || null,
      hindiExtendedSummary !== undefined ? JSON.stringify(hindiExtendedSummary) : null,
      category || null, source || null, link || null,
      regions !== undefined ? JSON.stringify(regions) : null, country || null, id
    );

    if (typeof router.broadcastUpdate === 'function') {
      router.broadcastUpdate({ type: 'story_updated', id }, 'story');
    }

    res.json({ message: 'Story updated successfully' });
  } catch (error) { throw error; }
});

// ─── DELETE /api/stories/:id - Delete story (admin only) ─────────
router.delete('/stories/:id', authenticate, adminOnly, (req, res) => {
  const { id } = req.params;
  if (!db.prepare('SELECT * FROM stories WHERE id = ?').get(id)) {
    return res.status(404).json({ error: 'Story not found' });
  }
  db.prepare('DELETE FROM stories WHERE id = ?').run(id);
  
  if (typeof router.broadcastUpdate === 'function') {
    router.broadcastUpdate({ type: 'story_deleted', id }, 'story');
  }
  
  res.json({ message: 'Story deleted successfully' });
});

// ─── PATCH /api/stories/:id/status - Update status (admin only) ──
router.patch('/stories/:id/status', authenticate, adminOnly, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (!db.prepare('SELECT * FROM stories WHERE id = ?').get(id)) {
    return res.status(404).json({ error: 'Story not found' });
  }

  db.prepare('UPDATE stories SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);

  if (typeof router.broadcastUpdate === 'function') {
    router.broadcastUpdate({ type: 'status_changed', id, status }, 'story');
  }

  res.json({ message: `Status updated to ${status}` });
});

// ─── POST /api/stories/bulk - Bulk update (admin only) ──────────
router.post('/stories/bulk', authenticate, adminOnly, (req, res) => {
  const { storyIds, action } = req.body;
  if (!storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
    return res.status(400).json({ error: 'storyIds array is required' });
  }
  if (!['approve', 'reject', 'delete'].includes(action)) {
    return res.status(400).json({ error: 'action must be approve, reject, or delete' });
  }

  try {
    if (action === 'approve') {
      db.prepare(`UPDATE stories SET status = 'approved', updatedAt = CURRENT_TIMESTAMP WHERE id IN (${storyIds.map(() => '?').join(',')})`).all(...storyIds);
    } else if (action === 'reject') {
      db.prepare(`UPDATE stories SET status = 'rejected', updatedAt = CURRENT_TIMESTAMP WHERE id IN (${storyIds.map(() => '?').join(',')})`).all(...storyIds);
    } else {
      db.prepare('DELETE FROM stories WHERE id IN (' + storyIds.map(() => '?').join(',') + ')').run(...storyIds);
    }

    if (typeof router.broadcastUpdate === 'function') {
      router.broadcastUpdate({ type: 'bulk_action', action, count: storyIds.length }, 'story');
    }

    res.json({ message: `Bulk ${action} completed for ${storyIds.length} stories` });
  } catch (error) { throw error; }
});

// ─── GET /api/stats - Dashboard statistics ────────────────────────
router.get('/stats', authenticate, adminOnly, (req, res) => {
  const totalStories = db.prepare('SELECT COUNT(*) as count FROM stories').get().count;
  const approvedStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'approved'").get().count;
  const pendingStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'pending'").get().count;
  const rejectedStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'rejected'").get().count;

  const categoryStats = db.prepare(`
    SELECT category, 
           SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
           SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM stories GROUP BY category ORDER BY category
  `).all();

  res.json({ totalStories, approvedStories, pendingStories, rejectedStories, categoryStats });
});

// ─── GET /api/categories - Get all categories with counts ─────────
router.get('/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT category, 
           SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
    FROM stories GROUP BY category ORDER BY category
  `).all();
  res.json(categories);
});

// ─── POST /api/settings - Get/Set settings (admin only) ──────────
router.get('/settings', authenticate, adminOnly, (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const s = {};
  rows.forEach(r => { s[r.key] = r.value; });
  s.autoPublish = s.autoPublish === 'true';
  res.json(s);
});

router.put('/settings', authenticate, adminOnly, (req, res) => {
  const settings = req.body || {};
  if ('autoPublish' in settings) settings.autoPublish = String(settings.autoPublish);
  
  Object.entries(settings).forEach(([key, value]) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, String(value));
    
    if (key === 'autoPublish') {
      const payload = JSON.stringify({ type: 'setting_changed', key: 'auto_publish', value: value });
      sseClients.forEach(client => { client.write('data: ' + payload + '\n\n'); });
    }
  });

  res.json(settings);
});

// ╔══════════════════════════════════════════════════════════════╗
// ║       VOTES & COMMENTS                                      ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── POST /api/stories/:id/vote - Upvote/Downvote ────────────────
router.post('/stories/:id/vote', authenticate, (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body; // 1 for up, -1 for down, 0 to remove
  const userId = req.user.id;
  
  if (![1, -1, 0].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid vote type. Use 1 (up), -1 (down), or 0 (remove)' });
  }

  const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!story) return res.status(404).json({ error: 'Story not found' });

  // Remove existing vote
  db.prepare('DELETE FROM votes WHERE storyId = ? AND userId = ?').run(id, userId);

  if (voteType !== 0) {
    db.prepare('INSERT INTO votes (storyId, userId, voteType) VALUES (?, ?, ?)').run(id, userId, voteType);
  }

  // Recalculate totals
  const upvotes = db.prepare("SELECT COUNT(*) as c FROM votes WHERE storyId = ? AND voteType = 1").get(id).c;
  const downvotes = db.prepare("SELECT COUNT(*) as c FROM votes WHERE storyId = ? AND voteType = -1").get(id).c;

  db.prepare('UPDATE stories SET upvotes = ?, downvotes = ? WHERE id = ?').run(upvotes, downvotes, id);

  res.json({ upvotes, downvotes, userVote: voteType });
});

// ─── GET /api/stories/:id/vote - Get user's vote ────────────────
router.get('/stories/:id/vote', authenticate, (req, res) => {
  const { id } = req.params;
  const vote = db.prepare('SELECT voteType FROM votes WHERE storyId = ? AND userId = ?').get(id, req.user.id);
  res.json({ vote: vote ? vote.voteType : 0 });
});

// ─── GET /api/stories/:id/comments - Get comments ───────────────
router.get('/stories/:id/comments', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('SELECT * FROM comments WHERE storyId = ? ORDER BY createdAt DESC');
  const comments = stmt.all(id);
  res.json(comments);
});

// ─── POST /api/stories/:id/comment - Add a comment ──────────────
router.post('/stories/:id/comment', authenticate, (req, res) => {
  const { id } = req.params;
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Comment text required' });

  try {
    const result = db.prepare('INSERT INTO comments (storyId, userId, author, text) VALUES (?, ?, ?, ?)').run(
      id, req.user.id, req.user.name, text
    );
    
    if (typeof router.broadcastUpdate === 'function') {
      router.broadcastUpdate({ type: 'comment_added', storyId: id }, 'story');
    }
    
    res.status(201).json({ 
      id: result.lastInsertRowid, 
      storyId: id, 
      userId: req.user.id, 
      author: req.user.name, 
      text, 
      createdAt: new Date().toISOString() 
    });
  } catch (e) {
    throw e;
  }
});

// ─── POST /api/stories/:id/share - Increment share count ─────────
router.post('/stories/:id/share', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE stories SET shares = shares + 1 WHERE id = ?').run(id);
  const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!story) return res.status(404).json({ error: 'Story not found' });
  
  const { lang } = req.body || {};
  let shareText = story.headline;
  
  if (lang === 'hi' && story.hindiHeadline) {
    shareText = `${story.hindiHeadline}\n\n${story.summary}`;
  } else {
    shareText = `${story.headline}\n\n${story.summary}`;
  }

  res.json({ 
    headline: story.headline,
    summary: story.summary.substring(0, 256).replace(/\n/g, ' '),
    hindiHeadline: story.hindiHeadline || '',
    hindiSummary: story.hindiSummary || '',
    shareText: shareText.substring(0, 400),
    link: story.link
  });
});

// ╔══════════════════════════════════════════════════════════════╗
// ║       RSS + AI FEATURES                                      ║
// ╚══════════════════════════════════════════════════════════════╝

const RSS_SOURCES = {
  world: [
    { name: 'BBC World', feed: 'https://feeds.bbci.co.uk/news/world/rss.xml', country: 'gb' },
    { name: 'Al Jazeera', feed: 'https://www.aljazeera.com/xml/rss/all.xml', country: 'qa' },
    { name: 'Reuters', feed: 'https://www.reutersagency.com/feed/?best-topics=news&utm_term=global', country: 'global' },
    { name: 'CNN Top News', feed: 'https://rss.cnn.com/rss/cnn_topstories.rss', country: 'us' },
    { name: 'Times of India', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', country: 'in' },
    { name: 'France 24', feed: 'https://www.france24.com/en/rss', country: 'fr' },
    { name: 'DW News', feed: 'https://rss.dw.com/rdf/rss-en-all', country: 'de' }
  ],
  technology: [
    { name: 'BBC Tech', feed: 'https://feeds.bbci.co.uk/news/technology/rss.xml', country: 'gb' },
    { name: 'TechCrunch', feed: 'https://techcrunch.com/feed/', country: 'us' },
    { name: 'The Verge', feed: 'https://www.theverge.com/rss/index.xml', country: 'us' },
    { name: 'Ars Technica', feed: 'https://feeds.arstechnica.com/arstechnica/index', country: 'us' },
    { name: '9to5Mac', feed: 'https://9to5mac.com/feed/', country: 'us' }
  ],
  business: [
    { name: 'BBC Business', feed: 'https://feeds.bbci.co.uk/news/business/rss.xml', country: 'gb' },
    { name: 'CNBC', feed: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', country: 'us' },
    { name: 'Forbes', feed: 'https://www.forbes.com/feed/', country: 'us' },
    { name: 'Economic Times', feed: 'https://economictimes.indiatimes.com/rssdefaultpath.cms', country: 'in' }
  ],
  sports: [
    { name: 'BBC Sport', feed: 'https://feeds.bbci.co.uk/sport/rss.xml', country: 'gb' },
    { name: 'Sky Sports', feed: 'https://www.skysports.com/rss/12040', country: 'gb' },
    { name: 'ESPN', feed: 'https://www.espn.com/espn/rss/news', country: 'us' },
    { name: 'ESPNcricinfo', feed: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', country: 'in' }
  ],
  science: [
    { name: 'BBC Science', feed: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', country: 'gb' },
    { name: 'Science Daily', feed: 'https://www.sciencedaily.com/rss/all.xml', country: 'us' },
    { name: 'NASA', feed: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', country: 'us' },
    { name: 'New Scientist', feed: 'https://www.newscientist.com/feed/home', country: 'gb' }
  ],
  entertainment: [
    { name: 'BBC Entertainment', feed: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', country: 'gb' },
    { name: 'Variety', feed: 'https://variety.com/feed/', country: 'us' },
    { name: 'Hollywood Reporter', feed: 'https://www.hollywoodreporter.com/feed/', country: 'us' }
  ],
  health: [
    { name: 'BBC Health', feed: 'https://feeds.bbci.co.uk/news/health/rss.xml', country: 'gb' },
    { name: 'WebMD', feed: 'https://www.webmd.com/rss/all.xml', country: 'us' }
  ]
};

function fetchRSS(feedUrl) {
  return new Promise(function(resolve) {
    var fetcher = feedUrl.startsWith('https') ? https : http;
    fetcher.get(feedUrl, function(res) {
      if (res.statusCode !== 200) return resolve([]);
      var raw = '';
      res.setEncoding('utf8');
      res.on('data', function(c) { raw += c; });
      res.on('end', function() {
        try {
          var items = [];
          var itemRegex = /<(?:item|entry)[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
          var m;
          while ((m = itemRegex.exec(raw)) !== null) {
            var content = m[1];
            var title = (content.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
            var description = (content.match(/<(?:description|summary|content)[^>]*>([\s\S]*?)<\/(?:description|summary|content)>/i) || [])[1] || '';
            var link = (content.match(/<link[^>]*href=["']([^"']+)["']/i) || (content.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '');
            
            title = title.replace(/<[^>]*>/g, '').trim();
            description = description.replace(/<[^>]*>/g, '').trim();
            
            if (title && description) {
              items.push({ title: title.substring(0, 300), description: description.substring(0, 2000), link: link });
            }
          }
          resolve(items);
        } catch (e) { resolve([]); }
      });
    }).on('error', function() { resolve([]); });
  });
}

function callAI(options) {
  return function(body) {
    if (!body) body = {};
    var modelOverride = (options && options.model) || 'qwen3.5:latest';
    var hostOverride = (options && options.host) || process.env.OLLAMA_HOST || 'localhost';
    var defOpts = Object.assign({
      model: modelOverride, max_tokens: parseInt(body.tokens || body.maxTokens || 2000), temperature: 0.7
    }, body);

    return new Promise(function(resolve, reject) {
      var ollamaHost = hostOverride;

      if (body.aiProvider === 'cloud_free') {
        fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: defOpts.userPrompt || body.prompt })
        }).then(function(res) { return res.json(); }).then(function(data) { resolve((data && data.response) || '<response failed>'); }).catch(function() { reject(new Error('Cloud AI error')); });
      } else { localOllama(); }

      function localOllama() {
        var payload = JSON.stringify({ messages: [{ role: 'user', content: defOpts.userPrompt || body.prompt }], model: defOpts.model, max_tokens: defOpts.max_tokens, temperature: defOpts.temperature });
        var req = http.request({ hostname: ollamaHost, port: 11434, path: '/v1/chat/completions', method: 'POST', headers: { 'Content-Type': 'application/json' }, timeout: 120e3 }, function(res) {
          var ch = []; res.on('data', function(c) { ch.push(c); });
          res.on('end', function() {
            try { resolve(JSON.parse(Buffer.concat(ch).toString())?.choices?.[0]?.message.content || '...OllamaResponseError' ); } catch (e) { reject(e); }
          });
        }); req.on('error', reject); req.on('timeout', function() { req.destroy(); reject(new Error('Request timed out')); }); req.end(payload);
      }
    });
  };
}

// ─── POST /api/auto-fetch-rss - Fetch 10-20 RSS stories ──────────
router.post('/auto-fetch-rss', authenticate, adminOnly, async function(req, res) {
  var aiProvider = req.body.aiProvider || 'local';
  var ollamaModelOverride = req.body.ollamaModel || undefined;
  var ollamaHostOverride = req.body.ollamaUrl || undefined;
  var autoPublish = req.body.autoPublish !== undefined ? req.body.autoPublish : true;
  var categoriesToFetch = req.body.categories || Object.keys(RSS_SOURCES);

  try {
    var totalGenerated = 0;
    var totalSkipped = 0;
    var errors = [];

    // Fetch ALL sources in all categories for max stories
    for (var ci = 0; ci < categoriesToFetch.length; ci++) {
      var cat = categoriesToFetch[ci];
      var sources = RSS_SOURCES[cat];
      if (!sources) continue;

      for (var si = 0; si < sources.length; si++) {
        try {
          var source = sources[si];
          var items = await fetchRSS(source.feed);
          
          if (!items || items.length === 0) {
            totalSkipped++;
            continue;
          }

          // Take up to 3 articles per source
          var count = Math.min(3, items.length);
          for (var ii = 0; ii < count; ii++) {
            var item = items[ii];
            
            var storyData = {
              headline: item.title.substring(0, 100),
              summary: item.description.substring(0, 500),
              hindi_headline: '',
              hindi_summary: ''
            };

            // Try AI enhancement if available
            try {
              var prompt = 'You are a professional news editor. Given the following news article, create a refined version with Hindi translation.\n\n';
              prompt += 'Respond ONLY with valid JSON:\n';
              prompt += '{"headline":"Catchy English headline under 100 chars","summary":"One paragraph English summary 60-120 words","hindi_headline":"Hindi Devanagari headline translation","hindi_summary":"Hindi Devanagari summary translation"}\n\n';
              prompt += 'Original Title: ' + item.title + '\n';
              prompt += 'Original Content: ' + item.description.substring(0, 3000);

              var callOpts = {};
              if (aiProvider === 'local') {
                if (ollamaModelOverride) callOpts.model = ollamaModelOverride;
                if (ollamaHostOverride) callOpts.host = ollamaHostOverride;
              }
              var aiCall = callAI(callOpts);
              var rawResponse = await Promise.race([
                aiCall({ userPrompt: prompt, maxTokens: '2000', aiProvider: aiProvider }),
                new Promise(function(r){ setTimeout(function(){ r(null); }, 30e3); })
              ]);
              if (rawResponse) {
                var jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  var parsed = JSON.parse(jsonMatch[0]);
                  if (parsed.headline && parsed.summary) storyData = parsed;
                }
              }
            } catch (aiErr) {}

            var storyId = 'rss-' + Date.now() + '-' + ci + '-' + si + '-' + ii;
            var statusToUse = autoPublish ? 'approved' : 'pending';

            db.prepare(
              'INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, hindiSummary, category, source, link, regions, status, country)' +
              ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).run(
              storyId,
              (storyData.headline || '').substring(0, 300),
              (storyData.summary || '').substring(0, 2000),
              JSON.stringify([{ text: (storyData.summary || '').substring(0, 500) }]),
              (storyData.hindi_headline || '').substring(0, 300),
              (storyData.hindi_summary || '').substring(0, 2000),
              cat,
              source.name,
              item.link || '',
              JSON.stringify(['global', source.country || 'global']),
              statusToUse,
              source.country || 'global'
            );

            totalGenerated++;
          }
        } catch (e) {
          errors.push(cat + ': ' + e.message);
        }
      }
    }

    if (typeof router.broadcastUpdate === 'function' && totalGenerated > 0) {
      router.broadcastUpdate({ type: 'new_story', autoGenerated: true }, 'story');
    }

    res.json({
      message: 'RSS Auto-fetch complete',
      totalGenerated: totalGenerated,
      totalSkipped: totalSkipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('[auto-fetch-rss] error:', err);
    res.status(500).json({ error: 'Auto-fetch failed', details: err.message });
  }
});

// Keep old endpoint for backward compatibility
router.post('/auto-fetch-ai', authenticate, adminOnly, async function(req, res) {
  var aiProvider = req.body.aiProvider || 'local';
  var ollamaModelOverride = req.body.ollamaModel || undefined;
  var ollamaHostOverride = req.body.ollamaUrl || undefined;
  var autoPublish = req.body.autoPublish !== undefined ? req.body.autoPublish : true;
  var categoriesToFetch = req.body.categories || Object.keys(RSS_SOURCES);
  var totalGenerated = 0;
  var totalSkipped = 0;
  var errors = [];
  try {
    for (var ci = 0; ci < categoriesToFetch.length; ci++) {
      var cat = categoriesToFetch[ci];
      var sources = RSS_SOURCES[cat];
      if (!sources) continue;
      for (var si = 0; si < sources.length; si++) {
        try {
          var source = sources[si];
          var items = await fetchRSS(source.feed);
          if (!items || items.length === 0) { totalSkipped++; continue; }
          var count = Math.min(3, items.length);
          for (var ii = 0; ii < count; ii++) {
            var item = items[ii];
            var storyData = { headline: item.title.substring(0, 100), summary: item.description.substring(0, 500), hindi_headline: '', hindi_summary: '' };
            try {
              var prompt = 'You are a professional news editor. Given the following news article, create a refined version with Hindi translation.\n\n';
              prompt += 'Respond ONLY with valid JSON:\n';
              prompt += '{"headline":"Catchy English headline under 100 chars","summary":"One paragraph English summary 60-120 words","hindi_headline":"Hindi Devanagari headline translation","hindi_summary":"Hindi Devanagari summary translation"}\n\n';
              prompt += 'Original Title: ' + item.title + '\n';
              prompt += 'Original Content: ' + item.description.substring(0, 3000);
              var callOpts = {};
              if (aiProvider === 'local') {
                if (ollamaModelOverride) callOpts.model = ollamaModelOverride;
                if (ollamaHostOverride) callOpts.host = ollamaHostOverride;
              }
              var aiCall = callAI(callOpts);
              var rawResponse = await Promise.race([aiCall({ userPrompt: prompt, maxTokens: '2000', aiProvider: aiProvider }), new Promise(function(r){ setTimeout(function(){ r(null); }, 30e3); })]);
              if (rawResponse) {
                var jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) { var parsed = JSON.parse(jsonMatch[0]); if (parsed.headline && parsed.summary) storyData = parsed; }
              }
            } catch (aiErr) {}
            var storyId = 'rss-' + Date.now() + '-' + ci + '-' + si + '-' + ii;
            var statusToUse = autoPublish ? 'approved' : 'pending';
            db.prepare(
              'INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, hindiSummary, category, source, link, regions, status, country)' +
              ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).run(
              storyId, (storyData.headline || '').substring(0, 300), (storyData.summary || '').substring(0, 2000),
              JSON.stringify([{ text: (storyData.summary || '').substring(0, 500) }]),
              (storyData.hindi_headline || '').substring(0, 300), (storyData.hindi_summary || '').substring(0, 2000),
              cat, source.name, item.link || '', JSON.stringify(['global', source.country || 'global']), statusToUse, source.country || 'global'
            );
            totalGenerated++;
          }
        } catch (e) { errors.push(cat + ': ' + e.message); }
      }
    }
    if (typeof router.broadcastUpdate === 'function' && totalGenerated > 0) {
      router.broadcastUpdate({ type: 'new_story', autoGenerated: true }, 'story');
    }
    res.json({ message: 'RSS Auto-fetch complete', totalGenerated: totalGenerated, totalSkipped: totalSkipped, errors: errors.length > 0 ? errors : undefined });
  } catch (err) {
    console.error('[auto-fetch-ai] error:', err);
    res.status(500).json({ error: 'Auto-fetch failed', details: err.message });
  }
});

// ╔══════════════════════════════════════════════════════════════╗
// ║       RESEARCH — Chat with Ollama                           ║
// ╚══════════════════════════════════════════════════════════════╝

// ─── POST /api/research/ask - Ask Ollama a question ─────────────
router.post('/research/ask', authenticate, async function(req, res) {
  const { question, aiProvider, ollamaModel, ollamaUrl } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });

  try {
    var callOpts = {};
    var provider = aiProvider || 'local';
    var model = ollamaModel || 'qwen3.5:latest';
    var host = ollamaUrl || 'localhost:11434';
    
    if (provider === 'local') {
      callOpts.model = model;
      callOpts.host = host;
    }

    var aiCall = callAI(callOpts);
    var prompt = 'You are a helpful AI research assistant. Answer the following question thoroughly and accurately:\n\n' + question;
    
    var rawResponse = await Promise.race([
      aiCall({ userPrompt: prompt, maxTokens: '4000', aiProvider: provider }),
      new Promise(function(r){ setTimeout(function(){ r('Request timed out. Please try again.'); }, 60e3); })
    ]);

    res.json({ answer: rawResponse || 'No response from AI' });
  } catch (err) {
    console.error('[research] error:', err);
    res.status(500).json({ error: 'Research failed', details: err.message });
  }
});

// ─── POST /api/gen-story - Generate AI story from seed text ──
router.post('/gen-story', authenticate, adminOnly, async function(req, res) {
  const { headline, summary } = req.body;

  var aiProviderGen = req.body.aiProvider || 'local';
  var ollamaModelGen = req.body.ollamaModel || undefined;
  var ollamaHostGen = req.body.ollamaUrl || undefined;

  var callOptsGen = {};
  if (aiProviderGen === 'local') {
    if (ollamaModelGen) callOptsGen.model = ollamaModelGen;
    if (ollamaHostGen) callOptsGen.host = ollamaHostGen;
  }

  var aiCall = callAI(callOptsGen);
  var promptText = 'Refine this story into JSON: {"headline":"Refined catchy title","summary":"Full paragraph 60-120 words rich","hindi_headline":"H Devanagari translation","hindi_summary":"H Translation"}\n\nSeed:\nHeadline: ' + (headline || '') + '\nSummary: ' + (summary || '');

  try {
    var rawResponse = await aiCall({ userPrompt: promptText, aiProvider: req.body.aiProvider });
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');
    
    var storyData = JSON.parse(jsonMatch[0]);
    res.json({ 
      headline: storyData.headline || '', 
      summary: storyData.summary || '', 
      hindiHeadline: storyData.hindi_headline || '', 
      hindiSummary: storyData.hindi_summary || '' 
    });
  } catch (err) {
    console.error('[gen-story] error:', err);
    res.status(500).json({ error: 'Generation failed', details: err.message });
  }
});

// ─── POST /api/translate-hi - Translate to Hindi ──
router.post('/translate-hi', authenticate, async function(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  var aiProviderTr = req.body.aiProvider || 'local';
  var ollamaModelTr = req.body.ollamaModel || undefined;
  var ollamaHostTr = req.body.ollamaUrl || undefined;
  
  var callOptsTr = {};
  if (aiProviderTr === 'local') {
    if (ollamaModelTr) callOptsTr.model = ollamaModelTr;
    if (ollamaHostTr) callOptsTr.host = ollamaHostTr;
  }

  var aiCall = callAI(callOptsTr);
  try {
    var rawResponse = await aiCall({ userPrompt: 'Translate to Hindi in Devanagari:\n' + text, aiProvider: req.body.aiProvider });
    res.json({ hindiText: (rawResponse || '').trim() || '<translation failed>' });
  } catch (err) {
    console.error('[translate-hi] error:', err);
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

module.exports = router;