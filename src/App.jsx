import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── Categories & Tags ──────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Stories', icon: '🔥', color: 'from-red-500 to-orange-500', bg: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'world', label: 'World', icon: '🌍', color: 'from-blue-600 to-cyan-500', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'politics', label: 'Politics', icon: '🏛️', color: 'from-purple-600 to-violet-500', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'business', label: 'Business', icon: '💼', color: 'from-emerald-600 to-teal-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'tech', label: 'Technology', icon: '⚡', color: 'from-indigo-600 to-blue-500', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'sports', label: 'Sports', icon: '🏆', color: 'from-orange-500 to-amber-400', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'science', label: 'Science', icon: '🔬', color: 'from-teal-600 to-green-500', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'health', label: 'Health', icon: '❤️‍🩹', color: 'from-pink-600 to-rose-500', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'from-fuchsia-600 to-purple-500', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
]

const TAGS_BY_CATEGORY = {
  world: ['Global Politics', 'Regional Conflicts', 'Diplomacy', 'International Relations', 'Humanitarian'],
  politics: ['US Politics', 'European Union', 'Parliament', 'Elections', 'Policy Reform', 'Supreme Court'],
  business: ['Markets', 'Startups', 'Real Estate', 'Cryptocurrency', 'Trade Wars', 'IPO'],
  tech: ['AI & Machine Learning', 'Cybersecurity', 'Consumer Tech', 'Space Tech', 'Quantum Computing', 'Social Media'],
  sports: ['Football', 'Cricket', 'F1 Racing', 'Olympics', 'Basketball', 'Tennis'],
  science: ['Climate Science', 'Biotech', 'Physics', 'Astronomy', 'Genetics', 'Oceanography'],
  health: ['Public Health', 'Mental Health', 'Pharma', 'WHO Updates', 'Pandemic Prep'],
  entertainment: ['Film & TV', 'Music', 'Gaming', 'Celebrity News', 'Streaming Wars'],
}

// ─── Countries / Regions ────────────────────────────────────────────
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

const NEWS_BY_COUNTRY = {
  us: {
    headlines: [
      'White House announces new economic initiative targeting middle-class families across all states',
      'Federal Reserve signals potential rate adjustment as inflation data shows mixed signals nationwide',
      'Bipartisan infrastructure bill moves forward with $1.2 trillion in proposed spending for roads, bridges and broadband',
    ],
    summaries: ['The proposal has drawn support from both parties after months of negotiations. Key provisions include modernization of transportation networks, expansion of rural broadband access, and investment in clean energy infrastructure across all 50 states.', 'Markets responded positively to the announcement, with major indices reaching new highs. Analysts say the move reflects growing confidence in economic recovery while maintaining price stability.', 'The legislation represents the largest public works investment in decades, with funding distributed across congressional districts. Construction is expected to begin within six months of passage.'],
  },
  uk: {
    headlines: [
      'Parliament debates landmark digital privacy legislation that could reshape data protection standards',
      'Bank of England maintains cautious stance on monetary policy amid post-Brexit economic adjustments',
      'London hosts international climate summit as world leaders gather to discuss carbon reduction targets',
    ],
    summaries: ['The proposed framework would give citizens greater control over their personal data and impose stricter penalties on companies that mishandle information. Tech giants are already adjusting their UK operations in anticipation.', 'Governors cited ongoing uncertainty from trade relationships and global economic conditions as key factors in the decision. The pound saw modest movement against major currencies following the announcement.', 'Delegates from over 100 nations will discuss binding commitments for emissions reduction. The UK has pledged to achieve net-zero carbon by 2045, five years ahead of its previous target.'],
  },
  eu: {
    headlines: [
      'European Commission proposes sweeping AI regulation framework that could set global standards',
      'EU energy ministers agree on emergency measures to diversify supply chains and reduce dependency',
      'European Space Agency announces ambitious Mars mission timeline with international partner contributions',
    ],
    summaries: ['The comprehensive legislation would classify AI systems by risk level and impose strict requirements on high-risk applications including facial recognition and autonomous decision-making. Companies could face fines of up to 6% of global revenue for non-compliance.', 'The agreement includes provisions for accelerated renewable energy deployment, strategic gas storage mandates, and joint purchasing agreements among member states to strengthen negotiating position with suppliers.', 'The mission aims to land a rover on Mars within the next decade, collecting soil samples that could be returned to Earth in a follow-up campaign. Several European nations are contributing specialized instruments and launch capabilities.'],
  },
  in: {
    headlines: [
      'India launches ambitious space mission to study solar corona as ISRO expands its deep space program',
      'Government unveils massive technology manufacturing incentive plan targeting semiconductor production',
      'Indian economy maintains robust growth trajectory, becoming fastest-growing major economy globally',
    ],
    summaries: ['The Chandrayaan follow-up mission will carry advanced instruments to analyze the Sun\'s outer atmosphere and its effects on space weather. ISRO officials say this positions India among the elite group of nations conducting solar research.', 'The incentive package offers substantial subsidies and tax benefits for companies building chip fabrication facilities, aiming to make India a global semiconductor hub within five years. Several multinational corporations have already expressed interest.', 'GDP growth has been driven by strong domestic consumption, digital infrastructure expansion, and a growing services sector. International financial institutions have upgraded their growth forecasts for the country.'],
  },
  cn: {
    headlines: [
      'China accelerates development of quantum computing network spanning multiple major cities',
      'Beijing announces new green energy initiative targeting carbon neutrality ahead of 2060 goal',
      'Chinese manufacturers lead global push in electric vehicle battery technology and production capacity',
    ],
    summaries: ['The interconnected quantum network represents a significant step toward practical quantum communication infrastructure. Researchers say the system could revolutionize secure communications and computational capabilities across industries.', 'The initiative includes massive investments in wind, solar, and nuclear energy alongside plans to phase out coal-fired power plants in major urban centers. International observers note China\'s leading position in renewable manufacturing.', 'Chinese battery producers have achieved breakthroughs in energy density and charging speed while reducing costs. The technology is being deployed across domestic electric vehicle fleets and exported globally.'],
  },
  ru: {
    headlines: [
      'Russia announces expansion of Arctic shipping routes as climate change opens new maritime passages',
      'Moscow unveils plans for next-generation nuclear power plants to meet growing energy demands',
      'Russian scientists contribute to international space station with new life support system technology',
    ],
    summaries: ['The Northern Sea Route has seen significantly increased commercial traffic in recent years, reducing shipping times between Europe and Asia by up to 40%. Russia is investing heavily in icebreaker fleet expansion and port infrastructure.', 'The new reactor designs promise improved safety features and waste reduction compared to previous generations. Several Central Asian nations have expressed interest in adopting the technology for their growing energy needs.', 'The life support system uses advanced recycling technology that could significantly reduce resource requirements for long-duration space missions. International partners are evaluating the technology for future lunar and Mars missions.'],
  },
  me: {
    headlines: [
      'Middle East peace talks resume with renewed international mediation efforts and confidence-building measures',
      'Gulf nations accelerate economic diversification plans beyond oil with massive technology investments',
      'Regional countries collaborate on desalination technology to address growing water scarcity challenges',
    ],
    summaries: ['The negotiations include discussions on border security, trade agreements, and humanitarian corridor access. International mediators express cautious optimism about the current round of talks.', 'Sovereign wealth funds are directing billions toward technology hubs, renewable energy projects, and tourism infrastructure as part of long-term economic transformation strategies. Several international tech companies have opened regional headquarters.', 'New desalination plants using solar-powered reverse osmosis technology are being deployed across coastal nations. The innovation significantly reduces energy costs compared to traditional methods while expanding freshwater supply.'],
  },
  africa: {
    headlines: [
      'African Continental Free Trade Area shows early success as intra-Africa commerce grows significantly',
      'East African tech hubs attract record venture capital investment in fintech and agricultural technology',
      'Continental renewable energy grid project connects multiple nations with solar and wind power infrastructure',
    ],
    summaries: ['The trade agreement has reduced tariffs on 90% of goods traded between member states, leading to measurable increases in cross-border commerce. Small and medium enterprises are particularly benefiting from expanded market access.', 'Startups across Kenya, Nigeria, and South Africa are raising unprecedented funding rounds, with mobile payment platforms and precision agriculture tools leading investor interest. The ecosystem is creating thousands of tech jobs.', 'The ambitious project links national power grids through high-voltage transmission lines powered by solar farms in the Sahara and wind installations along coastal regions. Several European development banks are providing financing.'],
  },
  sa: {
    headlines: [
      'Brazil leads Amazon conservation efforts with record funding for rainforest protection programs',
      'Argentina emerges as major player in lithium production, fueling global electric vehicle battery supply chain',
      'South American nations collaborate on massive renewable energy project spanning multiple countries',
    ],
    summaries: ['The Brazilian government has allocated unprecedented resources to satellite monitoring, indigenous land protection, and sustainable development programs. Early data shows a significant reduction in deforestation rates compared to previous years.', 'Argentina holds some of the world\'s largest lithium reserves and is rapidly expanding extraction operations. The metal is essential for electric vehicle batteries, positioning the country as a critical supplier in the clean energy transition.', 'The binational project combines hydroelectric dams along major rivers with massive solar installations in arid regions. The combined capacity will power millions of homes while reducing reliance on fossil fuel generation.'],
  },
  jp: {
    headlines: [
      'Japan advances robotics research with humanoid robots designed for elderly care and disaster response',
      'Tokyo stock exchange implements sweeping reforms to attract international investors and boost corporate governance',
      'Japanese scientists develop breakthrough battery technology promising faster charging and longer lifespan',
    ],
    summaries: ['The new generation of care robots can assist with mobility, monitor vital signs, and provide companionship for elderly patients. Japan\'s aging population has driven significant investment in automation solutions for healthcare.', 'The reforms include stricter requirements for independent board members, improved shareholder rights, and enhanced disclosure standards. Foreign investors have responded positively, with increased inflows into Japanese equities.', 'The solid-state battery prototype achieves charging times under 10 minutes while maintaining performance over thousands of charge cycles. Several major automakers are already in discussions about licensing the technology.'],
  },
  kr: {
    headlines: [
      'South Korea leads global 5G adoption with nationwide coverage and next-generation network testing underway',
      'Korean semiconductor industry announces massive investment in advanced chip manufacturing capabilities',
      'K-culture phenomenon drives record tourism as global interest in Korean entertainment and cuisine surges',
    ],
    summaries: ['The country has achieved the world\'s fastest 5G deployment with coverage reaching even rural areas. Trials for 6G technology have already begun, with researchers targeting terabit-speed communications by 2030.', 'Major chipmakers are investing billions in new fabrication facilities producing next-generation processors for AI and high-performance computing applications. The investment reinforces South Korea\'s position as a semiconductor powerhouse.', 'Korean dramas, music, and food continue to gain massive global audiences, driving tourism to record levels. Cultural exports have become a significant contributor to the national economy, with dedicated government support programs.'],
  },
  au: {
    headlines: [
      'Australia accelerates renewable energy transition with world\'s largest solar farm coming online',
      'Australian researchers make breakthrough in rare earth mineral processing critical for technology manufacturing',
      'Sydney and Melbourne lead global rankings in quality of life as urban development projects deliver results',
    ],
    summaries: ['The massive solar installation will generate enough electricity to power hundreds of thousands of homes, marking a milestone in Australia\'s transition away from coal. The project combines solar panels with battery storage for round-the-clock power delivery.', 'New processing techniques dramatically reduce the environmental impact and cost of extracting rare earth elements essential for electronics, electric vehicles, and defense applications. Several international technology companies have expressed interest in supply agreements.', 'Urban renewal projects including expanded public transit, green spaces, and affordable housing initiatives have significantly improved livability metrics. The improvements have attracted both domestic and international migration to major cities.'],
  },
}

function generateStory(id, category = null) {
  const catId = category || Object.keys(storyData)[Math.floor(Math.random() * Object.keys(storyData).length)]
  const data = storyData[catId]
  const headline = data.headlines[Math.floor(Math.random() * data.headlines.length)]
  const summary = data.summaries[Math.floor(Math.random() * data.summaries.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]

  // Pick relevant tags for this category
  const availableTags = TAGS_BY_CATEGORY[catId] || []
  const tagCount = Math.min(availableTags.length, Math.floor(Math.random() * 2) + 1)
  const shuffled = [...availableTags].sort(() => Math.random() - 0.5)
  const tags = shuffled.slice(0, tagCount)

  return {
    id: `story-${Date.now()}-${id}`,
    headline,
    summary,
    source,
    link: `https://www.${source.toLowerCase().replace(/\s+/g, '')}.com/story/${id}`,
    category: catId,
    tags,
    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }
}

function generateCountryStory(id, countryId) {
  const data = NEWS_BY_COUNTRY[countryId] || storyData.world
  const headline = data.headlines[Math.floor(Math.random() * data.headlines.length)]
  const summary = data.summaries[Math.floor(Math.random() * data.summaries.length)]
  const source = sources[Math.floor(Math.random() * sources.length)]

  return {
    id: `story-${Date.now()}-${id}`,
    headline,
    summary,
    source,
    link: `https://www.${source.toLowerCase().replace(/\s+/g, '')}.com/story/${id}`,
    category: 'world',
    tags: [countryId.toUpperCase()],
    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }
}

const sources = ['Reuters', 'AP News', 'BBC News', 'Al Jazeera', 'CNN', 'The Guardian']

// ─── Story Generation with Category Tags ────────────────────────────
const storyData = {
  world: {
    headlines: [
      'UN Security Council convenes emergency session as regional tensions escalate across multiple fronts',
      'Historic peace accord signed between long-standing rivals, ending decades of territorial dispute',
      'Massive humanitarian corridor established as millions face displacement from ongoing crisis',
      'G20 nations pledge unprecedented cooperation on global security challenges and trade stability',
      'International coalition launches joint military exercise in response to growing regional threat',
      'Refugee crisis deepens as border closures force hundreds of thousands into dangerous crossings',
      'Diplomatic breakthrough: Former adversaries agree to restore full bilateral relations',
      'Global summit produces landmark agreement on cross-border water sharing and resource management',
    ],
    summaries: [
      'World leaders gathered in Geneva for emergency talks, producing a framework for de-escalation that includes mutual troop withdrawals and the establishment of demilitarized zones. The agreement, brokered by neutral parties, marks the first diplomatic breakthrough in years.',
      'The accord, reached after 18 months of secret negotiations, includes provisions for border security cooperation, joint economic development zones, and a framework for resolving future disputes through arbitration rather than force.',
      'International aid organizations have mobilized rapidly to establish supply routes and temporary shelters. The UN has called for $2 billion in emergency funding while coordinating with local governments on long-term resettlement plans.',
    ],
  },
  politics: {
    headlines: [
      'Landmark legislation passes Senate in historic bipartisan vote, reshaping domestic policy landscape',
      'Supreme Court to hear arguments on executive authority that could redefine separation of powers',
      'Major party announces sweeping reform platform ahead of midterm elections, focusing on governance',
      'New polling reveals shifting voter priorities as economy and healthcare top concerns nationwide',
      'Congressional committee releases damning report on government oversight failures across multiple agencies',
      'Governor signs executive order expanding voting access in response to federal court ruling',
    ],
    summaries: [
      'The legislation, which passed with support from both parties, allocates significant funding for infrastructure modernization and includes provisions for regulatory reform. Supporters say it represents a rare moment of genuine bipartisan cooperation.',
      'Legal experts describe the case as one of the most consequential in decades, potentially affecting presidential powers across multiple domains including emergency response, foreign policy, and domestic regulation.',
      'The platform outlines ambitious proposals for campaign finance reform, government transparency measures, and electoral modernization. Analysts say it could set the agenda for the next congressional session.',
    ],
  },
  business: {
    headlines: [
      'Global markets surge as central banks signal coordinated approach to economic stabilization',
      'Tech giant announces $10 billion investment in manufacturing, creating thousands of domestic jobs',
      'Cryptocurrency regulation framework takes shape as regulators propose comprehensive oversight rules',
      'Housing market shows signs of cooling as interest rate hikes begin to impact buyer demand',
      'Major merger deal valued at $50 billion reshapes competitive landscape across entire industry sector',
      'Small business confidence reaches new high as consumer spending patterns show robust recovery',
    ],
    summaries: [
      'The coordinated policy response from major central banks has calmed investor concerns, with the S&P 500 reaching record highs. Analysts note that the synchronized approach signals growing recognition of interconnected global economic challenges.',
      'The investment will fund construction of new semiconductor fabrication plants and includes commitments to domestic supply chain development. The project is expected to create an estimated 8,000 direct jobs over the next three years.',
      'The proposed rules would establish licensing requirements for digital asset platforms, mandate consumer protection standards, and create reporting frameworks similar to traditional financial institutions.',
    ],
  },
  tech: {
    headlines: [
      'Revolutionary AI system demonstrates unprecedented reasoning capabilities in independent benchmark tests',
      'Major cybersecurity breach exposes millions of records, prompting industry-wide security overhaul',
      'Quantum computing milestone achieved as researchers demonstrate error-corrected operations at scale',
      'New open-source framework threatens to disrupt dominant cloud computing ecosystem entirely',
      'Breakthrough in battery technology promises to double electric vehicle range while cutting charging time',
      'Social media platform launches radical new approach to content moderation using decentralized governance',
    ],
    summaries: [
      'The system, developed by an independent research lab, outperformed all existing models across multiple reasoning benchmarks including mathematical problem-solving and logical deduction. Industry experts say it represents a significant leap forward in artificial intelligence capabilities.',
      'Security researchers discovered the breach affecting one of the largest data aggregators, with personal information from over 200 million users potentially exposed. The incident has triggered calls for stricter data protection regulations across the industry.',
      'The achievement, published in a peer-reviewed journal, demonstrates that practical quantum advantage may be closer than previously estimated. Several major tech companies have already announced plans to build on this research foundation.',
    ],
  },
  sports: {
    headlines: [
      'Underdog team stuns favorites in dramatic championship upset, securing first title in franchise history',
      'Star athlete announces surprise retirement after record-breaking career spanning two decades',
      'Host city revealed for 2036 Olympic Games, marking first time event held in region',
      'Major league announces sweeping format changes aimed at improving competition and viewer engagement',
      'Rising star breaks century-old world record, setting new standard in athletic performance',
      'International federation votes to add exciting new sport to upcoming Olympic program',
    ],
    summaries: [
      'In what many are calling the greatest upset in sporting history, the underdog team overcame a 20-point deficit in the final quarter to claim victory. The emotional celebration marked the culmination of years of rebuilding and perseverance.',
      'The athlete, widely regarded as one of the greatest in the sport\'s history, announced the decision via an emotional video message thanking fans and teammates. Career statistics include multiple championship titles and numerous records.',
      'The selection represents a historic moment for the region, with organizers promising sustainable venues and a legacy that will benefit communities long after the games conclude. Construction is expected to begin within two years.',
    ],
  },
  science: {
    headlines: [
      'Deep space telescope captures unprecedented images of earliest galaxies formed after Big Bang',
      'Gene therapy breakthrough offers hope for millions suffering from previously incurable genetic disorders',
      'Ocean researchers discover vast new ecosystem in deep sea, rewriting understanding of marine biodiversity',
      'Fusion energy experiment produces net positive output for record-breaking sustained period',
      'Archaeological dig uncovers ancient city that could rewrite human history timeline entirely',
      'New study reveals alarming acceleration in polar ice sheet melting, exceeding all previous models',
    ],
    summaries: [
      'The images reveal galaxies formed just 200 million years after the Big Bang, far earlier than previously thought possible. The findings challenge existing theories about galaxy formation and suggest the early universe was more dynamic than scientists believed.',
      'The therapy, which uses modified viral vectors to deliver corrected genes directly to affected cells, has shown remarkable results in clinical trials with near-complete symptom reversal in participating patients.',
      'The ecosystem, located at depths exceeding 4,000 meters, contains hundreds of previously unknown species adapted to extreme pressure and darkness. The discovery highlights how little we know about Earth\'s own oceans.',
    ],
  },
  health: {
    headlines: [
      'WHO declares end of global health emergency as pandemic measures are systematically rolled back',
      'Revolutionary cancer treatment shows 95% remission rate in groundbreaking clinical trial results',
      'Mental health crisis deepens among young adults as demand for services outpaces available resources',
      'New vaccine technology platform could enable rapid response to future pandemic threats within weeks',
      'Study links common environmental pollutant to increased risk of neurodegenerative diseases',
      'Telemedicine adoption reaches new heights as patients and providers embrace digital healthcare delivery',
    ],
    summaries: [
      'The declaration follows a steady decline in cases worldwide and the successful rollout of vaccination programs across all regions. Health officials emphasize continued vigilance while transitioning to routine disease management.',
      'The treatment, which harnesses the body\'s own immune system to target cancer cells with unprecedented precision, has shown remarkable results across multiple cancer types including some considered untreatable just years ago.',
      'Healthcare systems worldwide are struggling to meet surging demand for mental health services. Experts call for increased funding, workforce expansion, and integration of mental health care into primary healthcare settings.',
    ],
  },
  entertainment: {
    headlines: [
      'Blockbuster film shatters opening weekend records with $500 million global box office haul',
      'Streaming wars intensify as major platform announces ambitious slate of original content investments',
      'Legendary musician announces surprise world tour dates spanning 40 cities across six continents',
      'Video game adaptation earns critical acclaim, setting new standard for entertainment adaptations',
      'Award season predictions take unexpected turn as indie films dominate early nominations and buzz',
      'Music industry sees record-breaking year as streaming revenues surpass $50 billion globally',
    ],
    summaries: [
      'The film has exceeded all industry projections, driven by word-of-mouth acclaim and strong audience scores. Critics have praised its innovative storytelling approach and groundbreaking visual effects that push the boundaries of modern filmmaking.',
      'The platform unveiled a lineup featuring over 200 new original productions across all genres, representing the largest content investment in entertainment history. Industry analysts say this signals an intensifying battle for subscriber growth.',
      'Tickets sold out within minutes of going on sale, with fans camping outside venues worldwide. The tour will feature a completely reimagined stage production incorporating cutting-edge technology and visual effects never before seen live.',
    ],
  },
}

// ─── Share Component ────────────────────────────────────────────────
function ShareButton({ headline, summary }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `${headline}\n\n${summary}`
    if (navigator.share) {
      try { await navigator.share({ title: headline, text }) } catch {}
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

// ─── Impact Gradients (each category gets a unique dark gradient) ──
const IMPACT_GRADIENTS = {
  world: 'from-slate-900 via-blue-950 to-indigo-950',
  politics: 'from-red-950 via-rose-950 to-pink-950',
  business: 'from-emerald-950 via-teal-950 to-cyan-950',
  tech: 'from-violet-950 via-purple-950 to-fuchsia-950',
  sports: 'from-orange-950 via-amber-950 to-yellow-950',
  science: 'from-teal-950 via-green-950 to-lime-950',
  health: 'from-pink-950 via-rose-950 to-red-950',
  entertainment: 'from-fuchsia-950 via-purple-950 to-indigo-950',
}

const IMPACT_ACCENT = {
  world: 'text-blue-300 border-blue-400/30 bg-blue-400/10',
  politics: 'text-red-300 border-red-400/30 bg-red-400/10',
  business: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  tech: 'text-violet-300 border-violet-400/30 bg-violet-400/10',
  sports: 'text-orange-300 border-orange-400/30 bg-orange-400/10',
  science: 'text-teal-300 border-teal-400/30 bg-teal-400/10',
  health: 'text-pink-300 border-pink-400/30 bg-pink-400/10',
  entertainment: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
}

// ─── News Card (Dark Impact Theme) ──────────────────────────────────
function NewsCard({ story }) {
  const catInfo = CATEGORIES.find(c => c.id === story.category) || CATEGORIES[0]
  const gradient = IMPACT_GRADIENTS[story.category] || 'from-gray-900 to-slate-900'
  const accent = IMPACT_ACCENT[story.category] || ''

  return (
    <article className={`relative bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-white/10`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl drop-shadow-lg">{catInfo.icon}</span>
            <div className="h-5 w-px bg-white/20" />
            <span className="font-bold text-sm text-white/90 tracking-wide">{story.source}</span>
          </div>
          <ShareButton headline={story.headline} summary={story.summary} />
        </div>

        {/* Headline */}
        <h2 className="text-xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg group-hover:text-white/95 transition-colors">{story.headline}</h2>

        {/* Summary */}
        <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">{story.summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {story.tags.map(tag => (
            <span key={tag} className={`text-[11px] px-3 py-1 rounded-full border font-medium backdrop-blur-sm ${accent}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <a href={story.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-colors group/link bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
            <span>Read full story</span>
            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <span className="text-xs text-white/40 font-medium">{story.time}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Skeleton Card (Dark) ──────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-gray-950 rounded-2xl overflow-hidden shadow-lg animate-pulse border border-white/10">
      <div className="absolute inset-0 opacity-20"><div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" /></div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 bg-white/10 rounded-lg" /><div className="h-5 w-px bg-white/20" /><div className="h-4 w-20 bg-white/10 rounded" /></div>
        <div className="h-6 w-full bg-white/10 rounded mb-3" />
        <div className="h-6 w-3/4 bg-white/10 rounded mb-4" />
        <div className="space-y-2 mb-5"><div className="h-3 w-full bg-white/5 rounded" /><div className="h-3 w-5/6 bg-white/5 rounded" /></div>
        <div className="flex gap-2"><div className="h-6 w-16 bg-white/10 rounded-full" /><div className="h-6 w-20 bg-white/10 rounded-full" /></div>
      </div>
    </div>
  )
}

// ─── Explore Page (Dark Theme) ──────────────────────────────────────
function ExplorePage({ onSelectCategory, selectedCategory }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-2">Explore Topics</h1>
        <p className="text-gray-400">Tap a category or country to filter your feed — stories refresh instantly</p>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
          Topics
        </h3>
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

        {/* Tags Section */}
        {selectedCategory !== 'all' && (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm mb-8">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span>{CATEGORIES.find(c => c.id === selectedCategory)?.icon}</span>
              {CATEGORIES.find(c => c.id === selectedCategory)?.label} Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {(TAGS_BY_CATEGORY[selectedCategory] || []).map(tag => (
                <span key={tag} className={`text-xs px-4 py-2 rounded-full font-medium ${CATEGORIES.find(c => c.id === selectedCategory)?.bg}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Countries Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Countries & Regions
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {COUNTRIES.map(country => (
            <button
              key={country.id}
              onClick={() => onSelectCategory(`country-${country.id}`)}
              className={`relative p-3 rounded-xl border transition-all duration-300 text-center group ${
                selectedCategory === `country-${country.id}`
                  ? 'border-transparent bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg scale-[1.05] ring-2 ring-white/20'
                  : 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/60 hover:border-gray-600'
              }`}
            >
              <span className="text-2xl block mb-1">{country.flag}</span>
              <span className={`font-bold text-[10px] ${selectedCategory === `country-${country.id}` ? 'text-white' : 'text-gray-300'}`}>{country.label}</span>
              {selectedCategory === `country-${country.id}` && (
                <div className="absolute top-1 right-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Country Tags */}
        {selectedCategory.startsWith('country-') && (
          <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm mt-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span>{COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.flag}</span>
              {COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.label} News
            </h3>
            <p className="text-sm text-gray-400">Stories from {COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.label} covering politics, business, technology, and more.</p>
          </div>
        )}
      </div>

      {/* Selected indicator */}
      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <p className="text-sm text-purple-300 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {selectedCategory === 'all' ? 'Showing all stories across every topic and region.' : selectedCategory.startsWith('country-') ? `Filtering to ${COUNTRIES.find(c => c.id === selectedCategory.replace('country-', ''))?.label} stories. Scroll down for regional content.` : `Filtering to ${CATEGORIES.find(c => c.id === selectedCategory)?.label} stories. Scroll down for personalized content.`}
        </p>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'explore'
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const observerTarget = useRef(null)
  const storyIdRef = useRef(100)

  // Load stories on mount or category change
  useEffect(() => {
    loadStories(false)
  }, [])

  const loadStories = useCallback((append = false, filter = null) => {
    setLoading(true)
    setTimeout(() => {
      const newStories = []
      for (let i = 0; i < 5; i++) {
        storyIdRef.current += 1
        if (filter && filter.startsWith('country-')) {
          newStories.push(generateCountryStory(storyIdRef.current, filter.replace('country-', '')))
        } else {
          newStories.push(generateStory(storyIdRef.current, filter))
        }
      }
      setStories(prev => append ? [...prev, ...newStories] : newStories)
      setLoading(false)
    }, 400)
  }, [])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !loading) setPage(p => p + 1) },
      { threshold: 0.5 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loading])

  useEffect(() => { if (page > 0) loadStories(true, selectedCategory === 'all' ? null : selectedCategory) }, [page, loadStories, selectedCategory])

  const handleRefresh = () => {
    setRefreshing(true)
    storyIdRef.current += 100
    setPage(0)
    loadStories(false, selectedCategory === 'all' ? null : selectedCategory)
    setTimeout(() => setRefreshing(false), 600)
  }

  const handleExploreSelect = (catId) => {
    setSelectedCategory(catId)
    setActiveTab('feed')
    setPage(0)
    storyIdRef.current += 50
    loadStories(false, catId === 'all' ? null : catId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">NewsPulse</h1>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Your World, In Brief</p>
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
            <button onClick={() => { setActiveTab('feed'); setPage(0); loadStories(false, selectedCategory === 'all' ? null : selectedCategory) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? 'bg-white/10 text-purple-400 shadow-sm border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>
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
      {activeTab === 'explore' ? (
        <ExplorePage onSelectCategory={handleExploreSelect} selectedCategory={selectedCategory} />
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Active filter badge */}
          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${CATEGORIES.find(c => c.id === selectedCategory)?.bg}`}>
                {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {CATEGORIES.find(c => c.id === selectedCategory)?.label}
              </span>
              <button onClick={() => handleExploreSelect('all')} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear filter</button>
            </div>
          )}

          {stories.map(story => <NewsCard key={story.id} story={story} />)}
          {loading && <><SkeletonCard /><SkeletonCard /></>}
          <div ref={observerTarget} className="h-10" />
          {!loading && stories.length > 0 && <p className="text-center text-xs text-gray-600 py-8">Scroll for more • Auto-updates</p>}
        </main>
      )}

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 text-center border-t border-white/5 mt-8">
        <p className="text-xs text-gray-600">NewsPulse • Curated from trusted sources worldwide</p>
      </footer>
    </div>
  )
}

export default App
