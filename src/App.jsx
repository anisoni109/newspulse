import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Categories & Tags ──────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Trending', icon: '🔥', color: 'from-red-500 to-orange-500', bg: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'world', label: 'World', icon: '🌍', color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'politics', label: 'Politics', icon: '🏛️', color: 'from-purple-600 to-violet-500', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'business', label: 'Business', icon: '💼', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'tech', label: 'Technology', icon: '⚡', color: 'from-indigo-600 to-blue-500', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'sports', label: 'Sports', icon: '🏆', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 'science', label: 'Science', icon: '🔬', color: 'from-teal-600 to-green-500', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  { id: 'health', label: 'Health', icon: '❤️‍🩹', color: 'from-pink-600 to-rose-500', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-fuchsia-600 to-purple-500', bg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' },
]

const TAGS_BY_CATEGORY = {
  world: ['Global', 'Diplomacy', 'Summit', 'Crisis'],
  politics: ['Elections', 'Senate', 'Reform', 'Policy'],
  business: ['Markets', 'Finance', 'Startups', 'Economy'],
  tech: ['AI', 'Computing', 'Cybersecurity', 'Innovation'],
  sports: ['Football', 'Championship', 'Olympics', 'Athlete'],
  science: ['Space', 'Climate', 'Fusion', 'Discovery'],
  health: ['Medicine', 'PublicHealth', 'FDA', 'Research'],
  entertainment: ['Cinema', 'Streaming', 'Music', 'Gaming'],
}

const COUNTRIES = [
  { id: 'us', label: 'USA', flag: '🇺🇸' },
  { id: 'uk', label: 'UK', flag: '🇬🇧' },
  { id: 'eu', label: 'Europe', flag: '🇪🇺' },
  { id: 'in', label: 'India', flag: '🇮🇳' },
  { id: 'cn', label: 'China', flag: '🇨🇳' },
  { id: 'ru', label: 'Russia', flag: '🇷🇺' },
  { id: 'me', label: 'Middle East', flag: '🌙' },
  { id: 'africa', label: 'Africa', flag: '🌍' },
  { id: 'sa', label: 'South America', flag: '🌎' },
  { id: 'jp', label: 'Japan', flag: '🇯🇵' },
  { id: 'kr', label: 'Korea', flag: '🇰🇷' },
  { id: 'au', label: 'Australia', flag: '🇦🇺' },
]

// ─── Real RSS Feeds Map ─────────────────────────────────────────────
const CATEGORY_FEEDS = {
  all: [
    'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en'
  ],
  world: [
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'http://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  politics: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    'https://rss.politico.com/politics-policy.xml'
  ],
  business: [
    'https://www.cnbc.com/id/10001147/device/rss/rss.html',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml'
  ],
  tech: [
    'https://www.wired.com/feed/rss',
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml'
  ],
  sports: [
    'https://www.espn.com/espn/rss/news',
    'http://feeds.bbci.co.uk/sport/rss.xml'
  ],
  science: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
    'https://www.wired.com/feed/category/science/latest/rss'
  ],
  health: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml'
  ],
  entertainment: [
    'https://www.eonline.com/rss/news.xml',
    'https://www.hollywoodreporter.com/feed/'
  ]
}

// ─── Fallback Media Images ──────────────────────────────────────────
const FALLBACK_IMAGES = {
  all: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495020689067-958852a6565d?q=80&w=600&auto=format&fit=crop'
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop'
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop'
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop'
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop'
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop'
  ],
  science: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop'
  ],
  health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop'
  ]
}

const FALLBACK_STORIES = {
  world: [
    { title: 'Global Climate Summit Reaches Accord on Carbon Targets', desc: 'Delegates from 190 nations have finalized a landmark agreement committing to binding emissions thresholds by 2035, supported by a green energy fund.', source: 'Reuters' },
    { title: 'New Economic Trade Corridor Announced by G20 Leaders', desc: 'A major infrastructure project linking ports across Asia and Europe is set to start construction next year, aiming to cut shipping times by 30%.', source: 'Associated Press' }
  ],
  politics: [
    { title: 'Bipartisan Tech Privacy Reform Bill Passes Key Senate Vote', desc: 'The draft legislation introduces strict guidelines for data privacy and algorithmic transparency, gaining unexpected support across political lines.', source: 'The Hill' },
    { title: 'Supreme Court Issues Key Decision on Digital Encryption', desc: 'In a 7-2 ruling, the high court established that government requests for device backdoors must meet strict security and warrant thresholds.', source: 'CNN' }
  ],
  business: [
    { title: 'Federal Reserve Signals Interest Rate Pause After Growth Report', desc: 'The central bank indicated stable rates for the upcoming quarter, citing controlled inflation and steady employment gains.', source: 'Bloomberg' },
    { title: 'Green Energy Startup Achieves Unicorn Status with New Funding', desc: 'A firm specializing in long-duration flow batteries has raised $300 million to expand its manufacturing facility in Ohio.', source: 'Wall Street Journal' }
  ],
  tech: [
    { title: 'AI Research Lab Reveals Model Capable of Advanced Logic', desc: 'The new reasoning engine demonstrates capability in solving complex scientific proofs and helping biologists with molecular simulation.', source: 'TechCrunch' },
    { title: 'Solid-State EV Battery Reaches Crucial Testing Phase', desc: 'Engineers report that the new battery tech maintains 90% capacity after 100,000 miles of simulated driving, charging in 12 minutes.', source: 'The Verge' }
  ],
  sports: [
    { title: 'Underdog Team Clinches Dramatic Football League Title', desc: 'In one of the greatest upsets in modern sports history, the last-seeded team won the championship final with a last-minute goal.', source: 'BBC Sport' },
    { title: 'New Tracking Technology Approved for Major League Games', desc: 'Player wearables monitoring biometric fatigue and impact levels will be standard equipment starting next season.', source: 'ESPN' }
  ],
  science: [
    { title: 'Deep Space Observatory Captures Image of Early Solar System', desc: 'Astronomers released images showing dust accretion rings around a star located 400 light years away, providing clues to Earth\'s origins.', source: 'Scientific American' },
    { title: 'Nuclear Fusion Experiment Achieves Sustained Net Energy Gain', desc: 'The ignition chamber produced double the input power for a duration of 3 minutes, breaking previous records for plasma containment.', source: 'Wired' }
  ],
  health: [
    { title: 'FDA Approves Breakthrough Immunotherapy for Lung Cancer', desc: 'The personalized vaccine program trains the patient\'s immune cells to attack cancerous growths, showing high efficacy in trials.', source: 'NBC News' },
    { title: 'National Study Highlights Benefits of Regular Micro-Workouts', desc: 'Five minutes of intense daily activity was found to improve cardiovascular markers by up to 20%, showing comparable benefits to longer routines.', source: 'Healthline' }
  ],
  entertainment: [
    { title: 'Independent Film Wins Top Honors at International Festival', desc: 'A low-budget drama shot entirely on location won three main awards, with critics praising the lead performance and score.', source: 'The Hollywood Reporter' },
    { title: 'Virtual Reality Concert Platform Attracts Millions of Fans', desc: 'A major musical artist hosted an interactive live show inside a digital arena, paving the way for next-gen performance formats.', source: 'Variety' }
  ]
}

// ─── Helpers ────────────────────────────────────────────────────────
const getCountryFeedUrl = (countryId) => {
  const countryNameMap = {
    us: 'United States',
    uk: 'United Kingdom',
    eu: 'Europe',
    in: 'India',
    cn: 'China',
    ru: 'Russia',
    me: 'Middle East',
    africa: 'Africa',
    sa: 'South America',
    jp: 'Japan',
    kr: 'South Korea',
    au: 'Australia'
  }
  const name = countryNameMap[countryId] || 'World'
  return `https://news.google.com/rss/search?q=location:${encodeURIComponent(name)}&hl=en-US&gl=US&ceid=US:en`
}

const getFallbackImage = (category) => {
  const images = FALLBACK_IMAGES[category] || FALLBACK_IMAGES['all']
  return images[Math.floor(Math.random() * images.length)]
}

const decodeHTMLEntities = (text) => {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}

const formatTimeAgo = (date) => {
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

// Web Audio API synth beep sound effect
const playSynthBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch (e) {
    console.warn('Web Audio Context not allowed or initialized yet.')
  }
}

// ─── Share Component ────────────────────────────────────────────────
function ShareButton({ story, onShare }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async (e) => {
    e.stopPropagation()
    const text = `🔥 ${story.headline} (via ${story.source})\n\n${story.summary}\n\nRead more: ${story.link}`
    if (navigator.share) {
      try {
        await navigator.share({ title: story.headline, text, url: story.link })
        if (onShare) onShare()
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (onShare) onShare()
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-12 h-12 bg-white/10 hover:bg-white/20 active:scale-90 rounded-full flex flex-col items-center justify-center transition-all border border-white/20 relative"
      title="Share Story"
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied && (
        <span className="absolute -top-8 px-2 py-1 bg-violet-600 border border-violet-500 text-[10px] font-bold text-white rounded shadow-md animate-bounce">
          Copied!
        </span>
      )}
    </button>
  )
}

// ─── News Card (TikTok Immersive View) ──────────────────────────────
function NewsCard({ story, isActive, onAction }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(story.likes)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hearts, setHearts] = useState([])
  const lastClick = useRef(0)
  const catInfo = CATEGORIES.find(c => c.id === story.category) || CATEGORIES[0]

  // Stop speech if card goes out of focus/active state
  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isActive, isSpeaking])

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  const handleDoubleTap = (e) => {
    // Determine click position relative to target container
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Add double-tap heart pop particle
    const newHeart = { id: Date.now(), x, y }
    setHearts(prev => [...prev, newHeart])
    
    // Play subtle synth bubbly pop
    playSynthBeep()
    
    if (!isLiked) {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
      if (onAction) onAction('like')
    }
    
    // Clear particle after animation ends
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id))
    }, 800)
  }

  const handleCardClick = (e) => {
    // Avoid triggering when buttons, anchor or sub-elements are clicked
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('span.tag-bubble')) return
    
    const now = Date.now()
    if (now - lastClick.current < 280) {
      handleDoubleTap(e)
    }
    lastClick.current = now
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    playSynthBeep()
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
      if (onAction) onAction('like')
    }
  }

  const handleTTSClick = (e) => {
    e.stopPropagation()
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      window.speechSynthesis.cancel()
      const text = `${story.headline}. Summary: ${story.summary}`
      const utterance = new SpeechSynthesisUtterance(text)
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      const voices = window.speechSynthesis.getVoices()
      // Prefer natural or high-quality english voice
      const voice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Natural'))) 
        || voices.find(v => v.lang.startsWith('en-')) 
        || voices[0]
        
      if (voice) {
        utterance.voice = voice
      }
      
      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
      if (onAction) onAction('tts')
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="relative w-full h-full bg-zinc-950 flex flex-col justify-between overflow-hidden shadow-2xl select-text transition-all duration-300 group rounded-3xl border border-white/10"
    >
      {/* Background Immersive Media Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={story.imageUrl}
          alt={story.headline}
          className="w-full h-full object-cover opacity-60 transition-transform duration-1000 scale-[1.03] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* Floating Hearts Pop Overlay */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute pointer-events-none text-red-500 animate-heart-pop z-50"
          style={{ left: h.x - 40, top: h.y - 40 }}
        >
          <svg className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.85)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      ))}

      {/* Top Details */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <span className="text-xl">{catInfo.icon}</span>
          <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1">
            {story.source}
            <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 20 20">
              <path d="M6.267 3.455a.75.75 0 00-.75-.75H3.5a1 1 0 00-1 1v2.017c0 .185.068.363.19.5l7.983 7.983a1 1 0 001.414 0l2.017-2.017a1 1 0 000-1.414L6.12 3.58a.75.75 0 00-.147-.125z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {catInfo.label}
        </span>
      </div>

      {/* Main Body (Left Content Overlay + Right Action Sidebar) */}
      <div className="relative z-10 flex items-end justify-between px-5 pb-6 pt-20 mt-auto w-full gap-4">
        {/* Left text container */}
        <div className="flex-1 flex flex-col text-left space-y-3.5 max-w-[80%]">
          {/* TTS Visualizer Waves */}
          {isSpeaking && (
            <div className="flex items-center gap-1 bg-violet-500/20 px-3 py-1.5 rounded-full border border-violet-500/30 w-fit">
              <span className="w-1 h-3 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.0s' }} />
              <span className="w-1 h-4.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1 h-3.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="text-[10px] font-bold text-violet-300 ml-1.5 uppercase tracking-wider">Reading Now</span>
            </div>
          )}

          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-3 select-text">
            {story.headline}
          </h2>

          <p className="text-xs sm:text-sm text-gray-200/95 font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-4 select-text">
            {story.summary}
          </p>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-1.5">
            {story.tags.map(tag => (
              <span key={tag} className="tag-bubble text-[9px] font-bold uppercase px-2.5 py-1 rounded bg-white/10 backdrop-blur-md text-white border border-white/10">
                #{tag}
              </span>
            ))}
          </div>

          {/* Legit external CTA link */}
          <a
            href={story.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onAction && onAction('click')}
            className="inline-flex items-center gap-1.5 w-fit mt-1 text-[11px] font-extrabold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all px-4 py-2.5 rounded-full shadow-lg shadow-purple-950/40 border border-white/20"
          >
            <span>Read Original Article</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Right Sidebar actions */}
        <div className="flex flex-col items-center space-y-4 shrink-0 pb-1.5">
          {/* Publisher Initial Avatar */}
          <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-800 flex items-center justify-center shadow-lg mb-1 relative group">
            <span className="text-white font-extrabold text-base uppercase">{story.source.charAt(0)}</span>
            <span className="absolute -bottom-1 right-0 w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
              <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border active:scale-75 transition-all shadow-md ${
              isLiked 
                ? 'bg-red-500 border-red-400 text-white animate-pulse' 
                : 'bg-black/45 border-white/10 hover:bg-black/60 text-white'
            }`}
          >
            <svg className="w-5.5 h-5.5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <span className="text-[10px] font-extrabold text-gray-200 tracking-wider shadow-sm select-none">
            {likeCount}
          </span>

          {/* Text-to-Speech Voice Button */}
          <button
            onClick={handleTTSClick}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border active:scale-90 transition-all shadow-md ${
              isSpeaking 
                ? 'bg-violet-600 border-violet-500 text-white' 
                : 'bg-black/45 border-white/10 hover:bg-black/60 text-white'
            }`}
            title={isSpeaking ? 'Mute Speech' : 'Listen to Article'}
          >
            {isSpeaking ? (
              <svg className="w-5.5 h-5.5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.536 8.464a5 5 0 010 7.072M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
              </svg>
            )}
          </button>
          <span className="text-[10px] font-extrabold text-gray-200 tracking-wider shadow-sm select-none">
            Listen
          </span>

          {/* Share Button */}
          <ShareButton story={story} onShare={() => onAction && onAction('share')} />
          <span className="text-[10px] font-extrabold text-gray-200 tracking-wider shadow-sm select-none">
            {story.shares}
          </span>

          <span className="text-[9px] font-bold text-gray-400/90 tracking-tighter mt-1">{story.time}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Skeleton Card (Dark Pulse) ────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative w-full h-full bg-zinc-950 flex flex-col justify-between p-6 rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-pulse">
      <div className="absolute inset-0 opacity-15"><div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-500 rounded-full blur-[100px]" /></div>
      <div className="flex justify-between items-center z-10 mb-4">
        <div className="w-28 h-8 bg-white/10 rounded-full border border-white/5" />
        <div className="w-20 h-8 bg-white/10 rounded-full border border-white/5" />
      </div>
      <div className="z-10 mt-auto space-y-4 max-w-[80%]">
        <div className="h-6 w-full bg-white/15 rounded-md" />
        <div className="h-6 w-3/4 bg-white/15 rounded-md" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-3 w-5/6 bg-white/10 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 bg-white/10 rounded-full" />
          <div className="h-5 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="h-9 w-32 bg-white/15 rounded-full mt-2" />
      </div>
    </div>
  )
}

// ─── Explore Page (Topics + Countries selector) ─────────────────────
function ExplorePage({ onSelectCategory, selectedCategory }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-white mb-1.5 bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Explore Feeds</h1>
        <p className="text-xs text-gray-400">Select topics or countries to personalize your feed. Swipe to read.</p>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4.5 flex items-center gap-2 border-b border-white/5 pb-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Featured Topics
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative p-3.5 rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-center group active:scale-95 ${
                selectedCategory === cat.id
                  ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg ring-1 ring-white/20`
                  : 'border-white/5 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-white/10 text-gray-300'
              }`}
            >
              <span className="text-2xl mb-1.5 drop-shadow-md group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-extrabold text-[11px] tracking-wide uppercase">{cat.label}</span>
              {selectedCategory === cat.id && (
                <div className="absolute top-1.5 right-1.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Countries Section */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4.5 flex items-center gap-2 border-b border-white/5 pb-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Regions & Countries
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {COUNTRIES.map(country => (
            <button
              key={country.id}
              onClick={() => onSelectCategory(`country-${country.id}`)}
              className={`relative p-2.5 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center group active:scale-95 ${
                selectedCategory === `country-${country.id}`
                  ? 'border-transparent bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg ring-1 ring-white/20'
                  : 'border-white/5 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-white/10 text-gray-300'
              }`}
            >
              <span className="text-2xl mb-1 drop-shadow-md group-hover:scale-110 transition-transform">{country.flag}</span>
              <span className="font-extrabold text-[9px] tracking-wider uppercase">{country.label}</span>
              {selectedCategory === `country-${country.id}` && (
                <div className="absolute top-1 right-1">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main App Component ─────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'explore'
  const [allStories, setAllStories] = useState([])
  const [displayedStories, setDisplayedStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeStoryId, setActiveStoryId] = useState(null)
  
  const observerTarget = useRef(null)
  const feedContainerRef = useRef(null)

  // ─── Personalization Weights Logic ──────────────────────────────────
  const getCategoryWeights = useCallback(() => {
    const stored = localStorage.getItem('newspulse_category_weights')
    if (stored) {
      try { return JSON.parse(stored) } catch (e) {}
    }
    const defaultWeights = {}
    CATEGORIES.forEach(c => { defaultWeights[c.id] = 1.0 })
    return defaultWeights
  }, [])

  const boostCategoryWeight = useCallback((catId, amount) => {
    if (!catId || catId === 'all') return
    const weights = getCategoryWeights()
    weights[catId] = (weights[catId] || 1.0) + amount
    if (weights[catId] > 6.0) weights[catId] = 6.0 // cap
    localStorage.setItem('newspulse_category_weights', JSON.stringify(weights))
  }, [getCategoryWeights])

  const rankStories = useCallback((storiesList) => {
    const weights = getCategoryWeights()
    return [...storiesList].sort((a, b) => {
      const weightA = weights[a.category] || 1.0
      const weightB = weights[b.category] || 1.0
      
      // Decay penalty: half life of ~12 hours to push recent news up
      const ageA = Date.now() - a.timestamp
      const ageB = Date.now() - b.timestamp
      const recencyA = 1 / (1 + ageA / (1000 * 60 * 60 * 12))
      const recencyB = 1 / (1 + ageB / (1000 * 60 * 60 * 12))
      
      const scoreA = weightA * recencyA * (1 + (a.likes / 4000))
      const scoreB = weightB * recencyB * (1 + (b.likes / 4000))
      
      return scoreB - scoreA
    })
  }, [getCategoryWeights])

  // ─── Feed Parsing ──────────────────────────────────────────────────
  const parseXML = useCallback((xmlText, category, customSource = null) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    const items = doc.querySelectorAll('item')
    const stories = []

    const getArticleImage = (item, cat) => {
      const enclosure = item.querySelector('enclosure')
      if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
        return enclosure.getAttribute('url')
      }
      const mediaContent = item.getElementsByTagName('media:content')[0] || item.getElementsByTagName('content')[0]
      if (mediaContent && mediaContent.getAttribute('url')) {
        return mediaContent.getAttribute('url')
      }
      const mediaThumbnail = item.getElementsByTagName('media:thumbnail')[0]
      if (mediaThumbnail && mediaThumbnail.getAttribute('url')) {
        return mediaThumbnail.getAttribute('url')
      }
      const description = item.querySelector('description')?.textContent || ''
      const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
      if (imgMatch) {
        return imgMatch[1]
      }
      return getFallbackImage(cat)
    }

    items.forEach((item, index) => {
      let title = item.querySelector('title')?.textContent || ''
      let description = item.querySelector('description')?.textContent || ''
      
      // Strip HTML
      description = description.replace(/<[^>]*>/g, '').trim()
      description = decodeHTMLEntities(description)
      
      const link = item.querySelector('link')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      
      let source = customSource || 'News Feed'
      const sourceMatch = title.match(/(.+)\s+-\s+([^-]+)$/)
      if (sourceMatch) {
        title = sourceMatch[1].trim()
        source = sourceMatch[2].trim()
      }
      
      title = decodeHTMLEntities(title)
      source = source.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]

      if (title && description && description.length > 15) {
        stories.push({
          id: `rss-${category}-${index}-${title.substring(0, 12)}-${pubDate}`,
          headline: title,
          summary: description,
          source: source,
          link: link,
          category: category,
          imageUrl: getArticleImage(item, category),
          tags: [category.toUpperCase(), source.replace(/\s+/g, '')],
          time: pubDate ? formatTimeAgo(new Date(pubDate)) : 'Just now',
          timestamp: pubDate ? new Date(pubDate).getTime() : Date.now(),
          likes: Math.floor(Math.random() * 850) + 120,
          comments: Math.floor(Math.random() * 110) + 15,
          shares: Math.floor(Math.random() * 60) + 8,
        })
      }
    })

    return stories
  }, [])

  const generateFallbackStories = useCallback((catId) => {
    const normalizedCat = catId.startsWith('country-') ? 'world' : (catId === 'all' ? 'world' : catId)
    const items = FALLBACK_STORIES[normalizedCat] || FALLBACK_STORIES['world']
    return items.map((item, index) => ({
      id: `fallback-${normalizedCat}-${index}-${Date.now()}`,
      headline: item.title,
      summary: item.desc,
      source: item.source,
      link: 'https://news.google.com',
      category: normalizedCat,
      imageUrl: getFallbackImage(normalizedCat),
      tags: [normalizedCat.toUpperCase(), item.source.replace(/\s+/g, '')],
      time: `${index + 1}h ago`,
      timestamp: Date.now() - index * 3600000 - 120000,
      likes: Math.floor(Math.random() * 320) + 80,
      comments: Math.floor(Math.random() * 45) + 6,
      shares: Math.floor(Math.random() * 22) + 3,
    }))
  }, [])

  // ─── Fetching Logic ────────────────────────────────────────────────
  const loadStories = useCallback(async (append = false, catId = 'all') => {
    setLoading(true)
    try {
      let fetched = []
      
      if (catId.startsWith('country-')) {
        const countryId = catId.replace('country-', '')
        const url = getCountryFeedUrl(countryId)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        const res = await fetch(proxyUrl)
        if (res.ok) {
          const data = await res.json()
          if (data && data.contents) {
            fetched = parseXML(data.contents, 'world', countryId.toUpperCase())
          }
        }
      } else {
        const urls = CATEGORY_FEEDS[catId] || CATEGORY_FEEDS['all']
        for (const url of urls) {
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
            const res = await fetch(proxyUrl)
            if (!res.ok) continue
            const data = await res.json()
            if (data && data.contents) {
              const parsed = parseXML(data.contents, catId)
              fetched = [...fetched, ...parsed]
            }
          } catch (e) {
            console.warn(`Failed to fetch feed ${url}`, e)
          }
        }
      }

      if (fetched.length === 0) {
        fetched = generateFallbackStories(catId)
      }

      const ranked = rankStories(fetched)

      if (append) {
        setAllStories(prev => {
          const combined = [...prev, ...ranked]
          const seen = new Set()
          return combined.filter(s => {
            const isDup = seen.has(s.headline)
            seen.add(s.headline)
            return !isDup
          })
        })
      } else {
        setAllStories(ranked)
        setPage(0)
      }
    } catch (err) {
      console.error('Error loading stories:', err)
      const fallbacks = generateFallbackStories(catId)
      setAllStories(fallbacks)
    } finally {
      setLoading(false)
    }
  }, [parseXML, rankStories, generateFallbackStories])

  // Initial load
  useEffect(() => {
    loadStories(false, selectedCategory)
  }, [selectedCategory, loadStories])

  // Sync displayed slice based on pagination
  useEffect(() => {
    if (allStories.length > 0) {
      const sliceEnd = Math.min((page + 1) * 5, allStories.length)
      setDisplayedStories(allStories.slice(0, sliceEnd))
      
      // Set default active card ID on load
      if (!activeStoryId && allStories[0]) {
        setActiveStoryId(allStories[0].id)
      }
    } else {
      setDisplayedStories([])
    }
  }, [allStories, page, activeStoryId])

  // Infinite scroll intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && allStories.length > displayedStories.length) {
          setPage(p => p + 1)
        }
      },
      { threshold: 0.2 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loading, allStories.length, displayedStories.length])

  // Track active card visible for scroll TTS stops
  useEffect(() => {
    if (displayedStories.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveStoryId(entry.target.getAttribute('data-id'))
          }
        })
      },
      { threshold: 0.6 } // Card must be mostly visible
    )
    
    const elements = document.querySelectorAll('.reels-card-container')
    elements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [displayedStories])

  const handleRefresh = async () => {
    setRefreshing(true)
    window.speechSynthesis.cancel()
    await loadStories(false, selectedCategory)
    setTimeout(() => setRefreshing(false), 500)
  }

  const handleExploreSelect = (catId) => {
    setSelectedCategory(catId)
    setActiveTab('feed')
    setAllStories([])
    setDisplayedStories([])
    setActiveStoryId(null)
  }

  const handleEngagement = (catId, type) => {
    let weight = 0.5
    if (type === 'like') weight = 2.0
    if (type === 'click') weight = 1.5
    if (type === 'share') weight = 1.0
    if (type === 'tts') weight = 1.2
    boostCategoryWeight(catId, weight)
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-zinc-950 text-white select-none">
      {/* Immersive Header */}
      <header className="shrink-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-md shadow-black/30 z-30">
        <div className="max-w-md mx-auto px-4.5 py-3">
          <div className="flex items-center justify-between">
            {/* Pulsing Glowing Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30 ring-1 ring-white/10">
                <svg className="w-4.5 h-4.5 text-white fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">NewsPulse</h1>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">TikTok of News</p>
              </div>
            </div>

            {/* Refresh Feed */}
            <button 
              onClick={handleRefresh} 
              disabled={refreshing} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] transition-all uppercase tracking-wider ${
                refreshing 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 border border-white/10 active:scale-95'
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <nav className="flex gap-1.5 mt-3.5 bg-white/5 p-1 rounded-full border border-white/5">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg border border-white/15'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Feed
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                activeTab === 'explore'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg border border-white/15'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore
            </button>
          </nav>
        </div>
      </header>

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'explore' ? (
          <div className="h-full w-full overflow-y-auto no-scrollbar bg-zinc-950">
            <ExplorePage onSelectCategory={handleExploreSelect} selectedCategory={selectedCategory} />
          </div>
        ) : (
          <div className="h-full w-full bg-zinc-950 flex flex-col justify-center">
            {/* Current Active Category Pill Indicator */}
            {selectedCategory !== 'all' && (
              <div className="absolute top-4 left-0 right-0 mx-auto z-20 flex justify-center pointer-events-none">
                <div className="flex items-center gap-2 bg-purple-600/90 border border-purple-400/40 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full shadow-lg pointer-events-auto backdrop-blur-md">
                  <span>Filtering: {selectedCategory.startsWith('country-') ? COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.label : CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                  <button 
                    onClick={() => handleExploreSelect('all')} 
                    className="hover:text-red-300 font-black ml-1 border-l border-white/20 pl-2 cursor-pointer transition-colors"
                  >
                    CLEAR
                  </button>
                </div>
              </div>
            )}

            {/* Vertical Snapping Container */}
            <div 
              ref={feedContainerRef}
              className="h-full w-full max-w-md mx-auto overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col py-1.5 sm:py-3.5 px-2 sm:px-0"
            >
              {displayedStories.map(story => (
                <div 
                  key={story.id} 
                  data-id={story.id}
                  className="reels-card-container w-full h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] shrink-0 snap-start snap-always flex items-center justify-center py-1.5 sm:py-2.5"
                >
                  <NewsCard 
                    story={story} 
                    isActive={story.id === activeStoryId}
                    onAction={(type) => handleEngagement(story.category, type)} 
                  />
                </div>
              ))}

              {loading && (
                <div className="w-full h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] shrink-0 snap-start flex items-center justify-center py-2.5">
                  <SkeletonCard />
                </div>
              )}

              {/* Observer marker for infinite pagination */}
              <div ref={observerTarget} className="h-10 shrink-0 w-full flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                {displayedStories.length > 0 && !loading && 'loading more content...'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Swiping Hint Footer */}
      <footer className="shrink-0 py-2.5 border-t border-white/5 bg-zinc-950/90 text-center z-15 backdrop-blur-md">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1.5 select-none">
          Swipe UP for Next Story
          <span className="inline-block animate-bounce font-black">↑</span>
          • Double-Tap to Like
        </p>
      </footer>
    </div>
  )
}

export default App
