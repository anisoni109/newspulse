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
        {/* Dynamic decorative category label & AI brief badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border border-white/10 bg-white/5 text-white/60`}>
            {catInfo.label}
          </span>
          {story.isAiEnhanced && (
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border border-purple-400/30 bg-purple-500/20 text-purple-200 animate-pulse flex items-center gap-1 shadow-md shadow-purple-900/30">
              <span>AI Brief</span>
              <span>✨</span>
            </span>
          )}
        </div>
        
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
function ExplorePage({ onSelectCategory, selectedCategory }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-2">Explore Topics</h1>
        <p className="text-gray-400">Tap a category to filter your feed — stories refresh instantly</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`relative p-4 rounded-2xl border transition-all duration-300 text-center group ${
              selectedCategory === cat.id
                ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-xl scale-[1.05] ring-2 ring-white/20`
                : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/60 hover:border-gray-600'
            }`}
          >
            <span className="text-3xl block mb-2">{cat.icon}</span>
            <span className={`font-bold text-xs ${selectedCategory === cat.id ? 'text-white' : 'text-gray-300'}`}>{cat.label}</span>
            {selectedCategory === cat.id && (
              <div className="absolute top-2 right-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected indicator */}
      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <p className="text-sm text-purple-300 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {selectedCategory === 'all' ? 'Showing all stories across every topic and region.' : `Filtering to ${CATEGORIES.find(c => c.id === selectedCategory)?.label} stories. Scroll down for personalized content.`}
        </p>
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
      
      if (selectedCategory === 'all') {
        // Fetch all category feeds
        Object.entries(NEWS_SOURCES).forEach(([cat, sources]) => {
          sources.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: cat }))
        })
      } else {
        const sources = NEWS_SOURCES[selectedCategory] || []
        sources.forEach(source => urlsToFetch.push({ url: source.feed, name: source.name, category: selectedCategory }))
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
  }, [selectedCategory, parseRSSFeed])

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
            <ExplorePage onSelectCategory={handleExploreSelect} selectedCategory={selectedCategory} />
          </div>
        ) : (
          <div className="h-full w-full max-w-2xl mx-auto px-4 py-4 flex flex-col overflow-hidden">
            {/* Active filter badge */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${CATEGORIES.find(c => c.id === selectedCategory)?.bg}`}>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </span>
                <button onClick={() => handleExploreSelect('all')} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear filter</button>
              </div>
            )}

            {/* Stories Feed */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col gap-4 pb-4">
              {loading && stories.length === 0 ? (
                // Show skeletons while loading initially
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-[calc(100vh-200px)] min-h-[400px] w-full shrink-0">
                    <SkeletonCard />
                  </div>
                ))
              ) : stories.length > 0 ? (
                stories.map(story => (
                  <div key={story.id} className="h-[calc(100vh-200px)] min-h-[400px] max-h-[750px] w-full shrink-0">
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
