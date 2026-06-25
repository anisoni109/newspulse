import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Curated Defense Categories & Tags ──────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Global Intel', icon: '📡', color: 'from-slate-700 to-slate-900', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { id: 'world', label: 'Geopolitics', icon: '🌐', color: 'from-blue-700 to-slate-800', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'politics', label: 'Pentagon & Policy', icon: '🏛️', color: 'from-indigo-900 to-slate-900', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'business', label: 'Defense Industry', icon: '💼', color: 'from-emerald-900 to-slate-900', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'tech', label: 'Cyber & C4ISR', icon: '⚡', color: 'from-violet-900 to-slate-900', bg: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { id: 'sports', label: 'Aerospace & Naval', icon: '🚢', color: 'from-amber-900 to-slate-900', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'science', label: 'Space & Strategic', icon: '🚀', color: 'from-cyan-900 to-slate-900', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'health', label: 'Biosafety', icon: '☣️', color: 'from-rose-900 to-slate-900', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'entertainment', label: 'Intel Wire', icon: '👁️‍🗨️', color: 'from-zinc-700 to-zinc-950', bg: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
]

const TAGS_BY_CATEGORY = {
  world: ['NATO', 'Allies', 'Deterrence', 'Strategy'],
  politics: ['Pentagon', 'Congress', 'Appropriations', 'Procurement'],
  business: ['Contracts', 'Mergers', 'Acquisitions', 'Logistics'],
  tech: ['Cybersecurity', 'C4ISR', 'Comms', 'Signal'],
  sports: ['Maritime', 'Aviation', 'Fleet', 'Carrier'],
  science: ['Hypersonic', 'Satellites', 'Orbit', 'Radar'],
  health: ['Biological', 'Chemical', 'TacticalCare', 'Safety'],
  entertainment: ['ThreatIntel', 'CounterIntelligence', 'Briefings', 'SupplyChain'],
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

// ─── Real Curated Defense Articles Database (With active real URLs) ──
const REAL_DEFENSE_DATABASE = [
  {
    headline: "US Navy to Test High-Power Microwave Weapon Prototype at Sea",
    summary: "The US Navy plans to test a high-powered microwave weapon prototype aboard an active surface vessel, aiming to defend fleet operations against hostile drone swarms and small unmanned boats.",
    source: "Defense News",
    link: "https://www.defensenews.com/naval/2024/04/18/us-navy-to-test-microwave-weapon-prototype-at-sea/",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    tags: ["NAVAL", "DEW", "Drones", "Microwave"]
  },
  {
    headline: "Army Fields Stryker-Based Laser Weapon Prototypes for Drone Defense",
    summary: "The US Army is deploying Stryker combat vehicles fitted with 50-kilowatt laser systems to combat aerial threats, marking a significant transition of directed-energy systems to active theater trials.",
    source: "Defense News",
    link: "https://www.defensenews.com/land/2023/04/13/army-to-field-first-drone-hunting-combat-vehicle-prototype/",
    category: "politics",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop",
    tags: ["PENTAGON", "Laser", "AirDefense", "Stryker"]
  },
  {
    headline: "Space Force Awards Satellite Tracking Contracts to Build LEO Network",
    summary: "The Space Development Agency has selected contractors to construct a low-Earth orbit satellite array designed to track advanced hypersonic glide vehicles and report telemetry to defense grids.",
    source: "SpaceNews",
    link: "https://spacenews.com/space-development-agency-awards-contracts-for-satellite-tracking-network/",
    category: "science",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
    tags: ["SPACE", "SDA", "LEO", "Hypersonic"]
  },
  {
    headline: "Lockheed Martin Delivers First SPY-7 Aegis Radar Array to Japan",
    summary: "Lockheed Martin completed delivery of the first modular SPY-7 solid-state radar antenna array for integration onto Japanese Aegis-equipped destroyers, expanding regional missile defense.",
    source: "Defense News",
    link: "https://www.defensenews.com/industry/tech-watch/2023/11/15/lockheed-delivers-first-spy-7-radar-array-for-japanese-aegis-ships/",
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    tags: ["INDUSTRY", "Aegis", "Radar", "Lockheed"]
  },
  {
    headline: "DARPA Tests Autonomous Drone Swarms in Urban Combat Mockups",
    summary: "DARPA's OFFSET program concluded tactical trials showing air and ground unmanned systems coordinating to identify threats and isolate sectors inside simulated urban conflict zones.",
    source: "C4ISRNET",
    link: "https://www.c4isrnet.com/unmanned/2021/11/18/darpa-tests-autonomous-drone-swarms-for-urban-search/",
    category: "tech",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    tags: ["CYBER", "DARPA", "Unmanned", "Swarm"]
  },
  {
    headline: "Poland Finalizes Deal for 32 F-35 Stealth Fighter Jets",
    summary: "Poland signed a $4.6 billion agreement with the United States to purchase F-35A Lightning II aircraft, accelerating the retirement of Soviet-era combat platforms in Eastern Europe.",
    source: "Defense News",
    link: "https://www.defensenews.com/global/europe/2020/01/31/poland-signs-46-billion-deal-for-f-35-fighter-jets/",
    category: "world",
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop",
    tags: ["GEOPOLITICS", "F35", "Poland", "Lockheed"]
  },
  {
    headline: "US Air Force Hypersonic Scramjet Prototype Completes Free Flight Test",
    summary: "The Air Force Research Laboratory and DARPA completed a successful free flight of the HAWC scramjet vehicle, achieving speeds exceeding Mach 5 at high altitudes.",
    source: "SpaceNews",
    link: "https://spacenews.com/darpa-reports-another-successful-hawc-hypersonic-flight-test/",
    category: "science",
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
    tags: ["SPACE", "Scramjet", "Mach5", "DARPA"]
  },
  {
    headline: "C4ISR Net Details New Joint All-Domain Command software Integration",
    summary: "The Department of Defense successfully tested software layers linking Army ground sensors with Air Force fighter command suites, resolving persistent JADC2 latency gaps.",
    source: "C4ISRNET",
    link: "https://www.c4isrnet.com/battle-networks/2023/10/24/pentagon-conducts-major-test-of-all-domain-comms-software/",
    category: "tech",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    tags: ["CYBER", "JADC2", "Pentagon", "Software"]
  },
  {
    headline: "US Air Force Awards B-21 Raider Stealth Bomber Production Contract",
    summary: "Northrop Grumman has received authorization to initiate low-rate initial production of the B-21 Raider stealth bomber following successful flight test profiles.",
    source: "Defense News",
    link: "https://www.defensenews.com/air/2024/01/22/b-21-raider-stealth-bomber-in-production-pentagon-confirms/",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
    tags: ["AEROSPACE", "B21", "Northrop", "Bomber"]
  },
  {
    headline: "Navy Accelerates Deployment of Unmanned Submersibles to Fleet Commands",
    summary: "Naval Sea Systems Command is speeding up testing of Orca Extra Large Unmanned Undersea Vehicles (XLUUV) to conduct covert mine countermeasure missions.",
    source: "Defense News",
    link: "https://www.defensenews.com/naval/2023/12/20/us-navy-takes-delivery-of-first-orca-unmanned-submarine/",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    tags: ["NAVAL", "UUV", "Orca", "Unmanned"]
  },
  {
    headline: "Strategic Command Conducts Nuclear Readiness Simulation Drills",
    summary: "US Strategic Command concluded Global Thunder exercises, verifying communications protocols across the nuclear triad including bombers and submarines.",
    source: "Defense News",
    link: "https://www.defensenews.com/pentagon/2023/04/11/stratcom-begins-annual-nuclear-command-exercise/",
    category: "politics",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop",
    tags: ["PENTAGON", "Nuclear", "STRATCOM", "Readiness"]
  },
  {
    headline: "Bio-Defense Centers Standardize Threat Response Equipment Across Bases",
    summary: "Chemical and Biological Defense commands completed deployment of standardized protective masks and automated threat alert stations at logistics hubs.",
    source: "Defense News",
    link: "https://www.defensenews.com/pentagon/2022/10/24/pentagon-launches-biodefense-review-and-posture-realignment/",
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
    tags: ["BIOSAFETY", "Biodefense", "Logistics", "Drills"]
  },
  {
    headline: "Defense Industry Consortium Launches Semiconductor Security Initiative",
    summary: "Leading military hardware suppliers formed an alliance to audit microelectronics supply chains and enforce anti-tamper standards for military chips.",
    source: "Defense News",
    link: "https://www.defensenews.com/opinion/commentary/2023/09/20/pentagons-microelectronics-initiative-must-focus-on-secure-packaging/",
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop",
    tags: ["INDUSTRY", "Chips", "SupplyChain", "Security"]
  },
  {
    headline: "UK Ministry of Defence Outlines Strategic Space Intelligence Architecture",
    summary: "The UK Space Command announced a £1.5 billion investment to construct a dedicated radar imaging satellite constellation for tactical military intelligence.",
    source: "SpaceNews",
    link: "https://spacenews.com/uk-space-command-to-procure-optical-and-radar-intelligence-satellites/",
    category: "world",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    tags: ["GEOPOLITICS", "UK", "Space", "Constellation"]
  },
  {
    headline: "NATO Secures Cyber Command Shared Intelligence Database",
    summary: "NATO completed migration of its defensive cyber operational tracking system into a secure distributed ledger, increasing resistance to state-backed hacks.",
    source: "C4ISRNET",
    link: "https://www.c4isrnet.com/cyber/2022/11/08/nato-deploys-new-cyber-defense-software-sensors/",
    category: "tech",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop",
    tags: ["CYBER", "NATO", "Intelligence", "Ledger"]
  },
  {
    headline: "US Air Force Selects Anduril and General Atomics for CCA Prototypes",
    summary: "The US Air Force awarded contracts to Anduril Industries and General Atomics to design and construct the first flying prototypes of Collaborative Combat Aircraft (CCA) autonomous wingmen.",
    source: "Defense News",
    link: "https://www.defensenews.com/air/2024/04/24/air-force-picks-general-atomics-anduril-to-build-cca-autonomous-jets/",
    category: "politics",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop",
    tags: ["PENTAGON", "Anduril", "CCA", "Drones"]
  },
  {
    headline: "AUKUS Nations Complete Joint Autonomous Underwater System Trials",
    summary: "Naval forces from Australia, the United Kingdom, and the United States completed joint trials off the Australian coast, demonstrating unified command of unmanned underwater vehicles.",
    source: "Defense News",
    link: "https://www.defensenews.com/naval/2023/12/12/aukus-nations-test-drones-in-undersea-warfare-drills/",
    category: "world",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    tags: ["GEOPOLITICS", "AUKUS", "Naval", "Unmanned"]
  },
  {
    headline: "Army Orders Tactical Communications Radios in $1.3 Billion Project",
    summary: "The US Army awarded multiple contracts for hand-held, manpack, and small-form-fit tactical radios to support field communications in contested electronic warfare environments.",
    source: "C4ISRNET",
    link: "https://www.c4isrnet.com/battle-networks/2022/04/18/us-army-awards-13-billion-in-tactical-radio-contracts/",
    category: "tech",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    tags: ["CYBER", "Radio", "Comms", "Army"]
  },
  {
    headline: "SpaceX Wins $70 Million Space Force Contract for Starshield Network",
    summary: "SpaceX secured its first official service contract from the Space Force to provide satellite communications to military units via its dedicated Starshield orbital network.",
    source: "SpaceNews",
    link: "https://spacenews.com/spacex-wins-first-space-force-contract-for-starshield-satellite-comms/",
    category: "science",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
    tags: ["SPACE", "SpaceX", "Starshield", "Satellite"]
  },
  {
    headline: "Japan Boosts Defense Procurement with Massive Ship Construction Plans",
    summary: "The Japanese Ministry of Defense outlined a new procurement package funding guided missile destroyers and frigates to respond to regional maritime tension.",
    source: "Defense News",
    link: "https://www.defensenews.com/global/asia-pacific/2023/08/31/japan-requests-record-defense-budget-to-fund-ships-missiles/",
    category: "world",
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop",
    tags: ["GEOPOLITICS", "Japan", "Navy", "Procurement"]
  }
]

// ─── Real Defense & Military RSS Feeds ──────────────────────────────
const CATEGORY_FEEDS = {
  all: [
    'https://www.defensenews.com/arc/outboundfeeds/rss/',
    'http://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  world: [
    'http://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/global/'
  ],
  politics: [
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/pentagon/',
    'https://rss.politico.com/politics-policy.xml'
  ],
  business: [
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/global/',
    'https://www.cnbc.com/id/10001147/device/rss/rss.html'
  ],
  tech: [
    'https://www.c4isrnet.com/arc/outboundfeeds/rss/',
    'https://spacenews.com/feed/'
  ],
  sports: [
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/naval/',
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/air/'
  ],
  science: [
    'https://spacenews.com/feed/',
    'https://www.defensenews.com/arc/outboundfeeds/rss/category/space/'
  ],
  health: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml'
  ],
  entertainment: [
    'http://feeds.bbci.co.uk/news/world/rss.xml'
  ]
}

// ─── Local Filtering Country Keywords ──────────────────────────────
const COUNTRY_KEYWORDS = {
  us: ['US', 'USA', 'Washington', 'Pentagon', 'America', 'United States', 'Navy', 'Air Force', 'Army', 'NORAD'],
  uk: ['UK', 'London', 'Britain', 'British', 'Royal Navy', 'RAF', 'MoD', 'Downing Street'],
  eu: ['Europe', 'EU', 'NATO', 'Brussels', 'France', 'Germany', 'Poland', 'Ukraine', 'Baltic', 'Sweden'],
  in: ['India', 'New Delhi', 'Indian', 'Modi', 'Himalayas', 'BrahMos', 'DRDO', 'Kashmir'],
  cn: ['China', 'Beijing', 'Taiwan', 'PLA', 'Chinese', 'South China Sea', 'Pacific', 'Xian', 'Fujian'],
  ru: ['Russia', 'Moscow', 'Ukraine', 'Kremlin', 'Putin', 'Russian', 'Siberia', 'Donbas'],
  me: ['Middle East', 'Israel', 'Gaza', 'Iran', 'Tehran', 'Syria', 'Red Sea', 'Suez', 'Houthi'],
  africa: ['Africa', 'Sudan', 'Niger', 'Somalia', 'Sahel', 'Pirates', 'Congo', 'Djibouti'],
  sa: ['South America', 'Venezuela', 'Guyana', 'Brazil', 'Colombia', 'Argentina'],
  jp: ['Japan', 'Tokyo', 'Japanese', 'JSDF', 'Okinawa'],
  kr: ['Korea', 'Seoul', 'Pyongyang', 'Kim Jong Un', 'North Korea', 'DMZ'],
  au: ['Australia', 'Canberra', 'Australian', 'AUKUS', 'Pacific', 'Indo-Pacific']
}

// In-memory caching
const STORIES_CACHE = {}
const CACHE_TIMEOUTS = {}

// ─── Helpers ────────────────────────────────────────────────────────
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
    const text = `📡 SENTINEL BRIEF: ${story.headline} (via ${story.source})\n\n${story.summary}\n\nRead classification: ${story.link}`
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
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newHeart = { id: Date.now(), x, y }
    setHearts(prev => [...prev, newHeart])
    
    playSynthBeep()
    
    if (!isLiked) {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
      if (onAction) onAction('like')
    }
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id))
    }, 800)
  }

  const handleCardClick = (e) => {
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
        <p className="text-xs text-gray-400">Select defense sectors or regions to adjust Sentinel briefs.</p>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4.5 flex items-center gap-2 border-b border-white/5 pb-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Intel Sectors
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
          Tactical Theaters
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
      
      // Strip HTML (Ensures strictly no video tags make it into the brief summary)
      description = description.replace(/<[^>]*>/g, '').trim()
      description = decodeHTMLEntities(description)
      
      const link = item.querySelector('link')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      
      let source = customSource || 'Sentinel Wire'
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

  // ─── Procedural Instant Generation for Seamless Infinite Scrolling ──
  const generateInfiniteStories = useCallback((catId, count = 10) => {
    const isCountry = catId.startsWith('country-')
    let baseList = []
    
    if (isCountry) {
      const countryId = catId.replace('country-', '')
      const keywords = COUNTRY_KEYWORDS[countryId] || []
      baseList = REAL_DEFENSE_DATABASE.filter(story => {
        const textToSearch = `${story.headline} ${story.summary}`.toLowerCase()
        return keywords.some(keyword => textToSearch.includes(keyword.toLowerCase()))
      })
      if (baseList.length === 0) {
        baseList = REAL_DEFENSE_DATABASE.filter(s => s.category === 'world')
      }
    } else {
      baseList = catId === 'all' 
        ? REAL_DEFENSE_DATABASE 
        : REAL_DEFENSE_DATABASE.filter(s => s.category === catId)
      if (baseList.length === 0) {
        baseList = REAL_DEFENSE_DATABASE
      }
    }

    const infiniteList = []
    for (let i = 0; i < count; i++) {
      const randomItem = baseList[Math.floor(Math.random() * baseList.length)]
      // Randomize metadata slightly to keep it unique while keeping the authentic URL and summary
      infiniteList.push({
        ...randomItem,
        id: `procedural-${catId}-${Date.now()}-${i}-${Math.random()}`,
        timestamp: Date.now() - i * 600000 - 60000,
        time: `${i + 1}h ago`,
        likes: Math.floor(Math.random() * 600) + 100,
        comments: Math.floor(Math.random() * 80) + 12,
        shares: Math.floor(Math.random() * 25) + 3,
      })
    }
    return infiniteList
  }, [])

  // ─── Fetching Logic ────────────────────────────────────────────────
  const loadStories = useCallback(async (append = false, catId = 'all') => {
    // 1. Instantly populate the feed with our real database articles in 0ms!
    if (!append) {
      const initials = generateInfiniteStories(catId, 12)
      setAllStories(initials)
      setPage(0)
    }

    // 2. Perform background RSS fetch for live news updates
    try {
      let fetched = []
      const isCountry = catId.startsWith('country-')
      
      if (isCountry) {
        const countryId = catId.replace('country-', '')
        const keywords = COUNTRY_KEYWORDS[countryId] || []
        const feedsToFetch = [...CATEGORY_FEEDS['all'], ...CATEGORY_FEEDS['world']]
        
        const results = await Promise.all(feedsToFetch.map(async (url) => {
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
            const res = await fetch(proxyUrl)
            if (!res.ok) return []
            const data = await res.json()
            if (data && data.contents) {
              return parseXML(data.contents, 'world')
            }
          } catch (e) {}
          return []
        }))
        
        const combined = results.flat()
        fetched = combined.filter(story => {
          const textToSearch = `${story.headline} ${story.summary}`.toLowerCase()
          return keywords.some(keyword => textToSearch.includes(keyword.toLowerCase()))
        })
      } else {
        const urls = CATEGORY_FEEDS[catId] || CATEGORY_FEEDS['all']
        const results = await Promise.all(urls.map(async (url) => {
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
            const res = await fetch(proxyUrl)
            if (!res.ok) return []
            const data = await res.json()
            if (data && data.contents) {
              return parseXML(data.contents, catId)
            }
          } catch (e) {
            console.warn(`Failed to fetch feed ${url}`, e)
          }
          return []
        }))
        fetched = results.flat()
      }

      // Merge fetched live stories with existing local database stories (removing duplicate headlines)
      if (fetched.length > 0) {
        const ranked = rankStories(fetched)
        setAllStories(prev => {
          const seen = new Set()
          // Place live news in front of the swipe list queue
          const combined = [...ranked, ...prev]
          return combined.filter(s => {
            const isDup = seen.has(s.headline)
            seen.add(s.headline)
            return !isDup
          })
        })
      }
    } catch (err) {
      console.warn('Background live RSS load failed, using local database feeds.', err)
    }
  }, [parseXML, rankStories, generateInfiniteStories])

  // Background pre-fetching for instant tab navigation cache
  useEffect(() => {
    const prefetchCategories = async () => {
      const categoriesToPrefetch = CATEGORIES.map(c => c.id).filter(id => id !== selectedCategory)
      for (const catId of categoriesToPrefetch) {
        if (STORIES_CACHE[catId]) continue
        try {
          let fetched = []
          const urls = CATEGORY_FEEDS[catId] || CATEGORY_FEEDS['all']
          const results = await Promise.all(urls.map(async (url) => {
            try {
              const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
              const res = await fetch(proxyUrl)
              if (!res.ok) return []
              const data = await res.json()
              if (data && data.contents) {
                return parseXML(data.contents, catId)
              }
            } catch (e) {}
            return []
          }))
          
          fetched = results.flat()
          if (fetched.length > 0) {
            const ranked = rankStories(fetched)
            STORIES_CACHE[catId] = ranked
            CACHE_TIMEOUTS[catId] = Date.now()
          }
        } catch (e) {}
      }
    }

    const timer = setTimeout(prefetchCategories, 4000)
    return () => clearTimeout(timer)
  }, [selectedCategory, parseXML, rankStories])

  // Initial load on tab/category select
  useEffect(() => {
    loadStories(false, selectedCategory)
  }, [selectedCategory, loadStories])

  // Sync displayed stories slice based on scroll page index
  useEffect(() => {
    if (allStories.length > 0) {
      const sliceEnd = Math.min((page + 1) * 5, allStories.length)
      setDisplayedStories(allStories.slice(0, sliceEnd))
      if (!activeStoryId && allStories[0]) {
        setActiveStoryId(allStories[0].id)
      }
    } else {
      setDisplayedStories([])
    }
  }, [allStories, page, activeStoryId])

  // Infinite Scroll Trigger (Local array paging)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && allStories.length > displayedStories.length) {
          setPage(p => p + 1)
        }
      },
      { threshold: 0.1 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [allStories.length, displayedStories.length])

  // Real-time generator of more briefs to guarantee TRUE INFINITE SCROLLING for fast swiping
  useEffect(() => {
    if (page > 0 && allStories.length - displayedStories.length < 4) {
      const extras = generateInfiniteStories(selectedCategory, 12)
      setAllStories(prev => {
        const seen = new Set()
        const combined = [...prev, ...extras]
        return combined.filter(s => {
          const isDup = seen.has(s.headline)
          seen.add(s.headline)
          return !isDup
        })
      })
    }
  }, [page, allStories.length, displayedStories.length, selectedCategory, generateInfiniteStories])

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
      { threshold: 0.6 }
    )
    
    const elements = document.querySelectorAll('.reels-card-container')
    elements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [displayedStories])

  const handleRefresh = async () => {
    setRefreshing(true)
    window.speechSynthesis.cancel()
    
    delete STORIES_CACHE[selectedCategory]
    delete CACHE_TIMEOUTS[selectedCategory]
    
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
      {/* Immersive Tactical Header */}
      <header className="shrink-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 shadow-md shadow-black/30 z-30">
        <div className="max-w-md mx-auto px-4.5 py-3">
          <div className="flex items-center justify-between">
            {/* Pulsing Radar Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-slate-700 via-zinc-800 to-black rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                <svg className="w-5 h-5 text-purple-400 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="3" className="fill-current text-purple-500/40" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-slate-200 via-purple-300 to-zinc-300 bg-clip-text text-transparent tracking-tight leading-none mb-1">Sentinel Intel</h1>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Strategic Defense Feed</p>
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
                  ? 'bg-gradient-to-r from-violet-850 to-purple-950 text-white shadow-lg border border-white/15'
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
                  ? 'bg-gradient-to-r from-violet-850 to-purple-950 text-white shadow-lg border border-white/15'
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
                  <span>Sector: {selectedCategory.startsWith('country-') ? COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.label : CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
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
                {displayedStories.length > 0 && !loading && 'Synchronizing next briefs...'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Swiping Hint Footer */}
      <footer className="shrink-0 py-2.5 border-t border-white/5 bg-zinc-950/90 text-center z-15 backdrop-blur-md">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1.5 select-none">
          Swipe UP for Next Brief
          <span className="inline-block animate-bounce font-black">↑</span>
          • Double-Tap to Flag
        </p>
      </footer>
    </div>
  )
}

export default App
