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
  const [isNarrating, setIsNarrating] = useState(false)
  const utteranceRef = useRef(null)

  const toggleNarration = (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (isNarrating) {
      window.speechSynthesis.cancel()
      setIsNarrating(false)
    } else {
      window.speechSynthesis.cancel() // Stop any running speech first
      
      const textToRead = `${story.headline}. ${story.summary}`
      const utterance = new SpeechSynthesisUtterance(textToRead)
      
      // Select a natural sounding English voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')))
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.rate = 1.05 // Slightly faster reading speed
      
      utterance.onend = () => {
        setIsNarrating(false)
      }
      
      utterance.onerror = () => {
        setIsNarrating(false)
      }
      
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
        </div>
        
        <div className="flex items-center gap-3">
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
          
          <ShareButton headline={story.headline} summary={story.summary} link={story.link} />
        </div>
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
        
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow-md select-text line-clamp-none overflow-y-auto max-h-[160px] pr-1.5 no-scrollbar">
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
  userCountry,
  setUserCountry,
  appTheme,
  setAppTheme
}) {
  const [tempCountry, setTempCountry] = useState(userCountry)
  const [tempTheme, setTempTheme] = useState(appTheme)
  const [saveStatus, setSaveStatus] = useState('') // '' | 'saving' | 'saved'

  // Sync state with props
  useEffect(() => {
    setTempCountry(userCountry)
    setTempTheme(appTheme)
  }, [userCountry, appTheme])

  // Play subtle visual audio feedback click chime
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

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setUserCountry(tempCountry)
      setAppTheme(tempTheme)
      localStorage.setItem('NEWS_USER_COUNTRY', tempCountry)
      localStorage.setItem('NEWS_APP_THEME', tempTheme)
      setSaveStatus('saved')

      // Synthesized success audio double-ping
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08) // A5
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      } catch (e) {}

      setTimeout(() => setSaveStatus(''), 2000)
    }, 600)
  }

  const activeTheme = THEMES.find(t => t.id === tempTheme) || THEMES[0]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 overflow-y-auto pb-24">
      {/* Quick Country Presets */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-base font-extrabold text-white mb-1.5 flex items-center gap-2">
          <span>📍</span> Quick Country Presets
        </h2>
        <p className="text-[11px] text-gray-400 mb-3.5">Switch location instantly to pull localized global reports.</p>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {COUNTRIES.map(c => {
            const isActive = tempCountry === c.id
            return (
              <button
                key={`preset-${c.id}`}
                onClick={() => {
                  playClickChime()
                  setTempCountry(c.id)
                  setUserCountry(c.id)
                  localStorage.setItem('NEWS_USER_COUNTRY', c.id)
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? `border-transparent bg-gradient-to-r ${activeTheme.color} text-white shadow-md`
                    : 'border-white/5 bg-gray-900/40 hover:bg-gray-800/40 text-gray-400 hover:text-gray-300'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>
      </div>
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

      {/* Profile & Personalization Center */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="border-b border-white/10 pb-3.5">
          <h2 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
            <span>⚙️</span> Personalization Center
          </h2>
          <p className="text-[11px] text-gray-400">Configure your preference location and visual dashboard color accents</p>
        </div>

        {/* Country Selector */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
            <span>📍</span> Preferred Country / Source Location
          </h3>
          <p className="text-[10px] text-gray-500">Loads customized local intelligence feeds for the World News sector</p>

          <div className="relative">
            <select
              value={tempCountry}
              onChange={(e) => setTempCountry(e.target.value)}
              className="w-full bg-gray-900/50 border border-white/10 hover:border-white/20 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl p-3.5 outline-none transition-all cursor-pointer focus:ring-1 focus:ring-white/20 appearance-none"
            >
              {COUNTRIES.map(c => (
                <option key={c.id} value={c.id} className="bg-gray-950 text-gray-300 py-2">
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Dynamic App Theme selector */}
        <div className="space-y-2.5 pt-1.5">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
            <span>🎨</span> Ambient Accent Theme
          </h3>
          <p className="text-[10px] text-gray-500">Adjust the color scheme of headers, navigation tabs, buttons, and animations</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEMES.map(themeOpt => {
              const isSelected = tempTheme === themeOpt.id
              return (
                <button
                  key={themeOpt.id}
                  onClick={() => setTempTheme(themeOpt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                    isSelected
                      ? `${themeOpt.border} border shadow-md`
                      : 'border-white/5 bg-gray-900/25 hover:bg-gray-800/30 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="text-base">{themeOpt.icon}</span>
                  <span className="font-bold text-[10px] uppercase tracking-wider truncate">{themeOpt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
              saveStatus === 'saved'
                ? 'bg-green-600 hover:bg-green-550 text-white shadow-green-900/20'
                : saveStatus === 'saving'
                ? 'bg-purple-650/45 text-purple-300 cursor-not-allowed'
                : `bg-gradient-to-r ${activeTheme.color} hover:opacity-90 text-white`
            }`}
          >
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-1 justify-center">
                <svg className="animate-spin h-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Saving...
              </span>
            ) : saveStatus === 'saved' ? (
              'Preferences Saved! ✨'
            ) : (
              'Save Preferences'
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

// ─── Premium Static Fallback Database ────────────────────────────────
const FALLBACK_STORIES = [
  {
    id: "fb-world-1",
    headline: "Global Trade Routes Shift as Ports Report Record Cargo Volumes",
    summary: "Major maritime trade hubs in Singapore and Rotterdam have reported a 12% year-on-year increase in shipping volume. Industry analysts attribute the surge to shifting supply chain strategies as manufacturers seek closer-to-home logistics routes. The cargo congestion is expected to ease by the third quarter of this fiscal year.",
    source: "Reuters",
    link: "https://www.reuters.com",
    category: "world",
    time: "2h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-politics-1",
    headline: "Bipartisan Infrastructure Bill Approved by Congressional Committee",
    summary: "The Senate Committee on Environment and Public Works has advanced a landmark $90bn regional transit modernization bill. Both parties reached a compromise on funding streams, focusing on public-private partnerships rather than direct tax increases. The bill now heads to the full Senate floor for a final vote next week.",
    source: "Politico",
    link: "https://www.politico.com",
    category: "politics",
    time: "3h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-business-1",
    headline: "Central Bank Maintains Benchmarking Interest Rates Amid Inflation Slowdown",
    summary: "The Federal Reserve announced it will keep current interest rates steady, citing encouraging signs of cooling consumer prices. Chair Jerome Powell stated that while inflation remains above target, the labor market exhibits strong resilience. Economists predict the first rate cuts could begin as early as September.",
    source: "BBC Business",
    link: "https://www.bbc.com/news/business",
    category: "business",
    time: "1h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-tech-1",
    headline: "Tech Giants Announce Unified Security Protocol for AI Models",
    summary: "A coalition of leading technology firms has unveiled a new opensource framework for auditing security vulnerabilities in deep learning models. The standard, named SafeNet, aims to establish standardized benchmarks for data poisoning defense. Implementations will begin rolling out in cloud development platforms next month.",
    source: "The Verge",
    link: "https://www.theverge.com",
    category: "technology",
    time: "4h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-startups-1",
    headline: "Robotics Startup Secures $45M Series B for Warehouse Automation",
    summary: "Boston-based Dexterity Labs has raised $45 million in a funding round led by Venture Capital Partners. The startup plans to use the capital to scale production of its autonomous cargo loading arms. Their AI-driven robots are already deployed in ten distribution centers across North America.",
    source: "TechCrunch",
    link: "https://techcrunch.com",
    category: "startups",
    time: "5h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-ent-1",
    headline: "Indie Film Wins Top Honors at International Film Festival",
    summary: "The quiet drama 'Echoes of the Valley' has won the prestigious Palme Award at this year's festival. Critics praised the first-time director's nuanced storytelling and the lead actress's powerful performance. The film will receive a limited theatrical release in North America this autumn.",
    source: "Variety",
    link: "https://variety.com",
    category: "entertainment",
    time: "6h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-sports-1",
    headline: "Underdog Team Clinches Victory in Thrilling Championship Final",
    summary: "In one of the greatest upsets in modern sports history, the Wildcats defeated the top-seeded Titans 4-3 in extra time. A spectacular header in the 118th minute secured the trophy. Thousands of fans took to the streets to celebrate their city's first major sports championship in over three decades.",
    source: "Sky Sports",
    link: "https://www.skysports.com",
    category: "sports",
    time: "1h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-science-1",
    headline: "Astronomers Detect Giant Water Ice Deposits on Mars' Equator",
    summary: "Using data from orbiting radar probes, scientists have mapped massive sheets of subsurface water ice near the Martian equator. The deposits, buried under several meters of dust, could provide crucial resources for future human missions. The discovery suggests Mars had a more humid climate in its recent geological past.",
    source: "Science Daily",
    link: "https://www.sciencedaily.com",
    category: "science",
    time: "8h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-health-1",
    headline: "Study Links Mediterranean Diet to Enhanced Cognitive Longevity",
    summary: "A 20-year longitudinal study involving over 10,500 participants has found that high adherence to a plant-based diet reduces cognitive decline by 28%. Researchers noted that high levels of antioxidants and healthy monounsaturated fats support brain cell preservation. The findings highlight the critical role of lifestyle in aging.",
    source: "BBC Health",
    link: "https://www.bbc.com/news/health",
    category: "health",
    time: "10h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-auto-1",
    headline: "Electric Vehicle Range Reaches New Milestones with Solid-State Batteries",
    summary: "A major automotive conglomerate has successfully tested a prototype electric sedan that achieves a range of 800 kilometers on a single charge. The breakthrough is powered by next-generation solid-state battery cells. Commercial production is slated to begin in 2028, potentially revolutionizing the EV market.",
    source: "Motor1",
    link: "https://www.motor1.com",
    category: "automobile",
    time: "12h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-travel-1",
    headline: "Ecotourism Destinations Rise in Popularity for Summer Bookings",
    summary: "Travel agencies are reporting a 40% increase in bookings to sustainable travel hotspots and national parks. Travelers are increasingly seeking low-carbon impact accommodation and carbon-neutral hiking experiences. Costa Rica and Iceland remain the top choices for green tourism.",
    source: "Lonely Planet",
    link: "https://www.lonelyplanet.com",
    category: "travel",
    time: "14h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-fashion-1",
    headline: "Fashion Houses Pledge 100% Recycled Textile Usage by 2030",
    summary: "At the global fashion summit, a coalition of luxury brands signed a charter committing to phase out virgin synthetics within the next six years. The brands will invest in automated fabric sorting and chemical recycling plants. The initiative marks a major shift toward circular fashion economics.",
    source: "Vogue",
    link: "https://www.vogue.com",
    category: "fashion",
    time: "16h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-edu-1",
    headline: "Global Universities Partner to Launch Free Digital Learning Platform",
    summary: "A consortium of elite international universities has announced a unified online portal offering free certified courses in quantum computing and climate science. The platform aims to bridge educational accessibility gaps in developing regions. Enrollment starts next week with over 150 courses available.",
    source: "Chronicle of Higher Ed",
    link: "https://www.chronicle.com",
    category: "education",
    time: "18h ago",
    isAiEnhanced: true
  },
  {
    id: "fb-misc-1",
    headline: "Scientists Discover Deep Sea Coral Reef Resembling Intricate Castle",
    summary: "Marine researchers exploring a deep ocean trench off the Pacific coast have photographed a stunning, previously unknown deep-water coral structure. The white coral columns grow in spiraling formations that look remarkably like Gothic spires. The reef is home to several rare fish and invertebrate species.",
    source: "HuffPost Weird News",
    link: "https://www.huffpost.com/weird-news",
    category: "miscellaneous",
    time: "20h ago",
    isAiEnhanced: true
  }
]

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
  const [userCountry, setUserCountry] = useState(() => {
    return localStorage.getItem('NEWS_USER_COUNTRY') || 'global'
  })
  const [appTheme, setAppTheme] = useState(() => {
    return localStorage.getItem('NEWS_APP_THEME') || 'violet'
  })

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

  // Fetch stories from RSS feeds
  const fetchStories = useCallback(async () => {
    setLoading(true)
    
    try {
      let urlsToFetch = []
      const activeWorldFeeds = COUNTRY_WORLD_FEEDS[userCountry] || COUNTRY_WORLD_FEEDS.global
      
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

      const PROXY_URLS = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ]

      // Fetch a single feed with fallback proxies
      const fetchWithFallback = async (feedUrl, name, category) => {
        const separator = feedUrl.includes('?') ? '&' : '?'
        const feedUrlWithBuster = `${feedUrl}${separator}_cb=${Date.now()}`
        
        for (const proxyBase of PROXY_URLS) {
          try {
            const proxyUrl = `${proxyBase}${encodeURIComponent(feedUrlWithBuster)}`
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 4000) // 4s timeout per proxy request
            
            const response = await fetch(proxyUrl, { signal: controller.signal })
            clearTimeout(timeoutId)
            
            if (response.ok) {
              const text = await response.text()
              const parsed = parseRSSFeed(text, name, category)
              if (parsed && parsed.length > 0) {
                return parsed // Return early if we successfully fetched and parsed articles!
              }
            }
          } catch (e) {
            console.warn(`Proxy ${proxyBase} failed for ${name}:`, e.message)
          }
        }
        return []
      }

      // Fetch all feeds in parallel with fallback proxies
      const fetchPromises = urlsToFetch.map(({ url, name, category }) => fetchWithFallback(url, name, category))
      const results = await Promise.all(fetchPromises)
      let allFetched = results.flat()

      // Remove duplicates by headline
      const seen = new Set()
      allFetched = allFetched.filter(story => {
        if (seen.has(story.headline)) return false
        seen.add(story.headline)
        return true
      })

      if (allFetched.length === 0) {
        // Fallback to local database if proxy fetches failed
        console.warn('Feeds failed to resolve. Loading fallback stories.')
        let fallbacks = FALLBACK_STORIES
        if (selectedCategory !== 'all') {
          fallbacks = FALLBACK_STORIES.filter(s => s.category === selectedCategory)
        } else if (userInterests && userInterests.length > 0) {
          fallbacks = FALLBACK_STORIES.filter(s => userInterests.includes(s.category))
        }
        
        // Shuffle the fallback list slightly to keep it feeling fresh on refresh!
        const randomized = [...fallbacks].sort(() => Math.random() - 0.5)
        setStories(randomized)
      } else {
        // Shuffle the live fetched stories list to keep it feeling fresh and dynamic on refresh!
        const randomized = [...allFetched].sort(() => Math.random() - 0.5)
        setStories(randomized)
      }
    } catch (err) {
      console.warn('Failed to fetch stories:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, userCountry, userInterests, parseRSSFeed])

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

            const prompt = `Rewrite the following news article title and description into a catchy, engaging headline and a highly detailed, comprehensive 4-5 sentence summary (around 80-120 words). The summary MUST cover the key facts: Who was involved, What occurred, Where and When it took place, and Why/How it happened. Include any essential numbers, quotes, background context, or impacts, ensuring it serves as a complete stand-alone brief that fully informs the reader. Format the response strictly as a JSON object with keys "headline" and "summary" like this: {"headline": "...", "summary": "..."}. Do not include any other text, markdown code blocks, or explanations. Just raw JSON.
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

  const activeTheme = THEMES.find(t => t.id === appTheme) || THEMES[0]

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
              userCountry={userCountry}
              setUserCountry={setUserCountry}
              appTheme={appTheme}
              setAppTheme={setAppTheme}
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
                  <div key={`skeleton-${i}`} className="h-[calc(100dvh-170px)] min-h-[350px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <SkeletonCard />
                  </div>
                ))
              ) : stories.length > 0 ? (
                stories.map(story => (
                  <div key={story.id} className="h-[calc(100dvh-170px)] min-h-[350px] w-full shrink-0 snap-start snap-always py-1 flex items-center justify-center">
                    <NewsCard story={story} />
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
