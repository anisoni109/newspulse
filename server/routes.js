const express = require('express');
const db = require('./db');

const router = express.Router();

// ─── Auth Middleware ──────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── GET /api/stories - Get stories (mobile app uses this) ──────
router.get('/stories', (req, res) => {
  const { category, status = 'approved', limit = 20, page = 1 } = req.query;
  
  let query = 'SELECT * FROM stories WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  // Mobile app only gets approved stories by default
  if (!status || status === 'approved') {
    query += ' AND status = "approved"';
  } else if (status === 'pending' || status === 'rejected') {
    query += ` AND status = "${status}"`;
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt((page - 1) * limit));

  const stmt = db.prepare(query);
  const stories = stmt.all(...params);

  // Parse JSON fields
  const parsedStories = stories.map(s => ({
    ...s,
    extendedSummary: JSON.parse(s.extendedSummary || '[]'),
    hindiExtendedSummary: JSON.parse(s.hindiExtendedSummary || '[]'),
    regions: JSON.parse(s.regions || '["global"]')
  }));

  res.json(parsedStories);
});

// ─── GET /api/stories/admin - Get all stories (admin dashboard) ──
router.get('/stories/admin', authenticate, (req, res) => {
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
    regions: JSON.parse(s.regions || '["global"]')
  }));

  res.json(parsedStories);
});

// ─── POST /api/stories - Create story (admin only) ──────────────
router.post('/stories', authenticate, (req, res) => {
  const {
    id, headline, summary, extendedSummary = [], hindiHeadline = '', 
    hindiSummary = '', hindiExtendedSummary = [], category, source = '', 
    link = '', regions = ['global'], status = 'pending'
  } = req.body;

  if (!headline || !summary || !category) {
    return res.status(400).json({ error: 'headline, summary, and category are required' });
  }

  const storyId = id || `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, hindiSummary, hindiExtendedSummary, category, source, link, regions, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      storyId,
      headline,
      summary,
      JSON.stringify(extendedSummary),
      hindiHeadline,
      hindiSummary,
      JSON.stringify(hindiExtendedSummary),
      category,
      source,
      link,
      JSON.stringify(regions),
      status
    );

    res.status(201).json({ 
      id: storyId, 
      headline, 
      summary, 
      category, 
      status,
      message: 'Story created successfully' 
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Story ID already exists' });
    }
    throw error;
  }
});

// ─── PUT /api/stories/:id - Update story (admin only) ───────────
router.put('/stories/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { headline, summary, extendedSummary, hindiHeadline, hindiSummary, hindiExtendedSummary, category, source, link, regions, status } = req.body;

  // Check if story exists
  const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Story not found' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE stories 
      SET headline = COALESCE(?, headline),
          summary = COALESCE(?, summary),
          extendedSummary = COALESCE(?, extendedSummary),
          hindiHeadline = COALESCE(?, hindiHeadline),
          hindiSummary = COALESCE(?, hindiSummary),
          hindiExtendedSummary = COALESCE(?, hindiExtendedSummary),
          category = COALESCE(?, category),
          source = COALESCE(?, source),
          link = COALESCE(?, link),
          regions = COALESCE(?, regions),
          status = COALESCE(?, status),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      headline || null,
      summary || null,
      extendedSummary !== undefined ? JSON.stringify(extendedSummary) : null,
      hindiHeadline || null,
      hindiSummary || null,
      hindiExtendedSummary !== undefined ? JSON.stringify(hindiExtendedSummary) : null,
      category || null,
      source || null,
      link || null,
      regions !== undefined ? JSON.stringify(regions) : null,
      status || null,
      id
    );

    res.json({ 
      message: 'Story updated successfully',
      id,
      headline: headline || existing.headline,
      summary: summary || existing.summary,
      category: category || existing.category,
      status: status || existing.status
    });
  } catch (error) {
    throw error;
  }
});

// ─── DELETE /api/stories/:id - Delete story (admin only) ─────────
router.delete('/stories/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Story not found' });
  }

  db.prepare('DELETE FROM stories WHERE id = ?').run(id);
  res.json({ message: 'Story deleted successfully', id });
});

// ─── PATCH /api/stories/:id/status - Update status (admin only) ──
router.patch('/stories/:id/status', authenticate, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending, approved, or rejected' });
  }

  const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Story not found' });
  }

  db.prepare('UPDATE stories SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
  res.json({ message: `Status updated to ${status}`, id, status });
});

// ─── POST /api/stories/bulk - Bulk update (admin only) ──────────
router.post('/stories/bulk', authenticate, (req, res) => {
  const { storyIds, action } = req.body; // action: 'approve' | 'reject' | 'delete'

  if (!storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
    return res.status(400).json({ error: 'storyIds array is required' });
  }

  if (!['approve', 'reject', 'delete'].includes(action)) {
    return res.status(400).json({ error: 'action must be approve, reject, or delete' });
  }

  try {
    const stmt = db.prepare(`UPDATE stories SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id IN (${storyIds.map(() => '?').join(',')})`);
    
    if (action === 'approve') {
      stmt.all('approved', ...storyIds);
    } else if (action === 'reject') {
      stmt.all('rejected', ...storyIds);
    } else if (action === 'delete') {
      db.prepare('DELETE FROM stories WHERE id IN (?)').run(storyIds);
    }

    res.json({ message: `Bulk ${action} completed for ${storyIds.length} stories` });
  } catch (error) {
    throw error;
  }
});

// ─── GET /api/stats - Dashboard statistics ────────────────────────
router.get('/stats', authenticate, (req, res) => {
  const totalStories = db.prepare('SELECT COUNT(*) as count FROM stories').get().count;
  const approvedStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'approved'").get().count;
  const pendingStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'pending'").get().count;
  const rejectedStories = db.prepare("SELECT COUNT(*) as count FROM stories WHERE status = 'rejected'").get().count;

  const categoryStats = db.prepare(`
    SELECT category, 
           SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
           SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM stories 
    GROUP BY category
    ORDER BY category
  `).all();

  res.json({
    totalStories,
    approvedStories,
    pendingStories,
    rejectedStories,
    categoryStats
  });
});

// ─── GET /api/categories - Get all categories with counts ─────────
router.get('/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT category, 
           SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
    FROM stories 
    GROUP BY category
    ORDER BY category
  `).all();

  res.json(categories);
});

module.exports = router;
