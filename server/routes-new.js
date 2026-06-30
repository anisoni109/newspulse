// ─── GET /api/stories - Get stories for public feed (approved only) ──────
router.get('/stories', (req, res) => {
  const { category, limit = 20, page = 1 } = req.query;
  
  let query = 'SELECT rowid AS serialNo, * FROM stories WHERE status = "approved"';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ` ORDER BY createdAt DESC LIMIT ${parseInt(limit)} OFFSET ${(parseInt(page) - 1) * parseInt(limit)}`;

  try {
    const stmt = db.prepare(query);
    const stories = stmt.all(...params);

    const parsedStories = stories.map(s => ({
      ...s,
      extendedSummary: JSON.parse(s.extendedSummary || '[]'),
      hindiExtendedSummary: JSON.parse(s.hindiExtendedSummary || '[]'),
      regions: JSON.parse(s.regions || '["global"]')
    }));

    res.json(parsedStories);
  } catch (error) {
    console.error('Stories query error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// ─── POST /api/auto-fetch-ai - Scrape sources + generate stories via Qwen3 ──
router.post('/auto-fetch-ai', authenticate, async function(req, res) {
  const https = require('https');
  const http = require('http');
  
  // Call Ollama for AI text generation
  function callOllama(systemPrompt, userPrompt, maxTokens) {
    if (maxTokens === undefined) maxTokens = 1500;
    
    return new Promise(function(resolve, reject) {
      const payload = JSON.stringify({
        model: 'qwen3-coder:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = http.request(options, function(resp) {
        let data = '';
        resp.on('data', function(c) { data += c; });
        resp.on('end', function() {
          try {
            const json = JSON.parse(data);
            resolve(json.choices && json.choices[0] && json.choices[0].message ? 
              json.choices[0].message.content : '');
          } catch (e) { reject(new Error('Ollama parse error')); }
        });
      });

      req.on('error', function(err) { reject(err); });
      req.write(payload);
      req.end();
    });
  }

  // Simple web scraper
  function scrapeWeb(urlStr) {
    return new Promise(function(resolve, reject) {
      const client = urlStr.startsWith('https') ? https : http;
      client.get(urlStr, function(res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          scrapeWeb(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode === 403 || res.statusCode === 503) {
          resolve('');
          return;
        }
        let html = '';
        res.on('data', function(chunk) { html += chunk; });
        res.on('end', function() {
          const text = html
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<!--[\s\S]*?-->/g, ' ')
            .replace(/<[a-zA-Z0-9]+[^>]*>/g, ' ')
            .replace(/<\/[a-zA-Z0-9]+>/g, ' ')
            .replace(/[ \t\n\r]+/g, ' ')
            .trim();
          resolve(text.substring(0, 8000));
        });
      }).on('error', function(err) { reject(err); });
    });
  }

  try {
    const newsSources = [
      { category: 'world', url: 'https://www.bbc.com/news' },
      { category: 'technology', url: 'https://techcrunch.com/' },
      { category: 'business', url: 'https://www.cnbc.com/world/?region=world' },
      { category: 'sports', url: 'https://www.espn.com/' },
      { category: 'science', url: 'https://www.nature.com/news' }
    ];

    const generatedStories = [];

    for (let si = 0; si < newsSources.length; si++) {
      var source = newsSources[si];
      try {
        var rawContent = await scrapeWeb(source.url);
        if (!rawContent || rawContent.length < 200) continue;

        var aiPrompt = 'You are a professional journalist. Respond ONLY with valid JSON object, no code blocks, no markdown formatting, no backticks. Just the raw JSON.\n\n';
        aiPrompt += 'Based on this scraped web content generate ONE news article in EXACTLY this JSON structure: {"headline":"short headline 80 chars max","summary":"one paragraph summary 40 to 100 words","hindi_headline":"Hindi translation Devanagari script","hindi_summary":"Hindi translation of the summary"}\n\n';
        aiPrompt += 'Source content:\n' + rawContent.substring(0, 5000);

        var aiRes = await callOllama(aiPrompt, '', 1500);

        const jsonMatch = aiRes.match(/\{[\s\S]*\}/);
        if (!jsonMatch) { console.log('No JSON from Ollama for ' + source.category); continue; }

        var storyData = JSON.parse(jsonMatch[0]);
        if (!storyData.headline || !storyData.summary) continue;

        var storyId = 'ai-' + source.category + '-' + Date.now() + '-' + 
          Math.random().toString(36).substr(2, 8);

        db.prepare(
          'INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, ' +
          'hindiSummary, hindiExtendedSummary, category, source, link, regions, status) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
          storyId,
          (storyData.headline || '').substring(0, 300),
          (storyData.summary || '').substring(0, 2000),
          JSON.stringify([{ text: (storyData.summary || '').substring(0, 500) }]),
          (storyData.hindi_headline || '').substring(0, 300),
          (storyData.hindi_summary || '').substring(0, 2000),
          '[]',
          source.category,
          'AI + Web Scrape' + source.url,
          JSON.stringify(['global']),
          'approved'
        );

        if (typeof broadcastUpdate === 'function') {
          broadcastUpdate({ type: 'new_story', id: storyId, headline: storyData.headline, category: source.category, status: 'approved' }, 'story');
        }

        generatedStories.push({ id: storyId, headline: storyData.headline, category: source.category });
      } catch (e) {
        console.log('Skipped ' + source.category + ':', e.message);
      }
    }

    res.json({
      message: 'AI Auto-fetch complete',
      storiesGenerated: generatedStories,
      totalGenerated: generatedStories.length
    });
  } catch (error) {
    console.error('Auto-fetch error:', error);
    res.status(500).json({ error: 'AI auto-fetch failed', details: error.message });
  }
});

// ─── AI Gen-story from seed text ──
router.post('/ai/gen-story', authenticate, async function(req, res) {
  const http = require('http');
  
  function callOllama(systemPrompt, userPrompt, maxTokens) {
    if (maxThreads === undefined) maxThreads = 1500;
    
    return new Promise(function(resolve, reject) {
      var payload = JSON.stringify({
        model: 'qwen3-coder:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      var options = {
        hostname: 'localhost', port: 11434, path: '/v1/chat/completions',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      };

      var req = http.request(options, function(res) {
        var data = '';
        res.on('data', function(c) { data += c; });
        res.on('end', function() {
          try {
            const json = JSON.parse(data);
            resolve(json.choices && json.choices[0] && json.choices[0].message ? 
              json.choices[0].message.content : '');
          } catch (e) { reject(new Error('Ollama parse error')); }
        });
      });

      req.on('error', function(err) { reject(err); });
      req.write(payload);
      req.end();
    });
  }
  
  try {
    var headline = req.body.headline;
    var summary = req.body.summary;
    var promptText;
    if (headline && summary) {
      promptText = 'Refine and expand this story into JSON format: {"headline":"Refined engaging headline","summary":"Full one paragraph summary 50 to 120 words","hindi_headline":"H Devanagari translation","hindi_summary":"H translation of new summary"}\n\nSeed:\nHeadline: ' + headline;
      promptText += '\nSummary: ' + summary;
    } else {
      promptText = 'Create a complete news article in JSON format: {"headline":"Example fresh catchy headline","summary":"One paragraph summary 50 to 120 words","hindi_headline":"H Devanagari translation","hindi_summary":"Translation of new summary"}\n\nPick any trending topic and generate from scratch.';
    }

    var raw = await callOllama(
      'You are a news editor. Respond ONLY with valid JSON no markdown no extra text.', 
      promptText, 1500);
    
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');

    var aiContent = JSON.parse(jsonMatch[0]);
    res.json({
      headline: aiContent.headline || '',
      summary: aiContent.summary || '',
      hindiHeadline: aiContent.hindi_headline || '',
      hindiSummary: aiContent.hindi_summary || ''
    });
  } catch (error) {
    console.error('AI gen-story error:', error);
    res.status(500).json({ error: 'AI generation failed', details: error.message });
  }
});

// ─── AI Translate to Hindi ──
router.post('/ai/translate-hi', authenticate, async function(req, res) {
  const http = require('http');
  
  function callOllama(systemPrompt, userPrompt, maxTokens) {
    if (maxTokens === undefined) maxTokens = 300;
    
    return new Promise(function(resolve, reject) {
      var payload = JSON.stringify({
        model: 'qwen3-coder:latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      var options = {
        hostname: 'localhost', port: 11434, path: '/v1/chat/completions',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      };

      var req = http.request(options, function(res) {
        var data = '';
        res.on('data', function(c) { data += c; });
        res.on('end', function() {
          try {
            const json = JSON.parse(data);
            resolve(json.choices && json.choices[0] && json.choices[0].message ? 
              json.choices[0].message.content : '');
          } catch (e) { reject(new Error('Ollama parse error')); }
        });
      });

      req.on('error', function(err) { reject(err); });
      req.write(payload);
      req.end();
    });
  }
  
  try {
    var text = req.body.text;
    if (!text) return res.status(400).json({ error: 'Text required' });

    var raw = await callOllama(
      'You are a professional translator. Only output the Hindi translation in Devanagari script.',
      'Translate to Hindi:\n' + text, 300
    );
    res.json({ hindiText: (raw || '').trim() || '<translation failed>' });
  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

module.exports = router;