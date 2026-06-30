const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'newspulse.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables - use the original schema first, then migrate
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    extendedSummary TEXT DEFAULT '[]',
    hindiHeadline TEXT DEFAULT '',
    hindiSummary TEXT DEFAULT '',
    hindiExtendedSummary TEXT DEFAULT '[]',
    category TEXT NOT NULL,
    source TEXT DEFAULT '',
    link TEXT DEFAULT '',
    regions TEXT DEFAULT '["global"]',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    shares INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storyId TEXT NOT NULL,
    text TEXT NOT NULL,
    userId TEXT DEFAULT 'anonymous',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
  CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
`);

// ─── Migrations for existing databases ──────────────────────────
// Add country column
try { db.exec("ALTER TABLE stories ADD COLUMN country TEXT DEFAULT 'global'"); } catch (e) {}
// Add upvotes column
try { db.exec("ALTER TABLE stories ADD COLUMN upvotes INTEGER DEFAULT 0"); } catch (e) {}
// Add downvotes column
try { db.exec("ALTER TABLE stories ADD COLUMN downvotes INTEGER DEFAULT 0"); } catch (e) {}
// Add userId to comments
try { db.exec("ALTER TABLE comments ADD COLUMN userId TEXT DEFAULT 'anonymous'"); } catch (e) {}
// Add author to comments
try { db.exec("ALTER TABLE comments ADD COLUMN author TEXT DEFAULT 'Anonymous'"); } catch (e) {}

// Create votes table (may already exist from old schema, drop and recreate with UNIQUE)
try { db.exec("DROP TABLE IF EXISTS votes"); } catch (e) {}
db.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storyId TEXT NOT NULL,
    userId TEXT NOT NULL,
    voteType INTEGER NOT NULL CHECK(voteType IN (-1, 1)),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(storyId, userId),
    FOREIGN KEY (storyId) REFERENCES stories(id) ON DELETE CASCADE
  );
`);

// Create indices
try { db.exec("CREATE INDEX IF NOT EXISTS idx_stories_country ON stories(country)"); } catch (e) {}
try { db.exec("CREATE INDEX IF NOT EXISTS idx_comments_storyId ON comments(storyId)"); } catch (e) {}
try { db.exec("CREATE INDEX IF NOT EXISTS idx_votes_storyId ON votes(storyId)"); } catch (e) {}
try { db.exec("CREATE INDEX IF NOT EXISTS idx_votes_userId ON votes(userId)"); } catch (e) {}

// Insert default settings if not exists
try {
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('autoPublish', ?)").run('true');
  console.log('Database initialized: settings table with autoPublish default.');
} catch (e) {}

// Seed with fallback stories if table is empty
const countStories = db.prepare('SELECT COUNT(*) as count FROM stories');
if (countStories.get().count === 0) {
  const insertStory = db.prepare(`
    INSERT INTO stories (id, headline, summary, extendedSummary, hindiHeadline, hindiSummary, hindiExtendedSummary, category, source, link, regions, status, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const fallbackStories = [
    {
      id: "fb-world-1",
      headline: "Global Trade Routes Shift as Ports Report Record Cargo Volumes",
      summary: "Major maritime trade hubs in Singapore and Rotterdam have reported a 12% year-on-year increase in shipping volume. Industry analysts attribute the surge to shifting supply chain strategies as manufacturers seek closer-to-home logistics routes.",
      extendedSummary: JSON.stringify(["Maritime trade volume surged by 12% year-on-year", "Manufacturers shifting to regional logistics", "Congestion expected to ease by Q3"]),
      hindiHeadline: "वैश्विक व्यापार मार्गों में बदलाव: बंदरगाहों पर रिकॉर्ड कार्गो वॉल्यूम",
      hindiSummary: "सिंगापुर और रॉटरडैम के प्रमुख समुद्री व्यापार केंद्रों ने शिपिंग वॉल्यूम में 12% की वार्षिक वृद्धि दर्ज की है।",
      hindiExtendedSummary: JSON.stringify(["शिपिंग वॉल्यूम में 12% की वृद्धि", "निर्माता क्षेत्रीय नेटवर्क की तरफ"]),
      category: "world",
      source: "Reuters",
      link: "https://www.reuters.com",
      regions: JSON.stringify(["global", "in", "sg", "us"]),
      status: "approved",
      country: "global"
    },
    {
      id: "fb-tech-1",
      headline: "Tech Giants Announce Unified Security Protocol for AI Models",
      summary: "A coalition of leading technology firms has unveiled a new opensource framework for auditing security vulnerabilities in deep learning models. SafeNet aims to establish standardized benchmarks.",
      extendedSummary: JSON.stringify(["New open-source security framework released", "SafeNet establishes data poisoning defense standards", "Rollout begins next month"]),
      hindiHeadline: "AI मॉडल्स के लिए टेक दिग्गजों ने एकजुट सुरक्षा प्रोटोकॉल की घोषणा की",
      hindiSummary: "अग्रणी तकनीकी कंपनियों के गठबंधन ने डीप लर्निंग मॉडल्स में सुरक्षा कमजोरियों का परीक्षण करने के लिए एक नया ओपन-सोर्स फ्रेमवर्क प्रकाशित किया है।",
      hindiExtendedSummary: JSON.stringify(["नया ओपन-सोर्स सुरक्षा फ्रेमवर्क जारी", "SafeNet डेटा सुरक्षा मानक स्थापित करता है"]),
      category: "technology",
      source: "The Verge",
      link: "https://www.theverge.com",
      regions: JSON.stringify(["global", "us", "in"]),
      status: "approved",
      country: "us"
    },
    {
      id: "fb-business-1",
      headline: "Central Bank Maintains Interest Rates Amid Inflation Slowdown",
      summary: "The Federal Reserve announced it will keep current interest rates steady, citing encouraging signs of cooling consumer prices. Economists predict the first rate cuts could begin as early as September.",
      extendedSummary: JSON.stringify(["Fed keeps rates steady", "Inflation shows cooling signs", "Rate cuts expected by September"]),
      hindiHeadline: "मंदी के बीच केंद्रीय बैंक ने ब्याज दरों को बनाए रखा",
      hindiSummary: "फेडरल रिज़र्व ने घोषणा की कि वर्तमान ब्याज दरों को स्थिर रखेगा।",
      hindiExtendedSummary: JSON.stringify(["फेड ने दरों को स्थिर रखा", "महंगाई में ठंडक के संकेत"]),
      category: "business",
      source: "BBC Business",
      link: "https://www.bbc.com/news/business",
      regions: JSON.stringify(["global", "us", "gb", "in"]),
      status: "approved",
      country: "us"
    },
    {
      id: "fb-sports-1",
      headline: "Underdog Team Clinches Victory in Thrilling Championship Final",
      summary: "In one of the greatest upsets in modern sports history, the Wildcats defeated the top-seeded Titans 4-3 in extra time. A spectacular header in the 118th minute secured the trophy.",
      extendedSummary: JSON.stringify(["Wildcards win 4-3 in extra time", "Spectacular header decides match", "First championship in three decades"]),
      hindiHeadline: "डरावने चैंपियनशिप फाइनल में अंडरडॉग टीम ने जीत हासिल की",
      hindiSummary: "वाइल्डकाट्स ने एक्स्ट्रा टाइम में शीर्ष-सीडेड टाइटन्स को 4-3 से हराया।",
      hindiExtendedSummary: JSON.stringify(["वाइल्डकाट्स ने 4-3 जीता", "अद्भुत हेडर ने मैच तय किया"]),
      category: "sports",
      source: "Sky Sports",
      link: "https://www.skysports.com",
      regions: JSON.stringify(["global", "gb", "in", "au"]),
      status: "approved",
      country: "gb"
    },
    {
      id: "fb-science-1",
      headline: "Astronomers Detect Giant Water Ice Deposits on Mars' Equator",
      summary: "Using data from orbiting radar probes, scientists have mapped massive sheets of subsurface water ice near the Martian equator. The deposits could provide crucial resources for future human missions.",
      extendedSummary: JSON.stringify(["Massive water ice found at equator", "Buried under meters of dust", "Key resource for future missions"]),
      hindiHeadline: "खगोलविदों ने मंगल के भूमध्य रेखा पर विशाल जल बर्फ की खोज की",
      hindiSummary: "वैज्ञानिकों ने मंगल के भूमध्य रेखा के पास उप-सतह जल बर्फ के विशाल शीट्स को मैप किया है।",
      hindiExtendedSummary: JSON.stringify(["भूमध्य रेखा पर विशाल जल बर्फ मिली", "धूल के नीचे दबा"]),
      category: "science",
      source: "Science Daily",
      link: "https://www.sciencedaily.com",
      regions: JSON.stringify(["global", "us"]),
      status: "approved",
      country: "us"
    }
  ];

  fallbackStories.forEach(story => {
    insertStory.run(
      story.id, story.headline, story.summary, story.extendedSummary,
      story.hindiHeadline, story.hindiSummary, story.hindiExtendedSummary,
      story.category, story.source, story.link, story.regions, story.status, story.country
    );
  });

  console.log(`Seeded ${fallbackStories.length} stories into database`);
}

module.exports = db;