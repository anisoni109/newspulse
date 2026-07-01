// NewsPulse App - Real-time news aggregator with AI enhancements
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All News', icon: '🔥', color: 'from-red-500 to-orange-500', bg: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'world', label: 'World', icon: '🌍', color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'politics', label: 'Politics', icon: '⚖️', color: 'from-purple-600 to-indigo-500', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'business', label: 'Business', icon: '💼', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'technology', label: 'Technology', icon: '⚡', color: 'from-indigo-600 to-blue-500', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'startups', label: 'Startups', icon: '🚀', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-fuchsia-600 to-purple-500', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { id: 'sports', label: 'Sports', icon: '🏆', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'science', label: 'Science', icon: '🔬', color: 'from-teal-600 to-green-500', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'health', label: 'Health', icon: '❤️‍🩹', color: 'from-pink-600 to-rose-500', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'automobile', label: 'Automobile', icon: '🚗', color: 'from-slate-600 to-zinc-500', bg: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: 'from-sky-500 to-blue-400', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'fashion', label: 'Fashion', icon: '👠', color: 'from-pink-500 to-purple-400', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'education', label: 'Education', icon: '📚', color: 'from-amber-600 to-yellow-500', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: '🔮', color: 'from-gray-600 to-slate-500', bg: 'bg-gray-50 text-gray-700 border-gray-200' }
]

// ─── Real News Sources with verified URLs and RSS feeds ──────────────
const NEWS_SOURCES = {
  world: [
    { name: 'BBC News', url: 'https://www.bbc.com/news', feed: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Reuters', url: 'https://www.reuters.com', feed: 'https://www.reutersagency.com/feed/?best-topics=news&utm_term=global' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com', feed: 'https://www.aljazeera.com/xml/rss/all.xml' },
  ],
  politics: [
    { name: 'Politico', url: 'https://www.politico.com', feed: 'https://rss.politico.com/politics-policy.xml' },
    { name: 'HuffPost Politics', url: 'https://www.huffpost.com/news/politics', feed: 'https://www.huffpost.com/section/politics/feed' }
  ],
  business: [
    { name: 'BBC Business', url: 'https://www.bbc.com/news/business', feed: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
    { name: 'Reuters Business', url: 'https://www.reuters.com/business/', feed: 'https://www.reutersagency.com/feed/?best-topics=business' },
  ],
  technology: [
    { name: 'BBC Tech', url: 'https://www.bbc.com/news/technology', feed: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
    { name: 'TechCrunch', url: 'https://techcrunch.com', feed: 'https://techcrunch.com/feed/' },
    { name: 'The Verge', url: 'https://www.theverge.com', feed: 'https://www.theverge.com/rss/index.xml' },
  ],
  startups: [
    { name: 'TechCrunch Startups', url: 'https://techcrunch.com/category/startups/', feed: 'https://techcrunch.com/category/startups/feed/' }
  ],
  entertainment: [
    { name: 'BBC Entertainment', url: 'https://www.bbc.com/news/entertainment_and_arts', feed: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' },
    { name: 'Variety', url: 'https://variety.com', feed: 'https://variety.com/feed/' },
  ],
  sports: [
    { name: 'Sky Sports', url: 'https://www.skysports.com', feed: 'https://www.skysports.com/rss/12040' },
    { name: 'BBC Sport', url: 'https://www.bbc.com/sport', feed: 'https://feeds.bbci.co.uk/sport/rss.xml' },
    { name: 'Yahoo Sports', url: 'https://sports.yahoo.com', feed: 'https://sports.yahoo.com/rss/' }
  ],
  science: [
    { name: 'BBC Science', url: 'https://www.bbc.com/news/science_and_environment', feed: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
    { name: 'Science Daily', url: 'https://www.sciencedaily.com', feed: 'https://www.sciencedaily.com/rss/all.xml' },
  ],
  health: [
    { name: 'BBC Health', url: 'https://www.bbc.com/news/health', feed: 'https://feeds.bbci.co.uk/news/health/rss.xml' },
  ],
  automobile: [
    { name: 'Motor1', url: 'https://www.motor1.com', feed: 'https://www.motor1.com/rss/news/all/' },
    { name: 'Autoblog', url: 'https://www.autoblog.com', feed: 'https://www.autoblog.com/rss.xml' }
  ],
  travel: [
    { name: 'Lonely Planet', url: 'https://www.lonelyplanet.com', feed: 'https://www.lonelyplanet.com/news/feed' }
  ],
  fashion: [
    { name: 'Vogue', url: 'https://www.vogue.com', feed: 'https://www.vogue.com/feed/rss' }
  ],
  education: [
    { name: 'Chronicle of Higher Ed', url: 'https://www.chronicle.com', feed: 'https://www.chronicle.com/rss' }
  ],
  miscellaneous: [
    { name: 'HuffPost Weird News', url: 'https://www.huffpost.com/weird-news', feed: 'https://www.huffpost.com/section/weird-news/feed' }
  ]
}

// ─── Region Configurations ───────────────────────────────────────────
// ─── Granular Country Configurations ─────────────────────────────────
const COUNTRIES = [
  { id: 'global', label: 'Global (All)', icon: '🌍' },
  { id: 'us', label: 'United States', icon: '🇺🇸' },
  { id: 'gb', label: 'United Kingdom', icon: '🇬🇧' },
  { id: 'in', label: 'India', icon: '🇮🇳' },
  { id: 'ca', label: 'Canada', icon: '🇨🇦' },
  { id: 'au', label: 'Australia', icon: '🇦🇺' },
  { id: 'de', label: 'Germany', icon: '🇩🇪' },
  { id: 'sg', label: 'Singapore', icon: '🇸🇬' },
  { id: 'fr', label: 'France', icon: '🇫🇷' },
  { id: 'jp', label: 'Japan', icon: '🇯🇵' },
  { id: 'cn', label: 'China', icon: '🇨🇳' },
  { id: 'br', label: 'Brazil', icon: '🇧🇷' },
  { id: 'za', label: 'South Africa', icon: '🇿🇦' },
  { id: 'ae', label: 'United Arab Emirates', icon: '🇦🇪' },
  { id: 'il', label: 'Israel', icon: '🇮🇱' },
  { id: 'kr', label: 'South Korea', icon: '🇰🇷' },
  { id: 'it', label: 'Italy', icon: '🇮🇹' },
  { id: 'es', label: 'Spain', icon: '🇪🇸' },
  { id: 'mx', label: 'Mexico', icon: '🇲🇽' },
  { id: 'sa', label: 'Saudi Arabia', icon: '🇸🇦' },
  { id: 'tr', label: 'Turkey', icon: '🇹🇷' },
  { id: 'id', label: 'Indonesia', icon: '🇮🇩' },
  { id: 'nz', label: 'New Zealand', icon: '🇳🇿' },
  { id: 'ru', label: 'Russia', icon: '🇷🇺' }
]

const COUNTRY_WORLD_FEEDS = {
  global: [
    { name: 'BBC World', feed: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Reuters World', feed: 'https://www.reutersagency.com/feed/?best-topics=news&utm_term=global' },
    { name: 'Al Jazeera World', feed: 'https://www.aljazeera.com/xml/rss/all.xml' }
  ],
  us: [
    { name: 'CNN Top News', feed: 'https://rss.cnn.com/rss/cnn_topstories.rss' },
    { name: 'USA Today', feed: 'https://rssfeeds.usatoday.com/usatoday-NewsTopStories' },
    { name: 'BBC US & Canada', feed: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml' }
  ],
  gb: [
    { name: 'BBC UK News', feed: 'https://feeds.bbci.co.uk/news/rss.xml' },
    { name: 'Sky News UK', feed: 'https://news.sky.com/info/rss' },
    { name: 'Reuters UK', feed: 'https://www.reutersagency.com/feed/?best-topics=news' }
  ],
  in: [
    { name: 'NDTV India', feed: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
    { name: 'Times of India', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
  ],
  ca: [
    { name: 'CBC News Canada', feed: 'https://www.cbc.ca/cctoc/blogs/rss-feed' },
    { name: 'Global News Canada', feed: 'https://globalnews.ca/feed/' }
  ],
  au: [
    { name: 'ABC News Australia', feed: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
    { name: 'SBS News Australia', feed: 'https://www.sbs.com.au/news/feed' }
  ],
  de: [
    { name: 'DW News Germany', feed: 'https://rss.dw.com/rdf/rss-en-all' }
  ],
  sg: [
    { name: 'Channel News Asia', feed: 'https://www.channelnewsasia.com/rss/cna/news.xml' }
  ],
  fr: [
    { name: 'France 24 English', feed: 'https://www.france24.com/en/rss' }
  ],
  jp: [
    { name: 'NHK World Japan', feed: 'https://www3.nhk.or.jp/nhkworld/nhknews/english/index.xml' }
  ],
  cn: [
    { name: 'China Daily World', feed: 'https://www.chinadaily.com.cn/rss/world.xml' }
  ],
  br: [
    { name: 'Brazil Reports', feed: 'https://brazilreports.com/feed' }
  ],
  za: [
    { name: 'Daily Maverick SA', feed: 'https://www.dailymaverick.co.za/feed/' }
  ],
  ae: [
    { name: 'The National UAE', feed: 'https://www.thenationalnews.com/rss/' }
  ],
  il: [
    { name: 'Haaretz English', feed: 'https://www.haaretz.com/cmlLink/email-rss-haaretz-news-1.5173322' }
  ],
  kr: [
    { name: 'Yonhap News Korea', feed: 'https://en.yna.co.kr/RSS/index.xml' }
  ],
  it: [
    { name: 'ANSA English Italy', feed: 'https://www.ansa.it/english/news/news.xml' }
  ],
  es: [
    { name: 'El Pais English Spain', feed: 'https://english.elpais.com/rss/' }
  ],
  mx: [
    { name: 'Mexico News Daily', feed: 'https://mexiconewsdaily.com/feed/' }
  ],
  sa: [
    { name: 'Arab News Saudi', feed: 'https://www.arabnews.com/rss.xml' }
  ],
  tr: [
    { name: 'Daily Sabah Turkey', feed: 'https://www.dailysabah.com/rss/' }
  ],
  id: [
    { name: 'Jakarta Post Indonesia', feed: 'https://www.thejakartapost.com/feed' }
  ],
  nz: [
    { name: 'RNZ News NZ', feed: 'https://www.rnz.co.nz/rss/news.xml' }
  ],
  ru: [
    { name: 'Moscow Times Russia', feed: 'https://www.themoscowtimes.com/feeds/rss' }
  ]
}

// ─── CORS Proxies for RSS Feeds (multiple fallbacks) ────────────────────────────────
const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
]

// ─── Country-specific sources per category ───────────────────────────
function getCountrySources(country, category) {
  if (category === 'all') return null
  
  const countryFeeds = COUNTRY_CATEGORY_FEEDS[country] || {}
  const sources = countryFeeds[category]
  
  if (!sources || sources.length === 0) return null
  
  // Shuffle and return up to 2 sources per category for variety
  return [...sources].sort(() => Math.random() - 0.5).slice(0, 2)
}

// Country × Category RSS feeds database
const COUNTRY_CATEGORY_FEEDS = {
  in: {
    world: [
      { name: 'NDTV World', feed: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
      { name: 'Times of India World', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
    ],
    business: [
      { name: 'Economic Times', feed: 'https://economictimes.indiatimes.com/rssdefaultpath.cms' },
      { name: 'Moneycontrol Business', feed: 'https://www.moneycontrol.com/rss/business.xml' }
    ],
    technology: [
      { name: 'YourStory Tech', feed: 'https://yourstory.com/tech/feed' },
      { name: 'Inc42', feed: 'https://inc42.com/feed/' }
    ],
    sports: [
      { name: 'ESPNcricinfo', feed: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml' },
      { name: 'Sportskeeda', feed: 'https://www.sportskeeda.com/feed/' }
    ],
    entertainment: [
      { name: 'Filmfare Bollywood', feed: 'https://www.filmfare.com/rss.xml' },
      { name: 'India Today Entertainment', feed: 'https://www.indiatoday.in/entertainment/rss' }
    ],
    health: [
      { name: 'Healthshots India', feed: 'https://www.healthshots.com/feed/' },
      { name: 'TOI Health', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
    ],
    startups: [
      { name: 'YourStory Startups', feed: 'https://yourstory.com/startups/feed' },
      { name: 'Inc42 Media', feed: 'https://inc42.com/feed/' }
    ],
    politics: [
      { name: 'NDTV India', feed: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
      { name: 'India Today Politics', feed: 'https://www.indiatoday.in/india/rss' }
    ],
    science: [
      { name: 'Science India', feed: 'https://www.scienceindia.in/feed/' },
      { name: 'TOI Science', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
    ],
    automobile: [
      { name: 'Overdrive India', feed: 'https://www.overdrive.in/feed/' },
      { name: 'GT Auto India', feed: 'https://www.gtautoindia.com/feed/' }
    ],
    travel: [
      { name: 'India Today Travel', feed: 'https://www.indiatoday.in/travel/rss' },
      { name: 'Hindustan Times Travel', feed: 'https://www.hindustantimes.com/feed' }
    ],
    fashion: [
      { name: 'Vogue India', feed: 'https://www.vogue.in/rss.xml' },
      { name: 'Elle India', feed: 'https://www.elle.com/feed/' }
    ],
    education: [
      { name: 'Education Times India', feed: 'https://www.educationtimes.com/feed/' },
      { name: 'TOI Education', feed: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' }
    ],
    miscellaneous: [
      { name: 'India Today Weird', feed: 'https://www.indiatoday.in/feed/' },
      { name: 'Hindustan Times', feed: 'https://www.hindustantimes.com/feed' }
    ]
  },
  us: {
    world: [
      { name: 'CNN Top News', feed: 'https://rss.cnn.com/rss/cnn_topstories.rss' },
      { name: 'USA Today', feed: 'https://rssfeeds.usatoday.com/usatoday-NewsTopStories' }
    ],
    politics: [
      { name: 'Politico', feed: 'https://rss.politico.com/politics-policy.xml' },
      { name: 'HuffPost Politics', feed: 'https://www.huffpost.com/section/politics/feed' }
    ],
    business: [
      { name: 'CNBC Business', feed: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114' },
      { name: 'Forbes', feed: 'https://www.forbes.com/feed/' }
    ],
    technology: [
      { name: 'TechCrunch', feed: 'https://techcrunch.com/feed/' },
      { name: 'The Verge', feed: 'https://www.theverge.com/rss/index.xml' }
    ],
    sports: [
      { name: 'ESPN', feed: 'https://www.espn.com/espn/rss/news' },
      { name: 'Sports Illustrated', feed: 'https://www.si.com/rss/topstories.rss' }
    ],
    entertainment: [
      { name: 'Variety', feed: 'https://variety.com/feed/' },
      { name: 'Hollywood Reporter', feed: 'https://www.hollywoodreporter.com/feed/' }
    ],
    health: [
      { name: 'WebMD Health', feed: 'https://www.webmd/rss/health.rss' },
      { name: 'Healthline', feed: 'https://www.healthline.com/rss/health' }
    ],
    science: [
      { name: 'Science Daily', feed: 'https://www.sciencedaily.com/rss/all.xml' },
      { name: 'NASA Science', feed: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' }
    ],
    automobile: [
      { name: 'Motor1 US', feed: 'https://www.motor1.com/rss/news/all/' },
      { name: 'Car and Driver', feed: 'https://www.caranddriver.com/feed/' }
    ],
    travel: [
      { name: 'Travel + Leisure', feed: 'https://www.travelandleisure.com/feed' }
    ],
    education: [
      { name: 'Chronicle of Higher Ed', feed: 'https://www.chronicle.com/rss' },
      { name: 'EdSurge', feed: 'https://www.edsurge.com/feed' }
    ]
  },
  gb: {
    world: [
      { name: 'BBC News UK', feed: 'https://feeds.bbci.co.uk/news/rss.xml' },
      { name: 'Sky News UK', feed: 'https://news.sky.com/info/rss' }
    ],
    politics: [
      { name: 'The Guardian Politics', feed: 'https://www.theguardian.com/politics/rss' },
      { name: 'BBC Politics', feed: 'https://feeds.bbci.co.uk/news/politics/rss.xml' }
    ],
    business: [
      { name: 'BBC Business', feed: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
      { name: 'The Guardian Business', feed: 'https://www.theguardian.com/business/rss' }
    ],
    technology: [
      { name: 'BBC Tech', feed: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
      { name: 'The Register', feed: 'https://www.theregister.com/headlines.atom' }
    ],
    sports: [
      { name: 'Sky Sports', feed: 'https://www.skysports.com/rss/12040' },
      { name: 'BBC Sport', feed: 'https://feeds.bbci.co.uk/sport/rss.xml' }
    ],
    entertainment: [
      { name: 'BBC Entertainment', feed: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' },
      { name: 'The Guardian Culture', feed: 'https://www.theguardian.com/culture/rss' }
    ],
    health: [
      { name: 'NHS News', feed: 'https://feeds.bbci.co.uk/news/health/rss.xml' },
      { name: 'The Guardian Health', feed: 'https://www.theguardian.com/society/health-and-wellbeing-rss' }
    ],
    science: [
      { name: 'BBC Science', feed: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
      { name: 'New Scientist', feed: 'https://www.newscientist.com/feed/home' }
    ],
    automobile: [
      { name: 'Top Gear', feed: 'https://www.topgear.com/rss/news' }
    ],
    travel: [
      { name: 'The Guardian Travel', feed: 'https://www.theguardian.com/travel/rss' }
    ]
  },
  au: {
    world: [
      { name: 'ABC News Australia', feed: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
      { name: 'SBS News Australia', feed: 'https://www.sbs.com.au/news/feed' }
    ],
    politics: [
      { name: 'ABC Politics', feed: 'https://www.abc.net.au/news/feed/politics/rss.xml' },
      { name: 'Guardian Australia Politics', feed: 'https://www.theguardian.com/australia-news/politics/rss' }
    ],
    business: [
      { name: 'Australian Financial Review', feed: 'https://www.afr.com/feed' },
      { name: 'ABC Business', feed: 'https://www.abc.net.au/news/feed/business/rss.xml' }
    ],
    technology: [
      { name: 'The AFR Tech', feed: 'https://www.afr.com/technology/feed' },
      { name: 'News.com.au Tech', feed: 'https://www.news.com.au/feed' }
    ],
    sports: [
      { name: 'ESPN Australia', feed: 'https://www.espn.com.au/espn/rss/news' },
      { name: 'ABC Sport', feed: 'https://www.abc.net.au/sport/rss' }
    ]
  },
  ca: {
    world: [
      { name: 'CBC News Canada', feed: 'https://www.cbc.ca/cctoc/blogs/rss-feed' },
      { name: 'Global News Canada', feed: 'https://globalnews.ca/feed/' }
    ],
    politics: [
      { name: 'CBC Politics', feed: 'https://www.cbc.ca/news/politics/rss' },
      { name: 'CTV National News', feed: 'https://national.ctvnews.ca/ca/rss' }
    ],
    business: [
      { name: 'Globe and Mail Business', feed: 'https://www.theglobeandmail.com/feed/business/feed/' },
      { name: 'CBC Business', feed: 'https://www.cbc.ca/news/business/rss' }
    ],
    technology: [
      { name: 'BetaKit Canada', feed: 'https://betakit.com/feed' },
      { name: 'Digital Journal Tech', feed: 'https://www.digitaljournal.com/topic/technology/feed' }
    ],
    sports: [
      { name: 'CBC Sport', feed: 'https://www.cbc.ca/sports/rss' },
      { name: 'TSN Sports', feed: 'https://www.tsn.ca/rssfeeds' }
    ]
  },
  de: {
    world: [
      { name: 'DW News Germany', feed: 'https://rss.dw.com/rdf/rss-en-all' },
      { name: 'Deutsche Welle Top Stories', feed: 'https://www.dw.com/en/top-stories/rss' }
    ],
    politics: [
      { name: 'DW Politics', feed: 'https://www.dw.com/en/politics/rss' },
      { name: 'Tagesschau Politik', feed: 'https://www.tagesschau.de/xml/rss2/' }
    ],
    business: [
      { name: 'Handelsblatt Business', feed: 'https://www.handelsblatt.com/articles/index.xml' },
      { name: 'DW Business', feed: 'https://www.dw.com/en/business-economy/rss' }
    ],
    technology: [
      { name: 'Heise Online', feed: 'https://www.heise.de/ix/news-2.xml' },
      { name: 'Golem News', feed: 'https://www.golem.de/rss' }
    ]
  },
  fr: {
    world: [
      { name: 'France 24 English', feed: 'https://www.france24.com/en/rss' },
      { name: 'RFI Monde', feed: 'https://www.rfi.fr/fr/rss' }
    ],
    politics: [
      { name: 'Le Monde Politics', feed: 'https://www.lemonde.fr/rss/une.xml' },
      { name: 'France 24 France', feed: 'https://www.france24.com/fr/rss' }
    ],
    business: [
      { name: 'Les Echos Business', feed: 'https://www.lesechos.fr/rss/feed.xml' },
      { name: 'BFM Business', feed: 'https://www.bfmtv.com/rss/' }
    ],
    technology: [
      { name: '01net Tech', feed: 'https://www.01net.com/actualites/feed' },
      { name: 'Le Monde Tech', feed: 'https://www.lemonde.fr/informatique-et-internet/rss_une.xml' }
    ]
  },
  jp: {
    world: [
      { name: 'NHK World Japan', feed: 'https://www3.nhk.or.jp/nhkworld/nhknews/english/index.xml' },
      { name: 'Japan Times', feed: 'https://www.japantimes.co.jp/feed/atom/news/' }
    ],
    business: [
      { name: 'Nikkei Asia Business', feed: 'https://asia.nikkei.com/rss/business' },
      { name: 'NHK World Business', feed: 'https://www3.nhk.or.jp/nhkworld/en/news/list.rss' }
    ],
    technology: [
      { name: 'Nikkei Tech', feed: 'https://asia.nikkei.com/rss/Tech' },
      { name: 'ITmedia Japan', feed: 'https://www.itmedia.co.jp/headline/feed2.atom' }
    ]
  },
  sg: {
    world: [
      { name: 'Channel News Asia', feed: 'https://www.channelnewsasia.com/rss/cna/news.xml' },
      { name: 'Straits Times Singapore', feed: 'https://www.straitstimes.com/singapore/feed' }
    ],
    business: [
      { name: 'Business Times SG', feed: 'https://www.businesstimes.com.sg/rss' },
      { name: 'CNA Business', feed: 'https://www.channelnewsasia.com/rss/cna/business.xml' }
    ],
    technology: [
      { name: 'Tech in Asia Singapore', feed: 'https://www.techinasia.com/feed' },
      { name: 'CNA Tech', feed: 'https://www.channelnewsasia.com/rss/cna/tech-digital.xml' }
    ]
  },
  kr: {
    world: [
      { name: 'Yonhap News Korea', feed: 'https://en.yna.co.kr/RSS/index.xml' },
      { name: 'Korea Herald', feed: 'https://www.koreaherald.com/rss' }
    ],
    business: [
      { name: 'Korea Economic Daily', feed: 'https://en.mk.co.kr/news/rss/10020001/' },
      { name: 'Yonhap Business', feed: 'https://en.yna.co.kr/RSS/index.xml' }
    ],
    technology: [
      { name: 'Korea Times Tech', feed: 'https://www.koreatimes.co.uk/www/rss/tech.rss' },
      { name: 'Yonhap Tech', feed: 'https://en.yna.co.kr/RSS/index.xml' }
    ]
  },
  br: {
    world: [
      { name: 'G1 Brasil', feed: 'https://g1.globo.com/DiaLanche/rss2/' },
      { name: 'UOL News Brazil', feed: 'https://noticias.uol.com.br/rss/feed.xml' }
    ],
    business: [
      { name: 'InfoMoney Brasil', feed: 'https://www.infomoney.com.br/feed/' },
      { name: 'Valor Economico', feed: 'https://valor.globo.com/feeds/rss20.xml' }
    ],
    technology: [
      { name: 'Tecnoblog Brasil', feed: 'https://tecnoblog.net/feed/' },
      { name: 'G1 Tech', feed: 'https://g1.globo.com/Tecnologia/rss2/' }
    ]
  },
  za: {
    world: [
      { name: 'Daily Maverick SA', feed: 'https://www.dailymaverick.co.za/feed/' },
      { name: 'News24 South Africa', feed: 'https://www.news24.com/RSS/feeds/top-stories.xml' }
    ],
    politics: [
      { name: 'Daily Maverick Politics', feed: 'https://www.dailymaverick.co.za/article/' },
      { name: 'News24 Politics', feed: 'https://www.news24.com/RSS/feeds/politics.xml' }
    ],
    business: [
      { name: 'Business Day SA', feed: 'https://www.businessday.co.za/feed' },
      { name: 'Moneyweb SA', feed: 'https://www.moneyweb.co.za/feed/' }
    ]
  },
  ae: {
    world: [
      { name: 'The National UAE', feed: 'https://www.thenationalnews.com/rss/' },
      { name: 'Gulf News UAE', feed: 'https://gulfnews.com/rss' }
    ],
    business: [
      { name: 'Khaleej Times Business', feed: 'https://www.khaleejtimes.com/feed' },
      { name: 'The National Business', feed: 'https://www.thenationalnews.com/rss/business.xml' }
    ]
  },
  sa: {
    world: [
      { name: 'Arab News Saudi', feed: 'https://www.arabnews.com/rss.xml' },
      { name: 'Saudi Gazette', feed: 'https://saudigazette.com.sa/feed/' }
    ],
    business: [
      { name: 'Arab News Business', feed: 'https://www.arabnews.com/node/rss' },
      { name: 'SPA Saudi Press', feed: 'https://spa.gov.sa/rss/' }
    ]
  },
  id: {
    world: [
      { name: 'Jakarta Post Indonesia', feed: 'https://www.thejakartapost.com/feed' },
      { name: 'The Straits Times Indonesia', feed: 'https://www.straitstimes.com/asia/se-asia/feed' }
    ],
    business: [
      { name: 'Bisnis Indonesia', feed: 'https://www.bisnis.com/rss' },
      { name: 'Jakarta Post Business', feed: 'https://www.thejakartapost.com/feed/business' }
    ]
  },
  it: {
    world: [
      { name: 'ANSA English Italy', feed: 'https://www.ansa.it/english/news/news.xml' },
      { name: 'The Local Italy', feed: 'https://www.thelocal.it/feed/' }
    ],
    business: [
      { name: 'ANSA Business', feed: 'https://www.ansa.it/english/news/economy.xml' },
      { name: 'Il Sole 24 Ore', feed: 'https://www.ilsole24ore.com/notizie/rss.xml' }
    ]
  },
  es: {
    world: [
      { name: 'El Pais English Spain', feed: 'https://english.elpais.com/rss/' },
      { name: 'The Local Spain', feed: 'https://www.thelocal.es/feed/' }
    ],
    business: [
      { name: 'El Pais Business', feed: 'https://elpais.com/eeii/el_mundo_negocio/rss2.xml' },
      { name: 'Cinco Dias Expansion', feed: 'https://cincodias.elpais.com/feed/' }
    ]
  },
  mx: {
    world: [
      { name: 'Mexico News Daily', feed: 'https://mexiconewsdaily.com/feed/' },
      { name: 'El Universal Mexico', feed: 'https://www.eluniversal.com.mx/rss' }
    ],
    business: [
      { name: 'Expansion Mexico', feed: 'https://expansion.mx/rss' },
      { name: 'El Financiero Mexico', feed: 'https://www.elfinanciero.com.mx/rss' }
    ]
  },
  tr: {
    world: [
      { name: 'Daily Sabah Turkey', feed: 'https://www.dailysabah.com/rss/' },
      { name: 'Hürriyet Daily News', feed: 'https://www.hurriyetdailynews.com/rss.php' }
    ],
    business: [
      { name: 'Turkey Times Business', feed: 'https://turkeytimes.com/feed/' },
      { name: 'Daily Sabah Business', feed: 'https://www.dailysabah.com/business/rss' }
    ]
  },
  il: {
    world: [
      { name: 'Haaretz English', feed: 'https://www.haaretz.com/cmlLink/email-rss-haaretz-news-1.5173322' },
      { name: 'Times of Israel', feed: 'https://www.timesofisrael.com/feed/' }
    ],
    business: [
      { name: 'Globes Israel', feed: 'https://www.globes.co.il/rss_main.xml' },
      { name: 'Haaretz Business', feed: 'https://www.haaretz.com/cmlLink/email-rss-business-1.5173324' }
    ]
  },
  ru: {
    world: [
      { name: 'Moscow Times Russia', feed: 'https://www.themoscowtimes.com/feeds/rss' },
      { name: 'RT News', feed: 'https://rt.com/rss/' }
    ],
    business: [
      { name: 'Moscow Times Business', feed: 'https://www.themoscowtimes.com/category/business/rss' },
      { name: 'RBC Russia', feed: 'https://www.rbc.ru/rbc_main/rss/' }
    ]
  },
  cn: {
    world: [
      { name: 'China Daily World', feed: 'https://www.chinadaily.com.cn/rss/world.xml' },
      { name: 'Global Times China', feed: 'https://www.globaltimes.cn/rss/index.xml' }
    ],
    business: [
      { name: 'China Daily Business', feed: 'https://www.chinadaily.com.cn/rss/business.xml' },
      { name: 'Caixin China', feed: 'https://www.caixinglobal.com/feed/' }
    ]
  }
}

const getApiUrl = () => {
  return localStorage.getItem('NEWS_API_URL') || 'http://localhost:3000/api'
}

// ─── Share Component — shares from your website, not the original article ──
function ShareButton({ headline, summary, storyId, compact = false }) {
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    const sId = encodeURIComponent(storyId || contentHash(headline + summary))
    return `${window.location.origin}/#/story/${sId}`
  }

  const handleShare = async () => {
    const shareUrl = getShareUrl()
    const text = `${headline}\n\n${summary}\n\nRead more on NewsPulse: ${shareUrl}`
    
    try {
      await fetch(`${getApiUrl()}/stories/${storyId}/share`, { method: 'POST' })
    } catch (e) {
      console.warn("Failed to report share to backend:", e)
    }

    if (navigator.share) {
      try { await navigator.share({ title: headline, text, url: shareUrl }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    }
  }

  if (compact) {
    return (
      <button onClick={handleShare} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90" title="Share">
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        )}
      </button>
    )
  }

  return (
    <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors">
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          <span className="text-white/70">Share</span>
        </>
      )}
    </button>
  )
}

// ─── Vote Buttons Component (with compact mode for right-side bar) ────────────────
function VoteButtons({ storyId, initialUpvotes = 0, initialDownvotes = 0, compact = false }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState(() => {
    const votes = JSON.parse(localStorage.getItem('NEWS_VOTES') || '{}')
    return votes[storyId]?.vote || null // 'up', 'down', or null
  })

  // Sync state if initial props change
  useEffect(() => {
    setUpvotes(initialUpvotes)
    setDownvotes(initialDownvotes)
  }, [initialUpvotes, initialDownvotes])

  const submitVote = async (voteType) => {
    const userId = localStorage.getItem('NEWS_USER_ID') || 'user_' + Math.random().toString(36).substr(2, 9)
    if (!localStorage.getItem('NEWS_USER_ID')) {
      localStorage.setItem('NEWS_USER_ID', userId)
    }

    try {
      const res = await fetch(`${getApiUrl()}/stories/${storyId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId })
      })
      if (res.ok) {
        const data = await res.json()
        setUpvotes(data.upvotes)
        setDownvotes(data.downvotes)
      }
    } catch (e) {
      console.warn("Failed to submit vote to backend:", e)
    }
  }

  const handleUpvote = () => {
    const newVote = userVote === 'up' ? null : 'up'
    
    // Optimistic UI updates
    if (newVote === 'up') {
      setUpvotes(v => v + 1)
      if (userVote === 'down') setDownvotes(d => Math.max(0, d - 1))
    } else {
      setUpvotes(v => Math.max(0, v - 1))
    }
    
    setUserVote(newVote)
    const votes = JSON.parse(localStorage.getItem('NEWS_VOTES') || '{}')
    votes[storyId] = { vote: newVote }
    localStorage.setItem('NEWS_VOTES', JSON.stringify(votes))

    submitVote(newVote === 'up' ? 1 : 0)
  }

  const handleDownvote = () => {
    const newVote = userVote === 'down' ? null : 'down'
    
    // Optimistic UI updates
    if (newVote === 'down') {
      setDownvotes(d => d + 1)
      if (userVote === 'up') setUpvotes(v => Math.max(0, v - 1))
    } else {
      setDownvotes(d => Math.max(0, d - 1))
    }
    
    setUserVote(newVote)
    const votes = JSON.parse(localStorage.getItem('NEWS_VOTES') || '{}')
    votes[storyId] = { vote: newVote }
    localStorage.setItem('NEWS_VOTES', JSON.stringify(votes))

    submitVote(newVote === 'down' ? -1 : 0)
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <button onClick={handleUpvote} className={`p-1.5 rounded-full transition-all active:scale-90 ${userVote === 'up' ? 'text-green-400' : 'text-white/50 hover:text-green-400'}`}>
          <svg className="w-4 h-4" fill={userVote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        <span className={`text-[9px] font-bold ${userVote === 'up' ? 'text-green-400' : userVote === 'down' ? 'text-red-400' : 'text-white/40'}`}>{upvotes - downvotes}</span>
        <button onClick={handleDownvote} className={`p-1.5 rounded-full transition-all active:scale-90 ${userVote === 'down' ? 'text-red-400' : 'text-white/50 hover:text-red-400'}`}>
          <svg className="w-4 h-4" fill={userVote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleUpvote} className={`p-1 rounded transition-colors ${userVote === 'up' ? 'text-green-400 bg-green-500/20' : 'text-white/40 hover:text-green-400 hover:bg-white/5'}`}>
        <svg className="w-3.5 h-3.5" fill={userVote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <span className={`text-[10px] font-bold min-w-[20px] text-center ${userVote === 'up' ? 'text-green-400' : userVote === 'down' ? 'text-red-400' : 'text-white/50'}`}>{upvotes - downvotes}</span>
      <button onClick={handleDownvote} className={`p-1 rounded transition-colors ${userVote === 'down' ? 'text-red-400 bg-red-500/20' : 'text-white/40 hover:text-red-400 hover:bg-white/5'}`}>
        <svg className="w-3.5 h-3.5" fill={userVote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
    </div>
  )
}

// ─── Comments Modal Component ──────────────────────────────────────
function CommentsModal({ isOpen, onClose, storyId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let active = true

    const loadComments = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${getApiUrl()}/stories/${storyId}/comments`)
        if (res.ok) {
          const data = await res.json()
          if (active) setComments(data)
        }
      } catch (e) {
        console.warn("Failed to load comments from backend:", e)
        // Fallback to local storage
        const allComments = JSON.parse(localStorage.getItem('NEWS_COMMENTS') || '{}')
        if (active) setComments(allComments[storyId] || [])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadComments()
    return () => { active = false }
  }, [isOpen, storyId])

  if (!isOpen) return null

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    const tempId = Date.now()
    const userId = localStorage.getItem('NEWS_USER_ID') || 'user_' + Math.random().toString(36).substr(2, 5)
    if (!localStorage.getItem('NEWS_USER_ID')) {
      localStorage.setItem('NEWS_USER_ID', userId)
    }

    const localComment = {
      id: tempId,
      text: newComment.trim(),
      userId,
      createdAt: new Date().toISOString()
    }
    
    // Optimistic UI update
    setComments(prev => [localComment, ...prev])
    setNewComment('')

    try {
      const res = await fetch(`${getApiUrl()}/stories/${storyId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: localComment.text, userId: localComment.userId })
      })
      if (res.ok) {
        const savedComment = await res.json()
        setComments(prev => prev.map(c => c.id === tempId ? savedComment : c))
      }
    } catch (e) {
      console.warn("Failed to save comment to backend, saving locally:", e)
      // Save locally as backup
      const allComments = JSON.parse(localStorage.getItem('NEWS_COMMENTS') || '{}')
      const updated = [localComment, ...(allComments[storyId] || [])]
      allComments[storyId] = updated
      localStorage.setItem('NEWS_COMMENTS', JSON.stringify(allComments))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-gray-900 border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            💬 Comments ({comments.length})
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="p-4 max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/20 mx-auto"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{comment.userId.substring(0, 10)}</span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Modal Component ──────────────────────────────────────
function SettingsModal({ isOpen, onClose, userCountry, setUserCountry, appTheme, setAppTheme, newsLanguage, setNewsLanguage, enableTranslation, setEnableTranslation, autoPublishStories, setAutoPublishStories }) {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('NEWS_API_URL') || 'http://localhost:3000/api')

  if (!isOpen) return null

  const LANGUAGES = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { id: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
    { id: 'fr', label: 'Français (French)', flag: '🇫🇷' },
    { id: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
    { id: 'pt', label: 'Português (Portuguese)', flag: '🇧🇷' },
    { id: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { id: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' }
  ]

  const activeTheme = THEMES.find(t => t.id === appTheme) || THEMES[0]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Country Section */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                📍 News Region / Country
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Select your country to see localized news feeds</p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {COUNTRIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setUserCountry(c.id)
                    localStorage.setItem('NEWS_USER_COUNTRY', c.id)
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                    userCountry === c.id
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                      : 'border-white/5 bg-gray-800/40 hover:bg-gray-700/40 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <p className="text-[11px] font-semibold truncate">{c.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                🎨 App Theme
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Choose your preferred accent theme</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setAppTheme(theme.id)
                    localStorage.setItem('NEWS_APP_THEME', theme.id)
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                    appTheme === theme.id
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                      : 'border-white/5 bg-gray-800/40 hover:bg-gray-700/40 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{theme.icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold">{theme.label.split(' ')[0]}</p>
                    {appTheme === theme.id && (
                      <p className="text-[9px] text-blue-400">Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                🌐 News Display Language
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Choose the language for news headlines and summaries (default: English)</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setNewsLanguage(lang.id)
                    localStorage.setItem('NEWS_LANGUAGE', lang.id)
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                    newsLanguage === lang.id
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                      : 'border-white/5 bg-gray-800/40 hover:bg-gray-700/40 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold">{lang.label.split(' ')[0]}</p>
                    {newsLanguage === lang.id && (
                      <p className="text-[9px] text-blue-400">Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Publish Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">⚡ Auto-Publish Stories</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Show pending stories from admin dashboard in your feed (instant publish)</p>
              </div>
              <button
                onClick={() => {
                  setAutoPublishStories(!autoPublishStories)
                  localStorage.setItem('NEWS_AUTO_PUBLISH', String(!autoPublishStories))
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${autoPublishStories ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoPublishStories ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">Enable Hindi Translations</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Show EN/HI toggle on news cards (requires API call)</p>
              </div>
              <button
                onClick={() => {
                  setEnableTranslation(!enableTranslation)
                  localStorage.setItem('NEWS_ENABLE_TRANSLATION', String(!enableTranslation))
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${enableTranslation ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enableTranslation ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>

          {/* Developer API URL Section */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                🛠️ Backend API Configuration
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Use local API server or an exposed HTTPS tunnel for remote environments (e.g. GitHub Pages)</p>
            </div>
            <div className="form-field">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => {
                  setApiUrl(e.target.value)
                  localStorage.setItem('NEWS_API_URL', e.target.value)
                }}
                placeholder="http://localhost:3000/api"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              ℹ️ Country selection determines which news sources are used. Language affects display only. Hindi translations use AI and require API calls.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r ${activeTheme.color} hover:opacity-90 text-white transition-all`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Content Hash Helper for Translation Cache ──────────────────────
function contentHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

// ─── News Card ──────────────────────────────────────────────────────
function NewsCard({ story, appTheme = 'violet', enableTranslation = true }) {
  const catInfo = CATEGORIES.find(c => c.id === story.category) || CATEGORIES[0]
  const [cardLang, setCardLang] = useState('en')
  const [translating, setTranslating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  
  const [isNarrating, setIsNarrating] = useState(false)
  const utteranceRef = useRef(null)

  // Local state for Hindi translations so component re-renders when fetched
  const [hindiHeadline, setHindiHeadline] = useState(story.hindiHeadline || '')
  const [hindiSummary, setHindiSummary] = useState(story.hindiSummary || '')
  const [hindiExtendedSummary, setHindiExtendedSummary] = useState(story.hindiExtendedSummary || [])

  const activeTheme = THEMES.find(t => t.id === appTheme) || THEMES[0]
  const storyId = story.id || contentHash((story.originalHeadline || story.headline) + (story.originalSummary || story.summary))

  // Content-based cache key for faster lookups (works even if link changes)
  const translationCacheKey = `trans_${contentHash((story.originalHeadline || story.headline) + (story.originalSummary || story.summary))}`

  const handleTranslate = async (targetLang) => {
    if (targetLang === 'en') {
      if (isNarrating) {
        window.speechSynthesis.cancel()
        setIsNarrating(false)
      }
      setCardLang('en')
      return
    }

    // Check story object first (instant - no API call needed)
    if ((hindiSummary || story.hindiSummary) && !translating) {
      if (isNarrating) {
        window.speechSynthesis.cancel()
        setIsNarrating(false)
      }
      setCardLang('hi')
      return
    }

    // Check localStorage cache with content-based key
    const cached = localStorage.getItem(translationCacheKey)
    if (cached && !translating) {
      try {
        const cachedData = JSON.parse(cached)
        setHindiHeadline(cachedData.hindiHeadline || '')
        setHindiSummary(cachedData.hindiSummary || '')
        setHindiExtendedSummary(cachedData.hindiExtendedSummary || [])
        
        if (isNarrating) {
          window.speechSynthesis.cancel()
          setIsNarrating(false)
        }
        setCardLang('hi')
        return
      } catch (e) {}
    }

    // Only translate if enableTranslation is true and we don't have a cache hit
    if (!enableTranslation && !(hindiSummary || story.hindiSummary) && !cached) return

    setTranslating(true)
    try {
      const prompt = `You are a professional Hindi translator. Translate the following news article title and description into proper, complete Hindi sentences written in Devanagari script.

IMPORTANT RULES:
1. hindiHeadline: Must be a complete headline in Hindi (5-10 words minimum)
2. hindiSummary: Must be 3-4 complete Hindi sentences totaling at least 60 characters
3. hindiExtendedSummary: Array of exactly 3 Hindi bullet points, each must be a full sentence (minimum 8 words each)
4. If the input is short, expand it naturally with relevant context
5. NEVER return one-word translations - always use complete sentences

Return ONLY valid JSON with these exact keys:
{
  "headline": "English headline",
  "summary": "Detailed English summary paragraph (3-4 sentences)",
  "extendedSummary": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "hindiHeadline": "पूरा हिंदी शीर्षक यहाँ लिखें",
  "hindiSummary": "यहाँ विस्तृत हिंदी सारांश लिखें। कम से कम तीन वाक्य होने चाहिए। प्रत्येक वाक्य पूर्ण होना चाहिए।",
  "hindiExtendedSummary": ["बुलेट पॉइंट 1 पूर्ण वाक्य", "बुलेट पॉइंट 2 पूर्ण वाक्य", "बुलेट पॉइंट 3 पूर्ण वाक्य"]
}

DO NOT include any markdown, code blocks, or explanations. Return ONLY raw JSON.

Title: ${story.originalHeadline || story.headline}
Description: ${story.originalSummary || story.summary}`

      const response = await fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (response.ok) {
        const data = await response.json()
        if (data && data.response) {
          let parsed = null
          if (typeof data.response === 'object' && data.response !== null) {
            parsed = data.response
          } else {
            try { parsed = JSON.parse(data.response.trim()) } catch (e) {}
          }
          if (parsed && parsed.hindiSummary) {
            // Update local state to trigger re-render
            setHindiHeadline(parsed.hindiHeadline || '')
            setHindiSummary(parsed.hindiSummary)
            setHindiExtendedSummary(parsed.hindiExtendedSummary || [])

            // Save to cache with content-based key for instant future access
            try {
              const cacheData = {
                headline: parsed.headline || story.headline,
                summary: parsed.summary || story.summary,
                extendedSummary: parsed.extendedSummary || [],
                hindiHeadline: parsed.hindiHeadline,
                hindiSummary: parsed.hindiSummary,
                hindiExtendedSummary: parsed.hindiExtendedSummary
              }
              localStorage.setItem(translationCacheKey, JSON.stringify(cacheData))
              // Also save by link for backward compatibility
              const linkCache = JSON.parse(localStorage.getItem('AI_STORIES_CACHE') || '{}')
              linkCache[story.link] = cacheData
              localStorage.setItem('AI_STORIES_CACHE', JSON.stringify(linkCache))
            } catch (e) {}

            if (isNarrating) {
              window.speechSynthesis.cancel()
              setIsNarrating(false)
            }
            setCardLang('hi')
          }
        }
      }
    } catch (e) {
      console.warn("Translation failed:", e)
    } finally {
      setTranslating(false)
    }
  }

  // Pre-fetch Hindi translations for stories that don't have them yet
  useEffect(() => {
    const hasHindi = (hindiSummary || story.hindiSummary) && (hindiSummary || story.hindiSummary).length > 10
    if (!enableTranslation || hasHindi) return
    
    const cached = localStorage.getItem(translationCacheKey)
    if (cached) {
      try {
        const cachedData = JSON.parse(cached)
        if (cachedData.hindiHeadline && cachedData.hindiSummary && cachedData.hindiSummary.length > 10) {
          setHindiHeadline(cachedData.hindiHeadline)
          setHindiSummary(cachedData.hindiSummary)
          setHindiExtendedSummary(cachedData.hindiExtendedSummary || [])
        }
      } catch (e) {}
    } else {
      // Auto-fetch Hindi in background when card mounts and translation is enabled
      ;(async () => {
        try {
          const prompt = `You are a professional Hindi translator. Translate the following news article into proper, complete Hindi sentences written in Devanagari script.

CRITICAL RULES:
1. hindiHeadline: Complete Hindi headline (minimum 5 words)
2. hindiSummary: At least 3 full Hindi sentences totaling 80+ characters
3. NEVER return one-word or short phrase translations
4. Each sentence must be grammatically complete with subject and predicate

Return ONLY valid JSON:
{
  "hindiHeadline": "यहाँ पूर्ण हिंदी शीर्षक लिखें",
  "hindiSummary": "यहाँ कम से कम तीन पूर्ण वाक्यों में सारांश लिखें। प्रत्येक वाक्य में विषय और क्रिया होनी चाहिए।"
}

NO markdown, NO explanations. ONLY raw JSON.

Title: ${story.originalHeadline || story.headline}
Description: ${story.originalSummary || story.summary}`

          const response = await fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
          })

          if (response.ok) {
            const data = await response.json()
            if (data && data.response) {
              let parsed = null
              if (typeof data.response === 'object') {
                parsed = data.response
              } else {
                try { parsed = JSON.parse(data.response.trim()) } catch (e) {}
              }
              
              // Validate: hindiSummary must be a proper sentence (80+ chars)
              if (parsed && parsed.hindiHeadline && parsed.hindiSummary && parsed.hindiSummary.length >= 80) {
                setHindiHeadline(parsed.hindiHeadline)
                setHindiSummary(parsed.hindiSummary)
                
                const cacheData = { hindiHeadline: parsed.hindiHeadline, hindiSummary: parsed.hindiSummary }
                localStorage.setItem(translationCacheKey, JSON.stringify(cacheData))
              } else if (parsed && parsed.hindiHeadline && parsed.hindiSummary) {
                // If translation is too short, try a stronger prompt
                const retryPrompt = `Translate to FULL Hindi sentences. The previous translation was too short. Write at least 3 complete grammatical sentences in Devanagari script for the summary. Each sentence must have a subject and predicate.

{
  "hindiHeadline": "${parsed.hindiHeadline}",
  "hindiSummary": "कम से कम तीन पूर्ण वाक्य लिखें। प्रत्येक वाक्य में विषय, क्रिया और वस्तु होनी चाहिए। हिंदी में लिखें, अंग्रेजी में नहीं।"
}`
                const retryResponse = await fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: retryPrompt })
                })
                
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json()
                  if (retryData && retryData.response) {
                    let retryParsed = null
                    if (typeof retryData.response === 'object') {
                      retryParsed = retryData.response
                    } else {
                      try { retryParsed = JSON.parse(retryData.response.trim()) } catch (e) {}
                    }
                    if (retryParsed && retryParsed.hindiSummary && retryParsed.hindiSummary.length >= 80) {
                      setHindiHeadline(retryParsed.hindiHeadline || parsed.hindiHeadline)
                      setHindiSummary(retryParsed.hindiSummary)
                      const cacheData = { hindiHeadline: retryParsed.hindiHeadline, hindiSummary: retryParsed.hindiSummary }
                      localStorage.setItem(translationCacheKey, JSON.stringify(cacheData))
                    }
                  }
                }
              }
            }
          }
        } catch (e) {}
      })()
    }
  }, []) // Runs once on mount - pre-fetches Hindi if not cached

  const getBulletPoints = () => {
    const list = cardLang === 'hi' ? (hindiExtendedSummary.length > 0 ? hindiExtendedSummary : story.hindiExtendedSummary) : story.extendedSummary
    if (list && list.length > 0) return list

    // Extract sentences from summary as default bullets
    const text = cardLang === 'hi' ? (hindiSummary || story.hindiSummary || story.summary) : story.summary
    const parts = text.split(/[.।]/).map(s => s.trim()).filter(s => s.length > 10)
    return parts.slice(0, 3).map(s => cardLang === 'hi' ? `${s}।` : `${s}.`)
  }

  const toggleNarration = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    if (isNarrating) {
      window.speechSynthesis.cancel()
      setIsNarrating(false)
    } else {
      window.speechSynthesis.cancel() // Stop any running speech first

      const headlineText = cardLang === 'hi' ? (hindiHeadline || story.hindiHeadline || story.headline) : story.headline
      const bodyText = cardLang === 'hi' ? (hindiSummary || story.hindiSummary || story.summary) : story.summary
      const textToRead = `${headlineText}. ${bodyText}`
      const utterance = new SpeechSynthesisUtterance(textToRead)

      // Select voice based on language toggle
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => 
        (cardLang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Microsoft'))
      ) || voices.find(v => cardLang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en'))
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = cardLang === 'hi' ? 0.95 : 1.05 // Adjust rate slightly for natural Hindi speed
      utterance.onend = () => setIsNarrating(false)
      utterance.onerror = () => setIsNarrating(false)

      utteranceRef.current = utterance
      setIsNarrating(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleModalNarration = () => {
    if (isNarrating) {
      window.speechSynthesis.cancel()
      setIsNarrating(false)
    } else {
      window.speechSynthesis.cancel()
      const bullets = getBulletPoints().join(' ')
      const utterance = new SpeechSynthesisUtterance(bullets)
      
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => 
        (cardLang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
      ) || voices.find(v => cardLang === 'hi' ? v.lang.startsWith('hi') : v.lang.startsWith('en'))
      
      if (preferredVoice) utterance.voice = preferredVoice
      utterance.rate = cardLang === 'hi' ? 0.95 : 1.02
      utterance.onend = () => setIsNarrating(false)
      utterance.onerror = () => setIsNarrating(false)
      
      utteranceRef.current = utterance
      setIsNarrating(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    return () => {
      if (isNarrating) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isNarrating])

  const activeHeadline = cardLang === 'hi' ? (hindiHeadline || story.hindiHeadline || story.headline) : story.headline
  const activeSummary = cardLang === 'hi' ? (hindiSummary || story.hindiSummary || story.summary) : story.summary

  return (
    <article className={`relative bg-gradient-to-br ${catInfo.color} h-full w-full flex flex-col justify-between p-4 sm:p-6 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group`}>
      {/* Ambient glow effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[75%] bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[60%] bg-white/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Header metadata */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-lg">{catInfo.icon}</span>
          <span className="text-[9px] font-bold text-white/60 bg-black/40 border border-white/10 px-2 py-0.5 rounded-full tracking-wider">
            #NP-${story.serialNo || 'Seed'}
          </span>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Language Switcher Badge - only show when translation is enabled */}
          {enableTranslation && (
            <div className="flex items-center bg-black/35 rounded-full border border-white/15 p-0.5 shadow-inner">
              <button
                onClick={() => handleTranslate('en')}
                disabled={translating}
                className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${
                  cardLang === 'en'
                    ? `bg-white/15 text-white`
                    : 'text-white/40 hover:text-white/75'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleTranslate('hi')}
                disabled={translating}
                className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                  cardLang === 'hi'
                    ? `bg-white/15 text-white`
                    : 'text-white/40 hover:text-white/75'
                }`}
              >
                {translating ? (
                  <svg className="animate-spin h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                ) : 'HI'}
              </button>
            </div>
          )}

          <button 
            onClick={toggleNarration}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border backdrop-blur-md transition-all active:scale-95 ${
              isNarrating 
                ? 'bg-red-500/25 border-red-500/40 text-red-200' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white'
            }`}
          >
            {isNarrating ? (
              <>
                <div className="flex gap-0.5 items-center justify-center h-3 w-3">
                  <span className="w-[1.5px] h-2.5 bg-red-400 animate-bounce [animation-duration:0.6s]" />
                  <span className="w-[1.5px] h-1.5 bg-red-400 animate-bounce [animation-duration:0.8s]" />
                  <span className="w-[1.5px] h-3 bg-red-400 animate-bounce [animation-duration:0.5s]" />
                </div>
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                <span>Listen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right-side action bar (Instagram style) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        <VoteButtons storyId={storyId} initialUpvotes={story.upvotes || 0} initialDownvotes={story.downvotes || 0} compact />
        
        <button 
          onClick={() => setCommentsOpen(true)}
          className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
          title="Comment"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
        
        <ShareButton headline={activeHeadline} summary={activeSummary} storyId={story.id || contentHash(activeHeadline + activeSummary)} compact />
      </div>

      {/* Main Content Area (Headline + Summary) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-4 space-y-4 max-w-xl mx-auto w-full">
        {/* Dynamic decorative category label */}
        <span className={`self-start text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border border-white/10 bg-white/5 text-white/60`}>
          {catInfo.label}
        </span>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-lg select-text">
          {activeHeadline}
        </h2>
        
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow-md select-text line-clamp-none overflow-y-auto max-h-[160px] pr-1.5 no-scrollbar">
          {activeSummary}
        </p>
      </div>

      {/* Bottom CTA / Action */}
      <div className="relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            if (isNarrating) {
              window.speechSynthesis.cancel()
              setIsNarrating(false)
            }
            setModalOpen(true)
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-white/5 hover:bg-white/10 active:scale-[0.97] transition-all border border-white/10 px-4 py-2.5 rounded-full shadow-md"
        >
          <span>📊 Key Briefing</span>
        </button>

        <a 
          href={story.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r ${activeTheme.color} hover:opacity-90 active:scale-[0.97] transition-all border border-white/20 px-4 py-2.5 rounded-full shadow-lg`}
        >
          <span>Read Full Story</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Factual Briefing Modal Overlay */}
      {modalOpen && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col justify-end p-5 transition-all duration-300 animate-fade-in">
          <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto w-full max-w-xl mx-auto flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{catInfo.icon}</span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-white/50">{cardLang === 'hi' ? 'तथ्यात्मक रिपोर्ट' : 'Factual Briefing'}</span>
                </div>
                
                <button
                  onClick={() => {
                    if (isNarrating) {
                      window.speechSynthesis.cancel()
                      setIsNarrating(false)
                    }
                    setModalOpen(false)
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Headline */}
              <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {activeHeadline}
              </h3>

              {/* Bullet Points */}
              <div className="space-y-3.5 py-1.5">
                {getBulletPoints().map((bullet, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs text-white/80 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <p>{bullet.replace(/^[•\s]*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={toggleModalNarration}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isNarrating
                    ? 'bg-red-500/25 border border-red-500/40 text-red-200'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                {isNarrating ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    <span>{cardLang === 'hi' ? 'रोकें' : 'Stop Reading'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span>{cardLang === 'hi' ? 'रिपोर्ट सुनें' : 'Listen Briefing'}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  if (isNarrating) {
                    window.speechSynthesis.cancel()
                    setIsNarrating(false)
                  }
                  setModalOpen(false)
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r ${activeTheme.color} hover:opacity-90 text-white shadow-lg`}
              >
                {cardLang === 'hi' ? 'बंद करें' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Comments Modal */}
      {commentsOpen && (
        <CommentsModal
          isOpen={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          storyId={storyId}
        />
      )}
    </article>
  )
}

// ─── Skeleton Card ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-gray-950 h-full w-full flex flex-col justify-between p-6 rounded-2xl overflow-hidden shadow-lg animate-pulse border border-white/10">
      <div className="absolute inset-0 opacity-20"><div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" /></div>
      <div className="relative z-10 flex-1 flex flex-col justify-center my-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 bg-white/10 rounded-lg" /><div className="h-5 w-px bg-white/20" /><div className="h-4 w-20 bg-white/10 rounded" /></div>
        <div className="h-8 w-full bg-white/10 rounded mb-3" />
        <div className="h-8 w-3/4 bg-white/10 rounded mb-4" />
        <div className="space-y-2 mb-5"><div className="h-4 w-full bg-white/5 rounded" /><div className="h-4 w-5/6 bg-white/5 rounded" /></div>
      </div>
    </div>
  )
}

// ─── Accent Themes Configurations ────────────────────────────────────
const THEMES = [
  { 
    id: 'violet', 
    label: 'Vibrant Violet', 
    icon: '💜', 
    color: 'from-violet-600 to-indigo-600', 
    text: 'text-purple-400', 
    glow: 'shadow-purple-500/30', 
    logo: 'from-violet-500 via-purple-500 to-indigo-600', 
    logoText: 'from-violet-400 via-purple-400 to-indigo-400',
    border: 'border-purple-500/40 bg-purple-500/10 text-purple-200' 
  },
  { 
    id: 'emerald', 
    label: 'Emerald Tactical', 
    icon: '💚', 
    color: 'from-emerald-600 to-teal-600', 
    text: 'text-emerald-400', 
    glow: 'shadow-emerald-500/30', 
    logo: 'from-emerald-500 via-teal-500 to-green-600', 
    logoText: 'from-emerald-400 via-teal-400 to-green-400',
    border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' 
  },
  { 
    id: 'cyan', 
    label: 'Cyberpunk Cyan', 
    icon: '💙', 
    color: 'from-cyan-600 to-blue-600', 
    text: 'text-cyan-400', 
    glow: 'shadow-cyan-500/30', 
    logo: 'from-cyan-500 via-blue-500 to-indigo-600', 
    logoText: 'from-cyan-400 via-blue-400 to-indigo-400',
    border: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' 
  },
  { 
    id: 'amber', 
    label: 'Amber Tactical', 
    icon: '🧡', 
    color: 'from-amber-600 to-orange-600', 
    text: 'text-amber-400', 
    glow: 'shadow-amber-500/30', 
    logo: 'from-amber-500 via-orange-500 to-red-600', 
    logoText: 'from-amber-400 via-orange-400 to-red-400',
    border: 'border-amber-500/40 bg-amber-500/10 text-amber-200' 
  }
]

// ─── Explore Page ────────────────────────────────────────────────────
function ExplorePage({ 
  userInterests,
  setUserInterests,
  appTheme
}) {
  const playClickChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {}
  }

  const handleToggleCategory = (id) => {
    playClickChime()
    let updated = []
    
    if (id === 'all') {
      updated = [] // Selects all news (clears filter)
    } else {
      if (userInterests.includes(id)) {
        updated = userInterests.filter(x => x !== id)
      } else {
        updated = [...userInterests, id]
      }
    }
    
    setUserInterests(updated)
    localStorage.setItem('NEWS_USER_INTERESTS', JSON.stringify(updated))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 overflow-y-auto pb-24">
      {/* Dynamic Filter Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
          <span>🔍</span> Curated Topic Interests
        </h2>
        <p className="text-[11px] text-gray-400 mb-4">Toggle topics to build your custom feed. Select "All News" to read everything.</p>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map(cat => {
            const isActive = cat.id === 'all' 
              ? userInterests.length === 0 
              : userInterests.includes(cat.id)
              
            return (
              <button
                key={`filter-${cat.id}`}
                onClick={() => handleToggleCategory(cat.id)}
                className={`p-3 rounded-xl border transition-all duration-200 text-center relative active:scale-95 ${
                  isActive
                    ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg scale-[1.02] ring-1 ring-white/10`
                    : 'border-white/5 bg-gray-900/40 hover:bg-gray-800/40 hover:border-white/10 text-gray-400 hover:text-gray-300'
                }`}
              >
                {/* Active check indicator dots */}
                {isActive && cat.id !== 'all' && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white shadow animate-pulse" />
                )}
                <span className="text-xl block mb-0.5">{cat.icon}</span>
                <span className="font-bold text-[9px] uppercase tracking-wider">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Save CTA */}
      <div className="pt-2">
        <p className="text-[10px] text-gray-500 text-center">Your interest choices are saved automatically to your browser.</p>
      </div>
    </div>
  )
}

// ─── Local Storage AI Cache Helpers ──────────────────────────────────
const loadAICache = () => {
  try {
    const cached = localStorage.getItem('AI_STORIES_CACHE')
    return cached ? JSON.parse(cached) : {}
  } catch (e) {
    return {}
  }
}

const saveAICache = (cache) => {
  try {
    localStorage.setItem('AI_STORIES_CACHE', JSON.stringify(cache))
  } catch (e) {}
}

// ─── Premium Static Fallback Database ────────────────────────────────
const FALLBACK_STORIES = [
  {
    id: "fb-world-1",
    headline: "Global Trade Routes Shift as Ports Report Record Cargo Volumes",
    summary: "Major maritime trade hubs in Singapore and Rotterdam have reported a 12% year-on-year increase in shipping volume. Industry analysts attribute the surge to shifting supply chain strategies as manufacturers seek closer-to-home logistics routes. The cargo congestion is expected to ease by the third quarter of this fiscal year.",
    extendedSummary: [
      "Maritime trade volume in hubs Singapore and Rotterdam surged by 12% year-on-year.",
      "Manufacturers are actively shifting supply chains to closer-to-home regional logistics networks.",
      "Port cargo congestion is predicted to clear by Q3 of this fiscal year."
    ],
    hindiHeadline: "वैश्विक व्यापार मार्गों में बदलाव: बंदरगाहों पर रिकॉर्ड कार्गो वॉल्यूम दर्ज",
    hindiSummary: "सिंगापुर और रॉटरडैम के प्रमुख समुद्री व्यापार केंद्रों ने शिपिंग वॉल्यूम में 12% की वार्षिक वृद्धि दर्ज की है। उद्योग विश्लेषकों का कहना है कि यह वृद्धि निर्माताओं द्वारा घरेलू रसद मार्गों की खोज के कारण हो रही है। चालू वित्त वर्ष की तीसरी तिमाही तक बंदरगाहों पर भीड़ कम होने की उम्मीद है।",
    hindiExtendedSummary: [
      "सिंगापुर और रॉटरडैम के प्रमुख व्यापारिक केंद्रों में शिपिंग वॉल्यूम में 12% की वृद्धि देखी गई।",
      "निर्माता तेजी से अपनी आपूर्ति श्रृंखला को घरेलू क्षेत्रीय नेटवर्क की तरफ स्थानांतरित कर रहे हैं।",
      "चालू वित्त वर्ष की तीसरी तिमाही तक कार्गो भीड़ से राहत मिलने की भविष्यवाणी की गई है।"
    ],
    source: "Reuters",
    link: "https://www.reuters.com",
    category: "world",
    time: "2h ago",
    isAiEnhanced: true,
    regions: ['global', 'in', 'sg', 'us', 'gb', 'au', 'ae'],
    originalHeadline: "Global Trade Routes Shift as Ports Report Record Cargo Volumes",
    originalSummary: "Major maritime trade hubs in Singapore and Rotterdam have reported a 12% year-on-year increase in shipping volume. Industry analysts attribute the surge to shifting supply chain strategies as manufacturers seek closer-to-home logistics routes. The cargo congestion is expected to ease by the third quarter of this fiscal year."
  },
  {
    id: "fb-politics-1",
    headline: "Bipartisan Infrastructure Bill Approved by Congressional Committee",
    summary: "The Senate Committee on Environment and Public Works has advanced a landmark $90bn regional transit modernization bill. Both parties reached a compromise on funding streams, focusing on public-private partnerships rather than direct tax increases. The bill now heads to the full Senate floor for a final vote next week.",
    extendedSummary: [
      "The Senate Environment and Public Works Committee passed a $90 billion public transit bill.",
      "Funding stream relies on private-public partnerships instead of raising consumer tax rates.",
      "The transit bill moves to the full Senate floor for final voting next week."
    ],
    hindiHeadline: "कांग्रेस समिति द्वारा द्विदलीय बुनियादी ढांचा विधेयक को मंजूरी",
    hindiSummary: "सीनेट की पर्यावरण और लोक निर्माण समिति ने 90 अरब डॉलर के क्षेत्रीय पारगमन आधुनिकीकरण विधेयक को आगे बढ़ाया है। दोनों दलों ने प्रत्यक्ष कर बढ़ाने के बजाय सार्वजनिक-निजी भागीदारी पर ध्यान केंद्रित करते हुए फंडिंग पर समझौता किया है। यह विधेयक अगले सप्ताह अंतिम मतदान के लिए सीनेट में जाएगा।",
    hindiExtendedSummary: [
      "सीनेट समिति ने 90 अरब डॉलर के बुनियादी ढांचा आधुनिकीकरण विधेयक को मंजूरी दी।",
      "वित्तपोषण सीधे कर बढ़ाने के बजाय सार्वजनिक-निजी भागीदारी मॉडल पर निर्भर करता है।",
      "यह ऐतिहासिक पारगमन विधेयक अगले सप्ताह अंतिम वोट के लिए सीनेट में पेश किया जाएगा।"
    ],
    source: "Politico",
    link: "https://www.politico.com",
    category: "politics",
    time: "3h ago",
    isAiEnhanced: true,
    regions: ['us', 'global'],
    originalHeadline: "Bipartisan Infrastructure Bill Approved by Congressional Committee",
    originalSummary: "The Senate Committee on Environment and Public Works has advanced a landmark $90bn regional transit modernization bill. Both parties reached a compromise on funding streams, focusing on public-private partnerships rather than direct tax increases. The bill now heads to the full Senate floor for a final vote next week."
  },
  {
    id: "fb-business-1",
    headline: "Central Bank Maintains Benchmarking Interest Rates Amid Inflation Slowdown",
    summary: "The Federal Reserve announced it will keep current interest rates steady, citing encouraging signs of cooling consumer prices. Chair Jerome Powell stated that while inflation remains above target, the labor market exhibits strong resilience. Economists predict the first rate cuts could begin as early as September.",
    source: "BBC Business",
    link: "https://www.bbc.com/news/business",
    category: "business",
    time: "1h ago",
    isAiEnhanced: true,
    regions: ['us', 'gb', 'in', 'global'],
    originalHeadline: "Central Bank Maintains Benchmarking Interest Rates Amid Inflation Slowdown",
    originalSummary: "The Federal Reserve announced it will keep current interest rates steady, citing encouraging signs of cooling consumer prices. Chair Jerome Powell stated that while inflation remains above target, the labor market exhibits strong resilience. Economists predict the first rate cuts could begin as early as September."
  },
  {
    id: "fb-tech-1",
    headline: "Tech Giants Announce Unified Security Protocol for AI Models",
    summary: "A coalition of leading technology firms has unveiled a new opensource framework for auditing security vulnerabilities in deep learning models. The standard, named SafeNet, aims to establish standardized benchmarks for data poisoning defense. Implementations will begin rolling out in cloud development platforms next month.",
    source: "The Verge",
    link: "https://www.theverge.com",
    category: "technology",
    time: "4h ago",
    isAiEnhanced: true,
    regions: ['us', 'in', 'sg', 'gb', 'global'],
    originalHeadline: "Tech Giants Announce Unified Security Protocol for AI Models",
    originalSummary: "A coalition of leading technology firms has unveiled a new opensource framework for auditing security vulnerabilities in deep learning models. The standard, named SafeNet, aims to establish standardized benchmarks for data poisoning defense. Implementations will begin rolling out in cloud development platforms next month."
  },
  {
    id: "fb-startups-1",
    headline: "Robotics Startup Secures $45M Series B for Warehouse Automation",
    summary: "Boston-based Dexterity Labs has raised $45 million in a funding round led by Venture Capital Partners. The startup plans to use the capital to scale production of its autonomous cargo loading arms. Their AI-driven robots are already deployed in ten distribution centers across North America.",
    source: "TechCrunch",
    link: "https://techcrunch.com",
    category: "startups",
    time: "5h ago",
    isAiEnhanced: true,
    originalHeadline: "Robotics Startup Secures $45M Series B for Warehouse Automation",
    originalSummary: "Boston-based Dexterity Labs has raised $45 million in a funding round led by Venture Capital Partners. The startup plans to use the capital to scale production of its autonomous cargo loading arms. Their AI-driven robots are already deployed in ten distribution centers across North America.",
    regions: ['us', 'in', 'global']
  },
  {
    id: "fb-ent-1",
    headline: "Indie Film Wins Top Honors at International Film Festival",
    summary: "The quiet drama 'Echoes of the Valley' has won the prestigious Palme Award at this year's festival. Critics praised the first-time director's nuanced storytelling and the lead actress's powerful performance. The film will receive a limited theatrical release in North America this autumn.",
    source: "Variety",
    link: "https://variety.com",
    category: "entertainment",
    time: "6h ago",
    isAiEnhanced: true,
    originalHeadline: "Indie Film Wins Top Honors at International Film Festival",
    originalSummary: "The quiet drama 'Echoes of the Valley' has won the prestigious Palme Award at this year's festival. Critics praised the first-time director's nuanced storytelling and the lead actress's powerful performance. The film will receive a limited theatrical release in North America this autumn.",
    regions: ['us', 'gb', 'global']
  },
  {
    id: "fb-sports-1",
    headline: "Underdog Team Clinches Victory in Thrilling Championship Final",
    summary: "In one of the greatest upsets in modern sports history, the Wildcats defeated the top-seeded Titans 4-3 in extra time. A spectacular header in the 118th minute secured the trophy. Thousands of fans took to the streets to celebrate their city's first major sports championship in over three decades.",
    source: "Sky Sports",
    link: "https://www.skysports.com",
    category: "sports",
    time: "1h ago",
    isAiEnhanced: true,
    originalHeadline: "Underdog Team Clinches Victory in Thrilling Championship Final",
    originalSummary: "In one of the greatest upsets in modern sports history, the Wildcats defeated the top-seeded Titans 4-3 in extra time. A spectacular header in the 118th minute secured the trophy. Thousands of fans took to the streets to celebrate their city's first major sports championship in over three decades.",
    regions: ['gb', 'in', 'au', 'global']
  },
  {
    id: "fb-science-1",
    headline: "Astronomers Detect Giant Water Ice Deposits on Mars' Equator",
    summary: "Using data from orbiting radar probes, scientists have mapped massive sheets of subsurface water ice near the Martian equator. The deposits, buried under several meters of dust, could provide crucial resources for future human missions. The discovery suggests Mars had a more humid climate in its recent geological past.",
    source: "Science Daily",
    link: "https://www.sciencedaily.com",
    category: "science",
    time: "8h ago",
    isAiEnhanced: true,
    originalHeadline: "Astronomers Detect Giant Water Ice Deposits on Mars' Equator",
    originalSummary: "Using data from orbiting radar probes, scientists have mapped massive sheets of subsurface water ice near the Martian equator. The deposits, buried under several meters of dust, could provide crucial resources for future human missions. The discovery suggests Mars had a more humid climate in its recent geological past.",
    regions: ['us', 'global']
  },
  {
    id: "fb-health-1",
    headline: "Study Links Mediterranean Diet to Enhanced Cognitive Longevity",
    summary: "A 20-year longitudinal study involving over 10,500 participants has found that high adherence to a plant-based diet reduces cognitive decline by 28%. Researchers noted that high levels of antioxidants and healthy monounsaturated fats support brain cell preservation. The findings highlight the critical role of lifestyle in aging.",
    source: "BBC Health",
    link: "https://www.bbc.com/news/health",
    category: "health",
    time: "10h ago",
    isAiEnhanced: true,
    originalHeadline: "Study Links Mediterranean Diet to Enhanced Cognitive Longevity",
    originalSummary: "A 20-year longitudinal study involving over 10,500 participants has found that high adherence to a plant-based diet reduces cognitive decline by 28%. Researchers noted that high levels of antioxidants and healthy monounsaturated fats support brain cell preservation. The findings highlight the critical role of lifestyle in aging.",
    regions: ['gb', 'us', 'in', 'global']
  },
  {
    id: "fb-auto-1",
    headline: "Electric Vehicle Range Reaches New Milestones with Solid-State Batteries",
    summary: "A major automotive conglomerate has successfully tested a prototype electric sedan that achieves a range of 800 kilometers on a single charge. The breakthrough is powered by next-generation solid-state battery cells. Commercial production is slated to begin in 2028, potentially revolutionizing the EV market.",
    source: "Motor1",
    link: "https://www.motor1.com",
    category: "automobile",
    time: "12h ago",
    isAiEnhanced: true,
    originalHeadline: "Electric Vehicle Range Reaches New Milestones with Solid-State Batteries",
    originalSummary: "A major automotive conglomerate has successfully tested a prototype electric sedan that achieves a range of 800 kilometers on a single charge. The breakthrough is powered by next-generation solid-state battery cells. Commercial production is slated to begin in 2028, potentially revolutionizing the EV market.",
    regions: ['us', 'de', 'gb', 'global']
  },
  {
    id: "fb-travel-1",
    headline: "Ecotourism Destinations Rise in Popularity for Summer Bookings",
    summary: "Travel agencies are reporting a 40% increase in bookings to sustainable travel hotspots and national parks. Travelers are increasingly seeking low-carbon impact accommodation and carbon-neutral hiking experiences. Costa Rica and Iceland remain the top choices for green tourism.",
    source: "Lonely Planet",
    link: "https://www.lonelyplanet.com",
    category: "travel",
    time: "14h ago",
    isAiEnhanced: true,
    originalHeadline: "Ecotourism Destinations Rise in Popularity for Summer Bookings",
    originalSummary: "Travel agencies are reporting a 40% increase in bookings to sustainable travel hotspots and national parks. Travelers are increasingly seeking low-carbon impact accommodation and carbon-neutral hiking experiences. Costa Rica and Iceland remain the top choices for green tourism.",
    regions: ['us', 'gb', 'au', 'global']
  },
  {
    id: "fb-fashion-1",
    headline: "Fashion Houses Pledge 100% Recycled Textile Usage by 2030",
    summary: "At the global fashion summit, a coalition of luxury brands signed a charter committing to phase out virgin synthetics within the next six years. The brands will invest in automated fabric sorting and chemical recycling plants. The initiative marks a major shift toward circular fashion economics.",
    source: "Vogue",
    link: "https://www.vogue.com",
    category: "fashion",
    time: "16h ago",
    isAiEnhanced: true,
    originalHeadline: "Fashion Houses Pledge 100% Recycled Textile Usage by 2030",
    originalSummary: "At the global fashion summit, a coalition of luxury brands signed a charter committing to phase out virgin synthetics within the next six years. The brands will invest in automated fabric sorting and chemical recycling plants. The initiative marks a major shift toward circular fashion economics.",
    regions: ['us', 'gb', 'fr', 'global']
  },
  {
    id: "fb-edu-1",
    headline: "Global Universities Partner to Launch Free Digital Learning Platform",
    summary: "A consortium of elite international universities has announced a unified online portal offering free certified courses in quantum computing and climate science. The platform aims to bridge educational accessibility gaps in developing regions. Enrollment starts next week with over 150 courses available.",
    source: "Chronicle of Higher Ed",
    link: "https://www.chronicle.com",
    category: "education",
    time: "18h ago",
    isAiEnhanced: true,
    originalHeadline: "Global Universities Partner to Launch Free Digital Learning Platform",
    originalSummary: "A consortium of elite international universities has announced a unified online portal offering free certified courses in quantum computing and climate science. The platform aims to bridge educational accessibility gaps in developing regions. Enrollment starts next week with over 150 courses available.",
    regions: ['us', 'gb', 'in', 'global']
  },
  {
    id: "fb-misc-1",
    headline: "Scientists Discover Deep Sea Coral Reef Resembling Intricate Castle",
    summary: "Marine researchers exploring a deep ocean trench off the Pacific coast have photographed a stunning, previously unknown deep-water coral structure. The white coral columns grow in spiraling formations that look remarkably like Gothic spires. The reef is home to several rare fish and invertebrate species.",
    source: "HuffPost Weird News",
    link: "https://www.huffpost.com/weird-news",
    category: "miscellaneous",
    time: "20h ago",
    isAiEnhanced: true,
    originalHeadline: "Scientists Discover Deep Sea Coral Reef Resembling Intricate Castle",
    originalSummary: "Marine researchers exploring a deep ocean trench off the Pacific coast have photographed a stunning, previously unknown deep-water coral structure. The white coral columns grow in spiraling formations that look remarkably like Gothic spires. The reef is home to several rare fish and invertebrate species.",
    regions: ['us', 'global']
  }
]

// ─── Login Screen ──────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let data
      if (mode === 'guest') {
        const res = await fetch('/api/auth/guest', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        data = await res.json()
        if (!res.ok) throw new Error(data.error)
      } else if (mode === 'login') {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) })
        data = await res.json()
        if (!res.ok) throw new Error(data.error)
      } else {
        const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) })
        data = await res.json()
        if (!res.ok) throw new Error(data.error)
      }
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">📰 NewsPulse</h1>
          <p className="text-xs text-gray-500 mt-1">Your News, Your Way</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['login', 'signup', 'guest'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {m === 'guest' ? '👤 Guest' : m === 'login' ? '🔑 Login' : '📝 Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'guest' && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Username</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter username" className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          )}
          {mode !== 'guest' && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password" className="w-full bg-gray-800/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          )}
          {mode === 'guest' && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-xs text-blue-300">Continue as guest with a random username. You can read, vote, and comment on stories.</p>
            </div>
          )}
          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'guest' ? 'Continue as Guest' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('NEWSPULSE_USER')
    return saved ? JSON.parse(saved) : null
  })

  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'explore'
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const observerTarget = useRef(null)
  const failedLinksRef = useRef(new Set())

  // Personalization Preferences State
  const [userInterests, setUserInterests] = useState(() => {
    try {
      const saved = localStorage.getItem('NEWS_USER_INTERESTS')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })
  const [userCountry, setUserCountry] = useState(() => {
    return localStorage.getItem('NEWS_USER_COUNTRY') || 'global'
  })
  const [appTheme, setAppTheme] = useState(() => {
    return localStorage.getItem('NEWS_APP_THEME') || 'violet'
  })
  const [enableTranslation, setEnableTranslation] = useState(() => {
    const saved = localStorage.getItem('NEWS_ENABLE_TRANSLATION')
    return saved !== 'false' // Default to enabled unless explicitly disabled
  })
  
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [commentsStoryId, setCommentsStoryId] = useState(null)

  // Parse RSS or Atom XML to stories
  const parseRSSFeed = useCallback((xmlText, sourceName, category) => {
    if (!xmlText || typeof xmlText !== 'string') return []
    
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlText, 'text/xml')
      // Query both standard RSS <item> and Atom <entry> elements
      const items = doc.querySelectorAll('item, entry')
      const stories = []
      const cache = loadAICache()

      items.forEach((item) => {
        let title = item.querySelector('title')?.textContent?.trim() || ''
        
        // Match <description> (RSS) or <summary>/<content> (Atom)
        let description = item.querySelector('description, summary, content')?.textContent || ''
        
        // Strip HTML tags from description
        description = description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
        
        // Match link URL: RSS uses <link>, Atom uses <link href="...">
        let link = item.querySelector('link')?.textContent?.trim() || ''
        if (!link) {
          const linkEl = item.querySelector('link')
          if (linkEl) {
            link = linkEl.getAttribute('href') || ''
          }
        }
        
        // Match publication date: RSS uses <pubDate>, Atom uses <published> or <updated>
        const pubDate = item.querySelector('pubDate, published, updated')?.textContent || ''

        if (title && description.length > 20) {
          // Truncate summary to ~280 chars for InShorts-style brevity
          const summary = description.length > 280 ? description.substring(0, 280) + '...' : description
          const cleanLink = link.startsWith('http') ? link : `https://${link}`
          const cached = cache[cleanLink]

          stories.push({
            id: `${sourceName}-${title.substring(0, 30)}-${pubDate}`,
            headline: cached?.headline || title,
            summary: cached?.summary || summary,
            originalHeadline: title,
            originalSummary: summary,
            source: sourceName,
            link: cleanLink,
            category,
            time: pubDate ? formatTimeAgo(new Date(pubDate)) : 'Just now',
            isAiEnhanced: !!cached
          })
        }
      })

      return stories
    } catch (e) {
      console.warn(`Failed to parse RSS feed from ${sourceName}:`, e)
      return []
    }
  }, [])

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date || isNaN(date)) return 'Just now'
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  // Fetch stories from backend API (like InShorts - fresh content every refresh)
  const fetchStories = useCallback(async () => {
    console.log('fetchStories called with category:', selectedCategory, 'country:', userCountry)
    
    setLoading(true)
    
    try {
      const params = new URLSearchParams({
        status: 'approved',
        limit: 20,
        page: page + 1,
        country: userCountry
      })
      
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }
      
      const response = await fetch(`${getApiUrl()}/stories?${params}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const fetchedStories = await response.json()
      console.log('Fetched', fetchedStories.length, 'stories from backend')
      
      // Filter by user interests if any
      let storiesToDisplay = fetchedStories
      
      if (userInterests && userInterests.length > 0 && selectedCategory === 'all') {
        const interestSet = new Set(userInterests)
        storiesToDisplay = storiesToDisplay.filter(s => interestSet.has(s.category))
      }
      
      // Filter by country relevance - prefer regional stories
      if (userCountry && userCountry !== 'global' && storiesToDisplay.length > 0) {
        const regionalStories = storiesToDisplay.filter(s => s.regions?.includes(userCountry))
        const globalStories = storiesToDisplay.filter(s => !s.regions || s.regions.includes('global'))
        
        if (regionalStories.length > 0) {
          // Mix: 70% regional + 30% global
          const regionalCount = Math.max(1, Math.floor(regionalStories.length * 0.7))
          const globalCount = Math.min(globalStories.length, Math.ceil(regionalStories.length * 0.3))
          
          const shuffledRegional = [...regionalStories].sort(() => Math.random() - 0.5).slice(0, regionalCount)
          const shuffledGlobal = [...globalStories].sort(() => Math.random() - 0.5).slice(0, globalCount)
          storiesToDisplay = [...shuffledRegional, ...shuffledGlobal]
        }
      }
      
      // If no stories match filters, show all approved stories
      if (storiesToDisplay.length === 0) {
        console.warn('No stories match filters, showing all approved')
        storiesToDisplay = fetchedStories.slice(0, 20)
      }
      
      setStories(storiesToDisplay)
    } catch (error) {
      console.error('Failed to fetch from backend:', error)
      
      // Fallback to local FALLBACK_STORIES if API fails
      console.warn('Falling back to local stories')
      let fallback = FALLBACK_STORIES.slice()
      
      if (selectedCategory !== 'all') {
        const categoryStories = fallback.filter(s => s.category === selectedCategory)
        if (categoryStories.length > 0) {
          fallback = categoryStories
        } else {
          fallback = FALLBACK_STORIES.filter(s => s.category === selectedCategory)
        }
      }
      
      if (fallback.length === 0) {
        fallback = FALLBACK_STORIES.slice()
      }
      
      const shuffled = [...fallback].sort(() => Math.random() - 0.5)
      setStories(shuffled)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, userCountry, userInterests, page])

  // Load stories on mount or category change
  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  // Asynchronous background AI generator loop
  useEffect(() => {
    if (stories.length === 0) return

    let isCancelled = false

    const processQueue = async () => {
      const currentCache = loadAICache()
      // Filter stories that are not AI-enhanced, not already in cache, and haven't failed in this session
      const storiesToEnhance = stories.filter(
        s => !s.isAiEnhanced && !currentCache[s.link] && !failedLinksRef.current.has(s.link)
      )

      if (storiesToEnhance.length === 0) return

      // Concurrency limit of 3 to speed up background generation significantly!
      const CONCURRENCY_LIMIT = 3
      const queue = [...storiesToEnhance]

      const worker = async () => {
        while (queue.length > 0 && !isCancelled) {
          const story = queue.shift()
          if (!story) break

          try {
            // Polite stagger between requests to prevent API rate limiting
            await new Promise(resolve => setTimeout(resolve, 200))
            if (isCancelled) break

            const prompt = `Rewrite the following news article title and description. You must return a JSON object with the following exact keys:
"headline" (catchy English headline),
"summary" (comprehensive 4-5 sentence English summary paragraph loaded with facts/figures),
"extendedSummary" (an array of 3 key English bullet point facts/metrics),
"hindiHeadline" (Hindi translation of the headline),
"hindiSummary" (Hindi translation of the summary paragraph),
"hindiExtendedSummary" (an array of 3 key Hindi bullet point facts/metrics).
Do not return any other text, explanations, or code blocks. Just raw JSON.
Title: ${story.originalHeadline || story.headline}
Description: ${story.originalSummary || story.summary}`

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 8000)

            const response = await fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt }),
              signal: controller.signal
            })
            clearTimeout(timeoutId)

            if (!response.ok) {
              failedLinksRef.current.add(story.link)
              continue
            }

            const data = await response.json()
            if (data && data.response) {
              let parsed = null
              if (typeof data.response === 'object' && data.response !== null) {
                parsed = data.response
              } else if (typeof data.response === 'string') {
                try {
                  parsed = JSON.parse(data.response.trim())
                } catch (e) {
                  // Heuristic regex backup parser
                  const headlineMatch = data.response.match(/"headline"\s*:\s*"([^"]+)"/)
                  const summaryMatch = data.response.match(/"summary"\s*:\s*"([^"]+)"/)
                  if (headlineMatch && summaryMatch) {
                    parsed = {
                      headline: headlineMatch[1],
                      summary: summaryMatch[1]
                    }
                  }
                }
              }

              if (parsed && parsed.headline && parsed.summary) {
                const aiHeadline = parsed.headline
                const aiSummary = parsed.summary
                const aiExtendedSummary = parsed.extendedSummary || []
                const aiHindiHeadline = parsed.hindiHeadline || ''
                const aiHindiSummary = parsed.hindiSummary || ''
                const aiHindiExtendedSummary = parsed.hindiExtendedSummary || []

                const updatedCache = loadAICache()
                updatedCache[story.link] = {
                  headline: aiHeadline,
                  summary: aiSummary,
                  extendedSummary: aiExtendedSummary,
                  hindiHeadline: aiHindiHeadline,
                  hindiSummary: aiHindiSummary,
                  hindiExtendedSummary: aiHindiExtendedSummary
                }
                saveAICache(updatedCache)

                // Dynamically update stories in state so they instantly transition to the AI-enhanced versions
                setStories(prevStories =>
                  prevStories.map(s =>
                    s.link === story.link
                      ? { 
                          ...s, 
                          headline: aiHeadline, 
                          summary: aiSummary, 
                          extendedSummary: aiExtendedSummary,
                          hindiHeadline: aiHindiHeadline,
                          hindiSummary: aiHindiSummary,
                          hindiExtendedSummary: aiHindiExtendedSummary,
                          isAiEnhanced: true 
                        }
                      : s
                  )
                )
              } else {
                failedLinksRef.current.add(story.link)
              }
            } else {
              failedLinksRef.current.add(story.link)
            }
          } catch (error) {
            console.warn(`Background AI enhancement failed for: ${story.originalHeadline || story.headline}`, error)
            failedLinksRef.current.add(story.link)
          }
        }
      }

      // Start workers in parallel
      const workers = Array.from({ length: CONCURRENCY_LIMIT }).map(() => worker())
      await Promise.all(workers)
    }

    processQueue()

    return () => {
      isCancelled = true
    }
  }, [stories])

  // Infinite scroll - load more when near bottom (generate fresh batch)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !loading) setPage(p => p + 1) },
      { threshold: 0.5 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loading])

  // When page increases, fetch again for fresh content
  useEffect(() => {
    if (page > 0 && !loading) {
      fetchStories()
    }
  }, [page, fetchStories, loading])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(0)
    setStories([]) // Clear old stories immediately so user sees loading state
    fetchStories()
    setTimeout(() => setRefreshing(false), 600)
  }, [fetchStories])

  const handleExploreSelect = (catId) => {
    setSelectedCategory(catId)
    setActiveTab('feed')
    setPage(0)
  }

  const activeTheme = THEMES.find(t => t.id === appTheme) || THEMES[0]

  if (!user) {
    return <LoginScreen onLogin={data => { setUser(data); localStorage.setItem('NEWSPULSE_USER', JSON.stringify(data)) }} />
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-gradient-to-b from-gray-950 via-slate-950 to-black select-none">
      {/* Header */}
      <header className="shrink-0 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${activeTheme.logo} rounded-xl flex items-center justify-center shadow-lg ${activeTheme.glow} ring-1 ring-white/20`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h1 className={`text-xl font-extrabold bg-gradient-to-r ${activeTheme.logoText} bg-clip-text text-transparent tracking-tight`}>NewsPulse</h1>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Real News, In Brief</p>
              </div>
            </div>

            {/* Settings */}
            <button onClick={() => setSettingsOpen(true)} className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 active:scale-95`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Refresh */}
            <button onClick={handleRefresh} disabled={refreshing} className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all ${refreshing ? 'bg-white/5 text-gray-500 border border-white/5' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 active:scale-95'}`}>
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => { setActiveTab('feed'); setPage(0) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? `bg-white/10 ${activeTheme.text} shadow-sm border border-white/10` : 'text-gray-500 hover:text-gray-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              Feed
            </button>
            <button onClick={() => setActiveTab('explore')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'explore' ? `bg-white/10 ${activeTheme.text} shadow-sm border border-white/10` : 'text-gray-500 hover:text-gray-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Explore
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'explore' ? (
          <div className="h-full w-full overflow-y-auto no-scrollbar">
            <ExplorePage 
              userInterests={userInterests}
              setUserInterests={setUserInterests}
              appTheme={appTheme}
            />
          </div>
        ) : (
          <div className="h-full w-full max-w-2xl mx-auto px-4 py-2 flex flex-col overflow-hidden">
            {/* Active filter badge */}
            {userInterests.length > 0 && (
              <div className="flex items-center gap-2 mb-2 shrink-0 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Filtered Feed:</span>
                {userInterests.map(interestId => {
                  const cat = CATEGORIES.find(c => c.id === interestId)
                  if (!cat) return null
                  return (
                    <span key={interestId} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.bg}`}>
                      {cat.icon} {cat.label}
                    </span>
                  )
                })}
                <button onClick={() => { setUserInterests([]); localStorage.setItem('NEWS_USER_INTERESTS', '[]') }} className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors ml-auto shrink-0">Clear</button>
              </div>
            )}

            {/* Stories Feed */}
            <div className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col gap-3">
              {loading && stories.length === 0 ? (
                // Show skeletons while loading initially
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-[calc(100dvh-260px)] min-h-[300px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <SkeletonCard />
                  </div>
                ))
              ) : stories.length > 0 ? (
                stories.map(story => (
                  <div key={story.id} className="h-[calc(100dvh-260px)] min-h-[300px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <NewsCard story={story} appTheme={appTheme} enableTranslation={enableTranslation} />
                  </div>
                ))
              ) : (
                // Empty state when no stories loaded
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-lg font-semibold mb-2">No stories found</p>
                  <p className="text-sm text-gray-500 mb-4">Check your internet connection and try again</p>
                  <button onClick={handleRefresh} className={`px-4 py-2 bg-gradient-to-r ${activeTheme.color} hover:opacity-90 rounded-lg font-bold transition-colors`}>Retry</button>
                </div>
              )}

              {/* Observer marker for infinite scroll */}
              {stories.length > 0 && (
                <div ref={observerTarget} className="h-10 shrink-0 w-full flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Loading more stories...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userCountry={userCountry}
        setUserCountry={setUserCountry}
        appTheme={appTheme}
        setAppTheme={setAppTheme}
        enableTranslation={enableTranslation}
        setEnableTranslation={setEnableTranslation}
      />

      {/* Comments Modal */}
      {commentsStoryId && (
        <CommentsModal
          isOpen={!!commentsStoryId}
          onClose={() => setCommentsStoryId(null)}
          storyId={commentsStoryId}
        />
      )}

      {/* Footer */}
      <footer className="shrink-0 py-2.5 px-4 border-t border-white/5 bg-gray-950/90 text-center z-10">
        <p className="text-[8px] font-medium text-gray-500 max-w-xl mx-auto leading-normal uppercase tracking-wider">
          This application is a demo RSS feed aggregator. We do not claim any copyright or legal ownership over the articles, images, or content aggregated from external sources.
        </p>
      </footer>
    </div>
  )
}

export default App
