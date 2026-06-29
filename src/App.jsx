import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All News', icon: '🔥', color: 'from-red-500 to-orange-500', bg: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'world', label: 'World', icon: '🌍', color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'business', label: 'Business', icon: '💼', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'technology', label: 'Technology', icon: '⚡', color: 'from-indigo-600 to-blue-500', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'sports', label: 'Sports', icon: '🏆', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'science', label: 'Science', icon: '🔬', color: 'from-teal-600 to-green-500', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'health', label: 'Health', icon: '❤️‍🩹', color: 'from-pink-600 to-rose-500', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-fuchsia-600 to-purple-500', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
]

// ─── Real News Sources with verified URLs and RSS feeds ──────────────
const NEWS_SOURCES = {
  world: [
    { name: 'BBC News', url: 'https://www.bbc.com/news', feed: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Reuters', url: 'https://www.reuters.com', feed: 'https://www.reutersagency.com/feed/?best-topics=news&utm_term=global' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com', feed: 'https://www.aljazeera.com/xml/rss/all.xml' },
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
  sports: [
    { name: 'BBC Sport', url: 'https://www.bbc.com/sport', feed: 'https://feeds.bbci.co.uk/sport/rss.xml' },
    { name: 'ESPN', url: 'https://www.espn.com', feed: 'http://www.espn.com/espn/rss/news/' },
  ],
  science: [
    { name: 'BBC Science', url: 'https://www.bbc.com/news/science_and_environment', feed: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
    { name: 'Science Daily', url: 'https://www.sciencedaily.com', feed: 'https://www.sciencedaily.com/rss/all.xml' },
  ],
  health: [
    { name: 'BBC Health', url: 'https://www.bbc.com/news/health', feed: 'https://feeds.bbci.co.uk/news/health/rss.xml' },
  ],
  entertainment: [
    { name: 'BBC Entertainment', url: 'https://www.bbc.com/news/entertainment_and_arts', feed: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' },
    { name: 'Variety', url: 'https://variety.com', feed: 'https://variety.com/feed/' },
  ],
}

// ─── Region Configurations ───────────────────────────────────────────
const REGIONS = [
  { id: 'global', label: 'Global / Worldwide', icon: '🌍' },
  { id: 'us', label: 'North America', icon: '🇺🇸' },
  { id: 'europe', label: 'Europe / UK', icon: '🇪🇺' },
  { id: 'apac', label: 'Asia-Pacific', icon: '🌏' },
  { id: 'me', label: 'Middle East', icon: '🕌' }
]

const REGION_WORLD_FEEDS = {
  global: [
    { name: 'BBC World', feed: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Reuters World', feed: 'https://www.reutersagency.com/feed/?best-topics=news&utm_term=global' },
    { name: 'Al Jazeera World', feed: 'https://www.aljazeera.com/xml/rss/all.xml' }
  ],
  us: [
    { name: 'CNN Top News', feed: 'https://rss.cnn.com/rss/cnn_topstories.rss' },
    { name: 'Reuters US News', feed: 'https://www.reutersagency.com/feed/?best-topics=news' },
    { name: 'BBC US & Canada', feed: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml' }
  ],
  europe: [
    { name: 'BBC UK News', feed: 'https://feeds.bbci.co.uk/news/rss.xml' },
    { name: 'Reuters UK', feed: 'https://www.reutersagency.com/feed/?best-topics=news' },
    { name: 'Deutsche Welle', feed: 'https://rss.dw.com/rdf/rss-en-all' }
  ],
  apac: [
    { name: 'Channel News Asia', feed: 'https://www.channelnewsasia.com/rss/cna/news.xml' },
    { name: 'Reuters Asia', feed: 'https://www.reutersagency.com/feed/?best-topics=news' },
    { name: 'BBC Asia News', feed: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml' }
  ],
  me: [
    { name: 'Al Jazeera English', feed: 'https://www.aljazeera.com/xml/rss/all.xml' },
    { name: 'BBC Middle East', feed: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml' }
  ]
}

// ─── CORS Proxy for RSS Feeds ────────────────────────────────────────
const PROXY_URL = 'https://api.allorigins.win/raw?url='

// ─── Share Component ────────────────────────────────────────────────
function ShareButton({ headline, summary, link }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `${headline}\n\n${summary}\n\nRead more: ${link}`
    if (navigator.share) {
      try { await navigator.share({ title: headline, text, url: link }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    }
  }

  return (
    <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors">
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          <span>Share</span>
        </>
      )}
    </button>
  )
}

// ─── News Card ──────────────────────────────────────────────────────
function NewsCard({ story }) {
  const catInfo = CATEGORIES.find(c => c.id === story.category) || CATEGORIES[0]

  return (
    <article className={`relative bg-gradient-to-br ${catInfo.color} h-full w-full flex flex-col justify-between p-6 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group`}>
      {/* Ambient glow effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[75%] bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[60%] bg-white/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Header metadata */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-lg">{catInfo.icon}</span>
          <div className="h-4 w-px bg-white/20" />
          <span className="font-bold text-base text-white/95 tracking-wide uppercase">{story.source}</span>
        </div>
        <ShareButton headline={story.headline} summary={story.summary} link={story.link} />
      </div>

      {/* Main Content Area (Headline + Summary) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-4 space-y-4 max-w-xl mx-auto w-full">
        {/* Dynamic decorative category label */}
        <span className={`self-start text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border border-white/10 bg-white/5 text-white/60`}>
          {catInfo.label}
        </span>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-lg select-text">
          {story.headline}
        </h2>
        
        <p className="text-sm sm:text-base text-white/80 leading-relaxed drop-shadow-md select-text line-clamp-6">
          {story.summary}
        </p>
      </div>

      {/* Bottom CTA / Action */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
        <a 
          href={story.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-500/90 hover:to-indigo-500/90 active:scale-[0.97] transition-all backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full shadow-lg shadow-purple-900/30"
        >
          <span>Read Full Story</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <span className="text-xs text-white/40 font-semibold">{story.time}</span>
      </div>
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

// ─── Explore Page ────────────────────────────────────────────────────
function ExplorePage({ 
  onSelectCategory, 
  selectedCategory,
  userInterests,
  setUserInterests,
  userLocation,
  setUserLocation
}) {
  const [tempInterests, setTempInterests] = useState(userInterests)
  const [tempLocation, setTempLocation] = useState(userLocation)
  const [saveStatus, setSaveStatus] = useState('') // '' | 'saving' | 'saved'

  // Update temp state if props change
  useEffect(() => {
    setTempInterests(userInterests)
    setTempLocation(userLocation)
  }, [userInterests, userLocation])

  const toggleInterest = (id) => {
    if (tempInterests.includes(id)) {
      setTempInterests(tempInterests.filter(x => x !== id))
    } else {
      setTempInterests([...tempInterests, id])
    }
  }

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setUserInterests(tempInterests)
      setUserLocation(tempLocation)
      localStorage.setItem('NEWS_USER_INTERESTS', JSON.stringify(tempInterests))
      localStorage.setItem('NEWS_USER_LOCATION', tempLocation)
      setSaveStatus('saved')

      // Synthesized success audio ping
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08) // A5
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      } catch (e) {}

      setTimeout(() => setSaveStatus(''), 2000)
    }, 600)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 overflow-y-auto pb-24">
      {/* Quick Filter Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>🔍</span> Quick Category Filter
        </h2>
        <p className="text-xs text-gray-400 mb-4">Tap a topic to jump straight to its live feed</p>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map(cat => (
            <button
              key={`filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3.5 rounded-xl border transition-all duration-300 text-center relative ${
                selectedCategory === cat.id
                  ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg scale-[1.03] ring-1 ring-white/20`
                  : 'border-white/5 bg-gray-900/40 hover:bg-gray-800/40 hover:border-white/10 text-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">{cat.icon}</span>
              <span className="font-bold text-[10px] uppercase tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile & Personalization Center */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <span>⚙️</span> Personalization Center
          </h2>
          <p className="text-xs text-gray-400">Configure your interests and preferred region to curate your custom feed</p>
        </div>

        {/* Interests Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
            <span>🎨</span> Custom Interests
          </h3>
          <p className="text-[11px] text-gray-500">Only check the topics you want in your personal Feed. Leave blank to show all news.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const isSelected = tempInterests.includes(cat.id)
              return (
                <button
                  key={`pref-${cat.id}`}
                  onClick={() => toggleInterest(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-200 shadow-md'
                      : 'border-white/5 bg-gray-900/20 hover:bg-gray-800/30 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-semibold text-xs tracking-wide">{cat.label}</span>
                  <div className="ml-auto w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all">
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Location / Region Selector */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
            <span>📍</span> Preferred Region (Location)
          </h3>
          <p className="text-[11px] text-gray-500">Tailors the sources loaded for the World News sector</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {REGIONS.map(reg => {
              const isSelected = tempLocation === reg.id
              return (
                <button
                  key={reg.id}
                  onClick={() => setTempLocation(reg.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-200 shadow-md'
                      : 'border-white/5 bg-gray-900/20 hover:bg-gray-800/30 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{reg.icon}</span>
                  <span className="font-semibold text-xs tracking-wide">{reg.label}</span>
                  <div className="ml-auto w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all">
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
              saveStatus === 'saved'
                ? 'bg-green-600 hover:bg-green-550 text-white shadow-green-900/20'
                : saveStatus === 'saving'
                ? 'bg-purple-600/50 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-500 text-white'
            }`}
          >
            {saveStatus === 'saved' ? (
              <span className="flex items-center justify-center gap-2">
                <span>Preferences Saved!</span>
                <span>✨</span>
              </span>
            ) : saveStatus === 'saving' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-purple-200" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </span>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
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

// ─── Main App ────────────────────────────────────────────────────────
function App() {
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
  const [userLocation, setUserLocation] = useState(() => {
    return localStorage.getItem('NEWS_USER_LOCATION') || 'global'
  })

  // Parse RSS XML to stories
  const parseRSSFeed = useCallback((xmlText, sourceName, category) => {
    if (!xmlText || typeof xmlText !== 'string') return []
    
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlText, 'text/xml')
      const items = doc.querySelectorAll('item')
      const stories = []
      const cache = loadAICache()

      items.forEach((item) => {
        let title = item.querySelector('title')?.textContent?.trim() || ''
        let description = item.querySelector('description')?.textContent || ''
        
        // Strip HTML tags from description
        description = description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
        
        const link = item.querySelector('link')?.textContent?.trim() || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''

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

  // Fetch stories from RSS feeds
  const fetchStories = useCallback(async () => {
    setLoading(true)
    
    try {
      let urlsToFetch = []
      const activeWorldFeeds = REGION_WORLD_FEEDS[userLocation] || REGION_WORLD_FEEDS.global
      
      if (selectedCategory === 'all') {
        // Fetch all category feeds, replacing world category with regional feeds
        Object.entries(NEWS_SOURCES).forEach(([cat, sources]) => {
          if (cat === 'world') {
            activeWorldFeeds.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: cat }))
          } else {
            sources.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: cat }))
          }
        })
      } else if (selectedCategory === 'world') {
        activeWorldFeeds.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: 'world' }))
      } else {
        const sources = NEWS_SOURCES[selectedCategory] || []
        sources.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: selectedCategory }))
      }

      // Filter feeds by custom interests if user is on the unified Top Stories / All News tab
      if (selectedCategory === 'all' && userInterests && userInterests.length > 0) {
        urlsToFetch = urlsToFetch.filter(item => userInterests.includes(item.category))
      }

      // Fetch all feeds in parallel with timeout
      const fetchPromises = urlsToFetch.map(async ({ url, name, category }) => {
        try {
          const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`
          const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) }) // 5s timeout per feed
          if (!response.ok) return []
          const text = await response.text()
          return parseRSSFeed(text, name, category)
        } catch (e) {
          console.warn(`Failed to fetch ${name}:`, e.message)
          return []
        }
      })

      const results = await Promise.all(fetchPromises)
      let allFetched = results.flat()

      // Remove duplicates by headline
      const seen = new Set()
      allFetched = allFetched.filter(story => {
        if (seen.has(story.headline)) return false
        seen.add(story.headline)
        return true
      })

      setStories(allFetched)
    } catch (err) {
      console.warn('Failed to fetch stories:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, userLocation, userInterests, parseRSSFeed])

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

      for (const story of storiesToEnhance) {
        if (isCancelled) break

        try {
          // Polite delay between background requests to avoid overloading the endpoint
          await new Promise(resolve => setTimeout(resolve, 1000))
          if (isCancelled) break

          const prompt = `Rewrite the following news article title and description into a catchy headline and a comprehensive, detailed 3-4 sentence paragraph summary (detailing the event fully so that the reader doesn't need to read the full article). Format the response strictly as a JSON object with keys "headline" and "summary" like this: {"headline": "...", "summary": "..."}. Do not include any other text, markdown code blocks, or explanations. Just raw JSON.
Title: ${story.originalHeadline}
Description: ${story.originalSummary}`

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
          let aiHeadline = ''
          let aiSummary = ''

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
              aiHeadline = parsed.headline
              aiSummary = parsed.summary
            }
          }

          if (aiHeadline && aiSummary) {
            const updatedCache = loadAICache()
            updatedCache[story.link] = {
              headline: aiHeadline,
              summary: aiSummary
            }
            saveAICache(updatedCache)

            // Dynamically update stories in state so they instantly transition to the AI-enhanced versions
            setStories(prevStories =>
              prevStories.map(s =>
                s.link === story.link
                  ? { ...s, headline: aiHeadline, summary: aiSummary, isAiEnhanced: true }
                  : s
              )
            )
          } else {
            failedLinksRef.current.add(story.link)
          }
        } catch (error) {
          console.warn(`Background AI enhancement failed for: ${story.originalHeadline}`, error)
          failedLinksRef.current.add(story.link)
        }
      }
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

  const handleRefresh = () => {
    setRefreshing(true)
    setPage(0)
    fetchStories()
    setTimeout(() => setRefreshing(false), 600)
  }

  const handleExploreSelect = (catId) => {
    setSelectedCategory(catId)
    setActiveTab('feed')
    setPage(0)
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-b from-gray-950 via-slate-950 to-black select-none">
      {/* Header */}
      <header className="shrink-0 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">NewsPulse</h1>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Real News, In Brief</p>
              </div>
            </div>

            {/* Refresh */}
            <button onClick={handleRefresh} disabled={refreshing} className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all ${refreshing ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 border border-white/10 active:scale-95'}`}>
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => { setActiveTab('feed'); setPage(0) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? 'bg-white/10 text-purple-400 shadow-sm border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              Feed
            </button>
            <button onClick={() => setActiveTab('explore')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'explore' ? 'bg-white/10 text-purple-400 shadow-sm border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>
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
              onSelectCategory={handleExploreSelect} 
              selectedCategory={selectedCategory} 
              userInterests={userInterests}
              setUserInterests={setUserInterests}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />
          </div>
        ) : (
          <div className="h-full w-full max-w-2xl mx-auto px-4 py-2 flex flex-col overflow-hidden">
            {/* Active filter badge */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${CATEGORIES.find(c => c.id === selectedCategory)?.bg}`}>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </span>
                <button onClick={() => handleExploreSelect('all')} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear filter</button>
              </div>
            )}

            {/* Stories Feed */}
            <div className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col gap-3">
              {loading && stories.length === 0 ? (
                // Show skeletons while loading initially
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-[calc(100vh-170px)] min-h-[350px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <SkeletonCard />
                  </div>
                ))
              ) : stories.length > 0 ? (
                stories.map(story => (
                  <div key={story.id} className="h-[calc(100vh-170px)] min-h-[350px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <NewsCard story={story} />
                  </div>
                ))
              ) : (
                // Empty state when no stories loaded
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-lg font-semibold mb-2">No stories found</p>
                  <p className="text-sm text-gray-500 mb-4">Check your internet connection and try again</p>
                  <button onClick={handleRefresh} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">Retry</button>
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

      {/* Footer */}
      <footer className="shrink-0 py-2.5 border-t border-white/5 bg-gray-950/90 text-center z-10">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
          Powered by BBC News, Reuters, Al Jazeera & more • Real-time RSS feeds
        </p>
      </footer>
    </div>
  )
}

export default App
