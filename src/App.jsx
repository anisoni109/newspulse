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

const SOURCE_SEARCH_URLS = {
  'Associated Press': (q) => `https://apnews.com/search?q=${encodeURIComponent(q)}`,
  'Reuters US': (q) => `https://www.reuters.com/site-search/?query=${encodeURIComponent(q)}`,
  'The New York Times': (q) => `https://www.nytimes.com/search?query=${encodeURIComponent(q)}`,
  'The Washington Post': (q) => `https://www.washingtonpost.com/sitemaps/query?query=${encodeURIComponent(q)}`,
  'USA Today': (q) => `https://www.usatoday.com/search/results/?q=${encodeURIComponent(q)}`,
  'Wall Street Journal': (q) => `https://www.wsj.com/articles/${encodeURIComponent(q).toLowerCase().replace(/\s+/g, '-')}`,
  'CNN': (q) => `https://www.cnn.com/search?q=${encodeURIComponent(q)}`,
  'Fox News': (q) => `https://www.foxnews.com/search-results/search/#q=${encodeURIComponent(q)}`,
  'NBC News': (q) => `https://www.nbcnews.com/search?query=${encodeURIComponent(q)}`,
  'ABC News': (q) => `https://abcnews.go.com/search?q=${encodeURIComponent(q)}`,
  'CBS News': (q) => `https://www.cbsnews.com/search/?q=${encodeURIComponent(q)}`,
  'NPR': (q) => `https://www.npr.org/search/?query=${encodeURIComponent(q)}`,
  'Bloomberg': (q) => `https://www.bloomberg.com/search?query=${encodeURIComponent(q)}`,
  'CNBC': (q) => `https://www.cnbc.com/search/?query=${encodeURIComponent(q)}`,
  'The Hill': (q) => `https://thehill.com/search/?q=${encodeURIComponent(q)}`,
  'Politico': (q) => `https://www.politico.com/search?q=${encodeURIComponent(q)}`,
  'Forbes': (q) => `https://www.forbes.com/search/?q=${encodeURIComponent(q)}`,
  'Business Insider': (q) => `https://www.businessinsider.com/search?q=${encodeURIComponent(q)}`,
  'The Verge': (q) => `https://www.theverge.com/search?q=${encodeURIComponent(q)}`,
  'Wired': (q) => `https://www.wired.com/search/?query=${encodeURIComponent(q)}`,
  'Time Magazine': (q) => `https://time.com/search/?q=${encodeURIComponent(q)}`,
  'Newsweek': (q) => `https://www.newsweek.com/search?q=${encodeURIComponent(q)}`,
  'BBC News': (q) => `https://www.bbc.com/news/search?q=${encodeURIComponent(q)}`,
  'The Guardian UK': (q) => `https://www.theguardian.com/uk-news?q=${encodeURIComponent(q)}`,
  'Sky News': (q) => `https://news.sky.com/search/?query=${encodeURIComponent(q)}`,
  'Euronews': (q) => `https://www.euronews.com/search?q=${encodeURIComponent(q)}`,
  'The Times of India': (q) => `https://timesofindia.indiatimes.com/articleshow/${encodeURIComponent(q).toLowerCase().replace(/\s+/g, '-').substring(0, 50)}.cms`,
  'The Hindu': (q) => `https://www.thehindu.com/search?q=${encodeURIComponent(q)}`,
  'NDTV': (q) => `https://ndtv.com/search?keyword=${encodeURIComponent(q)}`,
  'South China Morning Post': (q) => `https://www.scmp.com/search?q=${encodeURIComponent(q)}`,
  'Al Jazeera': (q) => `https://www.aljazeera.com/search/?query=${encodeURIComponent(q)}`,
  'NHK World': (q) => `https://www3.nhk.or.jp/nhkworld/en/search/?q=${encodeURIComponent(q)}`,
  'Japan Times': (q) => `https://www.japantimes.co.jp/search/?q=${encodeURIComponent(q)}`,
  'ABC News (Australia)': (q) => `https://www.abc.net.au/news/search?q=${encodeURIComponent(q)}`,
}

function getSourceSearchUrl(source, headline) {
  const searchFn = SOURCE_SEARCH_URLS[source]
  if (searchFn) return searchFn(headline)
  // Fallback: try to extract base domain and construct a reasonable URL
  return `https://www.google.com/search?q=${encodeURIComponent(headline + ' site:' + source.toLowerCase().replace(/\s+/g, ''))}`
}

function generateStory(id, category = null) {
  const catId = category || Object.keys(storyData)[Math.floor(Math.random() * Object.keys(storyData).length)]
  const data = storyData[catId]
  // Pick a random index and use the SAME index for headline + summary (paired)
  const idx = Math.floor(Math.random() * data.length)
  const entry = data[idx]

  // Pick a random global source with real URL
  const sourceObj = GLOBAL_SOURCES[Math.floor(Math.random() * GLOBAL_SOURCES.length)]

  // Pick relevant tags for this category
  const availableTags = TAGS_BY_CATEGORY[catId] || []
  const tagCount = Math.min(availableTags.length, Math.floor(Math.random() * 2) + 1)
  const shuffled = [...availableTags].sort(() => Math.random() - 0.5)
  const tags = shuffled.slice(0, tagCount)

  return {
    id: `story-${Date.now()}-${id}`,
    headline: entry.headline,
    summary: entry.summary,
    source: sourceObj.name,
    link: getSourceSearchUrl(sourceObj.name, entry.headline),
    category: catId,
    tags,
    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }
}

function generateCountryStory(id, countryId) {
  const data = NEWS_BY_COUNTRY[countryId] || storyData.world
  // Pick a random index and use the SAME index for headline + summary (paired)
  const idx = Math.floor(Math.random() * data.headlines.length)
  const headline = data.headlines[idx]
  const summary = data.summaries[idx]

  // Pick a random source specific to this country/region
  const countrySources = SOURCES_BY_COUNTRY[countryId] || GLOBAL_SOURCES
  const sourceObj = countrySources[Math.floor(Math.random() * countrySources.length)]

  return {
    id: `story-${Date.now()}-${id}`,
    headline,
    summary,
    source: sourceObj.name,
    link: getSourceSearchUrl(sourceObj.name, headline),
    category: 'world',
    tags: [countryId.toUpperCase()],
    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }
}

// ─── 100+ Real Accredited News Sources Per Country/Region ──────────
const SOURCES_BY_COUNTRY = {
  us: [
    { name: 'Associated Press', url: 'https://apnews.com' },
    { name: 'Reuters US', url: 'https://www.reuters.com/us/' },
    { name: 'The New York Times', url: 'https://www.nytimes.com' },
    { name: 'The Washington Post', url: 'https://www.washingtonpost.com' },
    { name: 'USA Today', url: 'https://www.usatoday.com' },
    { name: 'Wall Street Journal', url: 'https://www.wsj.com' },
    { name: 'CNN', url: 'https://www.cnn.com' },
    { name: 'Fox News', url: 'https://www.foxnews.com' },
    { name: 'NBC News', url: 'https://www.nbcnews.com' },
    { name: 'ABC News', url: 'https://abcnews.go.com' },
    { name: 'CBS News', url: 'https://www.cbsnews.com' },
    { name: 'NPR', url: 'https://www.npr.org' },
    { name: 'Bloomberg', url: 'https://www.bloomberg.com' },
    { name: 'CNBC', url: 'https://www.cnbc.com' },
    { name: 'The Hill', url: 'https://thehill.com' },
    { name: 'Politico', url: 'https://www.politico.com' },
    { name: 'The Atlantic', url: 'https://www.theatlantic.com' },
    { name: 'New York Magazine', url: 'https://nymag.com' },
    { name: 'Los Angeles Times', url: 'https://www.latimes.com' },
    { name: 'Chicago Tribune', url: 'https://www.chicagotribune.com' },
    { name: 'The Guardian US', url: 'https://www.theguardian.com/us-news' },
    { name: 'Forbes', url: 'https://www.forbes.com' },
    { name: 'Business Insider', url: 'https://www.businessinsider.com' },
    { name: 'The Verge', url: 'https://www.theverge.com' },
    { name: 'Wired', url: 'https://www.wired.com' },
    { name: 'Time Magazine', url: 'https://time.com' },
    { name: 'Newsweek', url: 'https://www.newsweek.com' },
    { name: 'U.S. News & World Report', url: 'https://www.usnews.com' },
    { name: 'National Geographic', url: 'https://www.nationalgeographic.com' },
    { name: 'Scientific American', url: 'https://www.scientificamerican.com' },
  ],
  uk: [
    { name: 'BBC News', url: 'https://www.bbc.com/news' },
    { name: 'The Guardian UK', url: 'https://www.theguardian.com/uk-news' },
    { name: 'The Times', url: 'https://www.thetimes.com' },
    { name: 'The Daily Telegraph', url: 'https://www.telegraph.co.uk' },
    { name: 'The Independent', url: 'https://www.independent.co.uk' },
    { name: 'The Financial Times', url: 'https://www.ft.com' },
    { name: 'The Evening Standard', url: 'https://www.standard.co.uk' },
    { name: 'The Metro', url: 'https://metro.co.uk' },
    { name: 'The Sun', url: 'https://www.thesun.co.uk' },
    { name: 'Daily Mail', url: 'https://www.dailymail.co.uk' },
    { name: 'The Express', url: 'https://www.express.co.uk' },
    { name: 'Sky News', url: 'https://news.sky.com' },
    { name: 'ITV News', url: 'https://www.itv.com/news' },
    { name: 'Channel 4 News', url: 'https://www.channel4.com/news' },
    { name: 'The Scotsman', url: 'https://www.scotsman.com' },
    { name: 'The Herald (Glasgow)', url: 'https://www.heraldscotland.com' },
    { name: 'Wales Online', url: 'https://www.walesonline.co.uk' },
    { name: 'Belfast Telegraph', url: 'https://www.belfasttelegraph.co.uk' },
    { name: 'The Spectator', url: 'https://www.spectator.co.uk' },
    { name: 'New Statesman', url: 'https://www.newstatesman.com' },
  ],
  eu: [
    { name: 'Euronews', url: 'https://www.euronews.com' },
    { name: 'Politico Europe', url: 'https://www.politico.eu' },
    { name: 'Der Spiegel (Germany)', url: 'https://www.spiegel.de' },
    { name: 'Frankfurter Allgemeine (Germany)', url: 'https://www.faz.net' },
    { name: 'Le Monde (France)', url: 'https://www.lemonde.fr' },
    { name: 'Die Zeit (Germany)', url: 'https://www.zeit.de' },
    { name: 'El País (Spain)', url: 'https://elpais.com' },
    { name: 'Corriere della Sera (Italy)', url: 'https://www.corriere.it' },
    { name: 'De Standaard (Belgium)', url: 'https://www.standaard.be' },
    { name: 'NRC Handelsblad (Netherlands)', url: 'https://www.nrc.nl' },
    { name: 'Svenska Dagbladet (Sweden)', url: 'https://www.svd.se' },
    { name: 'Aftenposten (Norway)', url: 'https://www.aftenposten.no' },
    { name: 'Helsingin Sanomat (Finland)', url: 'https://www.hs.fi' },
    { name: 'Osterreichische Zeitung (Austria)', url: 'https://www.derstandard.at' },
    { name: 'Rzeczpospolita (Poland)', url: 'https://www.rp.pl' },
  ],
  in: [
    { name: 'The Times of India', url: 'https://timesofindia.indiatimes.com' },
    { name: 'The Hindu', url: 'https://www.thehindu.com' },
    { name: 'NDTV', url: 'https://www.ndtv.com' },
    { name: 'The Indian Express', url: 'https://indianexpress.com' },
    { name: 'Hindustan Times', url: 'https://www.hindustantimes.com' },
    { name: 'India Today', url: 'https://www.indiatoday.in' },
    { name: 'The Economic Times', url: 'https://economictimes.indiatimes.com' },
    { name: 'Mint', url: 'https://www.livemint.com' },
    { name: 'The Wire', url: 'https://thewire.in' },
    { name: 'Scroll.in', url: 'https://scroll.in' },
    { name: 'Newslaundry', url: 'https://www.newslaundry.com' },
    { name: 'Firstpost', url: 'https://www.firstpost.com' },
    { name: 'The Quint', url: 'https://www.thequint.com' },
    { name: 'BBC News India', url: 'https://www.bbc.com/news/world/south_asia/india' },
    { name: 'Reuters India', url: 'https://www.reuters.com/world/asia-pacific/india/' },
    { name: 'The Print', url: 'https://theprint.in' },
    { name: 'Business Standard', url: 'https://www.business-standard.com' },
    { name: 'Financial Express', url: 'https://www.financialexpress.com' },
  ],
  cn: [
    { name: 'Xinhua News', url: 'http://www.xinhuanet.com/english' },
    { name: 'China Daily', url: 'https://www.chinadaily.com.cn' },
    { name: 'Global Times', url: 'https://www.globaltimes.cn' },
    { name: 'South China Morning Post', url: 'https://www.scmp.com' },
    { name: 'Caixin Global', url: 'https://www.caixinglobal.com' },
    { name: 'Sixth Tone', url: 'https://www.sixthtone.com' },
    { name: 'Shanghai Daily', url: 'http://www.shanghaidaily.com' },
    { name: 'Beijing Review', url: 'http://www.beijingreview.com.cn' },
  ],
  ru: [
    { name: 'TASS', url: 'https://tass.com' },
    { name: 'RIA Novosti', url: 'https://ria.ru' },
    { name: 'Interfax', url: 'https://www.interfax.ru/english' },
    { name: 'Moscow Times', url: 'https://www.themoscowtimes.com' },
    { name: 'Kommersant', url: 'https://www.kommersant.com' },
    { name: 'Novaya Gazeta', url: 'https://www.novayagazeta.ru/english' },
  ],
  me: [
    { name: 'Al Jazeera (Qatar)', url: 'https://www.aljazeera.com' },
    { name: 'Arab News (Saudi Arabia)', url: 'https://www.arabnews.com' },
    { name: 'The Daily Star (Lebanon)', url: 'https://www.dailystar.com.lb' },
    { name: 'Haaretz (Israel)', url: 'https://www.haaretz.com' },
    { name: 'Jerusalem Post', url: 'https://www.jpost.com' },
    { name: 'Egypt Today', url: 'https://www.egypttoday.com' },
    { name: 'Middle East Eye', url: 'https://www.middleeasteye.net' },
    { name: 'Gulf News (UAE)', url: 'https://gulfnews.com' },
    { name: 'The National (UAE)', url: 'https://www.thenationalnews.com' },
    { name: 'Kuwait Times', url: 'https://www.kuwaittimes.com' },
  ],
  africa: [
    { name: 'Al Jazeera Africa', url: 'https://www.aljazeera.com/africa/' },
    { name: 'BBC News Africa', url: 'https://www.bbc.com/news/world/africa' },
    { name: 'Reuters Africa', url: 'https://www.reuters.com/world/africa/' },
    { name: 'The Citizen (Tanzania)', url: 'https://www.thecitizen.co.tz' },
    { name: 'Daily Nation (Kenya)', url: 'https://www.nation.africa' },
    { name: 'The Star (Kenya)', url: 'https://www.the-star.co.ke' },
    { name: 'Punch Newspapers (Nigeria)', url: 'https://punchng.com' },
    { name: 'Vanguard (Nigeria)', url: 'https://www.vanguardngr.com' },
    { name: 'Daily Trust (Nigeria)', url: 'https://dailytrust.com' },
    { name: 'Mail & Guardian (South Africa)', url: 'https://mg.co.za' },
    { name: 'IOL (South Africa)', url: 'https://www.iol.co.za' },
    { name: 'News24 (South Africa)', url: 'https://www.news24.com' },
    { name: 'The Monitor (Uganda)', url: 'https://www.monitor.co.ug' },
    { name: 'GhanaWeb', url: 'https://www.ghanaweb.com' },
    { name: 'Daily Graphic (Ghana)', url: 'https://www.graphic.com.gh' },
    { name: 'The Namibian', url: 'https://www.namibian.com.na' },
    { name: 'The Zimbabwean', url: 'https://www.thezimbabwean.co.zw' },
  ],
  sa: [
    { name: 'O Globo (Brazil)', url: 'https://oglobo.globo.com' },
    { name: 'Folha de S.Paulo (Brazil)', url: 'https://www.folha.uol.com.br' },
    { name: 'Estadão (Brazil)', url: 'https://www.estadao.com.br' },
    { name: 'El País Brasil', url: 'https://brasil.elpais.com' },
    { name: 'Clarín (Argentina)', url: 'https://www.clarin.com' },
    { name: 'La Nación (Argentina)', url: 'https://www.lanacion.com.ar' },
    { name: 'El Tiempo (Colombia)', url: 'https://www.eltiempo.com' },
    { name: 'El Espectador (Colombia)', url: 'https://www.elespectador.com' },
    { name: 'La República (Peru)', url: 'https://larepublica.pe' },
    { name: 'El Comercio (Peru)', url: 'https://elcomercio.pe' },
    { name: 'Tal Cual (Venezuela)', url: 'https://www.talcualdigital.com' },
    { name: 'Reuters Latin America', url: 'https://www.reuters.com/world/latin-america/' },
  ],
  jp: [
    { name: 'NHK World', url: 'https://www3.nhk.or.jp/nhkworld/' },
    { name: 'Japan Times', url: 'https://www.japantimes.co.jp' },
    { name: 'Asahi Shimbun', url: 'https://www.asahi.com/ajw/' },
    { name: 'Yomiuri Shimbun', url: 'https://www.yomiuri.co.jp' },
    { name: 'Mainichi Shimbun', url: 'https://mainichi.jp/english' },
    { name: 'Nikkei Asia', url: 'https://asia.nikkei.com' },
    { name: 'The Japan News', url: 'https://the-japan-news.com' },
  ],
  kr: [
    { name: 'Yonhap News (Korea)', url: 'https://en.yna.co.kr' },
    { name: 'Korea Herald', url: 'https://www.koreaherald.com' },
    { name: 'Korea Times', url: 'https://www.koreatimes.co.kr' },
    { name: 'Chosun Ilbo (English)', url: 'http://english.chosun.com' },
    { name: 'JoongAng Ilbo', url: 'http://korean.yonhapnews.co.kr' },
    { name: 'Hankyoreh', url: 'https://www.hani.co.kr/arti/english' },
  ],
  au: [
    { name: 'ABC News (Australia)', url: 'https://www.abc.net.au/news' },
    { name: 'The Sydney Morning Herald', url: 'https://www.smh.com.au' },
    { name: 'The Age (Melbourne)', url: 'https://www.theage.com.au' },
    { name: 'The Australian', url: 'https://www.theaustralian.com.au' },
    { name: 'The Guardian Australia', url: 'https://www.theguardian.com/australia-news' },
    { name: 'SBS News', url: 'https://www.sbs.com.au/news' },
    { name: '9News', url: 'https://www.9news.com.au' },
    { name: '7News', url: 'https://7news.com.au' },
    { name: 'The Conversation Australia', url: 'https://theconversation.com/australia' },
  ],
}

// Global sources for non-country-specific stories
const GLOBAL_SOURCES = [
  ...SOURCES_BY_COUNTRY.us,
  ...SOURCES_BY_COUNTRY.uk,
  ...SOURCES_BY_COUNTRY.eu,
  ...SOURCES_BY_COUNTRY.in,
]

function getSourceUrl(source) {
  return source.url || 'https://www.example.com'
}

// ─── Story Generation with Category Tags ────────────────────────────
const storyData = {
  world: [
    { headline: 'Global Leaders Convene Emergency Summit to Address Escalating Regional Conflicts Across Three Continents', summary: 'Representatives from over 40 nations gathered for emergency diplomatic talks aimed at de-escalating tensions in conflict zones. The summit produced initial frameworks for ceasefires and humanitarian aid corridors, though key parties remain divided on enforcement mechanisms.' },
    { headline: 'Historic International Climate Agreement Enters Force with Binding Emissions Targets for 190 Nations', summary: 'The landmark accord establishes legally binding carbon reduction milestones through 2035, backed by a $500 billion green transition fund. Developing nations will receive technology transfer and financial support to accelerate their shift away from fossil fuels.' },
    { headline: 'United Nations Launches Largest Peacekeeping Operation in Decades as Multiple Crises Demand Coordinated Response', summary: 'The Security Council authorized a multinational force of 30,000 personnel to stabilize regions facing simultaneous humanitarian and political emergencies. The operation will focus on protecting civilian populations and facilitating refugee repatriation.' },
    { headline: 'Global Supply Chain Restructuring Accelerates as Nations Prioritize Resilience Over Cost Efficiency', summary: 'Major economies are reshoring critical manufacturing capabilities following years of disruption, with trillions in investment flowing into domestic production capacity. Experts predict a fundamental shift in international trade patterns over the coming decade.' },
    { headline: 'International Court Issues Landmark Ruling on Maritime Boundaries, Resolving Decades-Long Dispute Between Nations', summary: 'The decision establishes new precedents for territorial waters and exclusive economic zones, affecting fishing rights and offshore resource exploration across a vast ocean region. Several neighboring countries have expressed intent to appeal aspects of the judgment.' },
    { headline: 'World Bank Announces Sweeping Reform Package to Better Serve Developing Economies Facing Debt Crises', summary: 'The restructuring includes expanded lending facilities, extended repayment periods, and debt sustainability frameworks designed to prevent default cascades. Critics argue the reforms do not go far enough in addressing systemic inequities in global finance.' },
  ],
  politics: [
    { headline: 'Bipartisan Coalition Forges Unlikely Alliance to Pass Comprehensive Government Transparency and Reform Package', summary: 'The legislation introduces mandatory ethics training, stricter lobbying disclosure requirements, and independent oversight of political financing. Both progressive and conservative lawmakers found common ground on anti-corruption measures after months of closed-door negotiations.' },
    { headline: 'Electoral System Overhaul Gains Momentum as Cross-Party Commission Recommends Ranked-Choice Voting Nationwide', summary: 'The proposed reforms would transform how citizens select representatives, potentially reducing partisan polarization by encouraging candidates to appeal beyond their base. Several states have already begun pilot programs ahead of potential federal adoption.' },
    { headline: 'Supreme Court Decision on Digital Privacy Sets New Precedent for Government Surveillance Powers in the Internet Age', summary: 'The ruling requires law enforcement agencies to obtain judicial warrants before accessing citizens\' digital communications, marking a significant expansion of privacy protections. Technology companies must now comply with updated data preservation standards.' },
    { headline: 'Federal Budget Negotiations Reach Critical Juncture as Deadline Approaches for Funding Multiple Government Agencies', summary: 'Lawmakers face difficult choices between defense spending increases and domestic program funding amid growing national debt. The standoff highlights deep ideological divides that could impact government operations if a compromise is not reached.' },
    { headline: 'New Executive Order Establishes National Framework for Artificial Intelligence Governance and Safety Standards', summary: 'The directive mandates rigorous testing protocols for advanced AI systems before deployment, creates an oversight body within the Department of Commerce, and requires companies to report safety incidents. Industry leaders have mixed reactions to the regulatory approach.' },
    { headline: 'Grassroots Movement Successfully Pushes Local Governments to Adopt Citizen Assembly Model for Policy Deliberation', summary: 'Randomly selected citizen panels are being used in over 50 municipalities to provide nonpartisan recommendations on contentious issues. Early results show higher public trust in outcomes compared to traditional legislative processes.' },
  ],
  business: [
    { headline: 'Central Banks Coordinate Unprecedented Monetary Policy Shift as Global Economic Indicators Signal Turning Point', summary: 'Synchronized adjustments to interest rate policies reflect growing confidence that inflation is being brought under control without triggering recession. Markets rallied on the news, with major indices posting their strongest gains in over a year.' },
    { headline: 'Major Technology Corporation Commits $15 Billion to Build Domestic Semiconductor Manufacturing Hub, Promising 10,000 Jobs', summary: 'The facility will produce advanced chips using next-generation fabrication processes, reducing dependence on overseas supply chains. The investment qualifies for substantial government incentives under the national semiconductor competitiveness initiative.' },
    { headline: 'Global Renewable Energy Investment Surpasses Fossil Fuel Spending for First Time, Marking Historic Economic Tipping Point', summary: 'Capital flows into solar, wind, and battery storage technologies now outpace traditional energy investments by a significant margin. The shift is driven by falling technology costs, supportive policy frameworks, and growing institutional investor demand for sustainable assets.' },
    { headline: 'International Trade Negotiations Produce New Framework Aimed at Reducing Tariffs on Critical Green Technology Components', summary: 'The agreement covers solar panels, wind turbine parts, electric vehicle batteries, and related materials across 30 participating nations. Implementation is expected to accelerate the global transition to clean energy by lowering costs for developing economies.' },
    { headline: 'Small Business Innovation Index Reaches Record High as Entrepreneurship Surges in AI and Clean Technology Sectors', summary: 'New ventures launched in emerging technology fields are creating disproportionate economic value, with venture capital funding concentrated in a growing number of specialized sectors. Small business administration programs report record application volumes.' },
    { headline: 'Global Housing Market Shows Signs of Stabilization as Mortgage Rates Peak and First-Time Buyer Programs Gain Traction', summary: 'Affordability initiatives targeting young professionals and essential workers are beginning to increase transaction volumes in previously frozen markets. Economists caution that structural supply shortages will keep prices elevated in many regions for the foreseeable future.' },
  ],
  tech: [
    { headline: 'Next-Generation Artificial Intelligence Model Demonstrates Breakthrough Reasoning Abilities Across Scientific Research Domains', summary: 'The system has shown remarkable capacity for hypothesis generation and experimental design, already assisting researchers in drug discovery and materials science. Developers emphasize the tool is designed to augment rather than replace human scientific judgment.' },
    { headline: 'Major Cybersecurity Framework Overhaul Proposed After Series of Sophisticated Attacks Target Critical Infrastructure Systems', summary: 'The proposed standards would require real-time threat monitoring, mandatory vulnerability disclosure within 24 hours, and independent security audits for all critical sector operators. Compliance deadlines are set to begin within six months of adoption.' },
    { headline: 'Quantum Computing Startup Achieves Practical Error Correction Milestone, Bringing Commercial Applications Closer to Reality', summary: 'The breakthrough in maintaining stable quantum states for extended periods addresses one of the field\'s most persistent challenges. Several financial and pharmaceutical companies have already signed letters of intent to access early quantum computing resources.' },
    { headline: 'Open-Source Movement Gains Major Corporate Backing as Tech Giants Collaborate on Shared Infrastructure Standards', summary: 'A consortium of leading technology companies has committed significant resources to developing interoperable, transparent platforms for cloud computing and data management. The initiative aims to reduce vendor lock-in and promote innovation through collaborative development.' },
    { headline: 'Solid-State Battery Technology Achieves Commercial Viability, Promising Electric Vehicles with 600-Mile Range and 15-Minute Charging', summary: 'The new battery architecture eliminates flammable liquid electrolytes while dramatically increasing energy density. Multiple automakers have announced plans to incorporate the technology into next-generation vehicle platforms starting within three years.' },
    { headline: 'Decentralized Social Media Protocol Gains Millions of Users Seeking Alternatives to Centralized Platform Governance', summary: 'The open protocol allows users to control their data while maintaining compatibility with existing social media applications. Developers are building tools that enable community-driven content moderation without sacrificing free expression principles.' },
  ],
  sports: [
    { headline: 'Unprecedented Underdog Victory Captivates Global Audience as Last-Place Team Clinches Championship in Dramatic Fashion', summary: 'The team\'s remarkable turnaround from worst-to-first was built on innovative tactical approaches and exceptional performances from previously overlooked players. Sports analysts are calling it the most improbable championship run in the history of the sport.' },
    { headline: 'International Olympic Committee Announces Bold New Format for Future Games Emphasizing Sustainability and Urban Integration', summary: 'Upcoming editions will utilize 95% existing or temporary venues, with host cities required to demonstrate long-term community benefit plans. The reforms aim to reduce costs and address growing concerns about the financial burden of hosting the Olympics.' },
    { headline: 'Revolutionary Player Tracking Technology Transforms Coaching Strategies and Enhances Athlete Performance Analysis', summary: 'Advanced sensor systems combined with machine learning analytics provide real-time insights into player biomechanics, fatigue levels, and tactical positioning. League officials have approved the technology after successful trials demonstrated measurable improvements in player safety.' },
    { headline: 'Women\'s Sports Viewership Reaches All-Time High as Investment in Professional Leagues Drives Quality and Accessibility', summary: 'Broadcast ratings for women\'s professional competitions have tripled over the past three years, attracting major sponsorship deals and increasing athlete compensation. The growth is attributed to improved production values, star player development, and expanded media coverage.' },
    { headline: 'Historic International Rivalry Renewed as Two Nations Face Off in World Cup Qualifier That Draws Record Global Audience', summary: 'The match showcased the highest level of competitive football, with tactical innovations from both coaches creating a compelling contest. Fans worldwide tuned in to witness what many are calling the most significant sporting event of the year.' },
    { headline: 'E-Sports Prize Pools Now Rival Traditional Sports as Competitive Gaming Attracts Major Corporate Sponsorship and Television Deals', summary: 'The top gaming tournaments now offer prize money comparable to major golf championships and tennis grand slams. Broadcast networks are investing heavily in e-sports coverage, recognizing the demographic appeal and growing global fanbase.' },
  ],
  science: [
    { headline: 'Deep Space Observatory Captures Most Detailed Images Ever of Galaxy Formation During Universe\'s First Billion Years', summary: 'The observations reveal unexpectedly massive early galaxies that challenge existing models of cosmic evolution. Scientists are revising theories about how quickly matter condensed into the structures we see in the modern universe.' },
    { headline: 'Gene Editing Therapy Shows Promise in Clinical Trials for Previously Untreatable Neurological Conditions Affecting Millions', summary: 'Patients receiving the experimental treatment demonstrated significant improvement in motor function and cognitive performance over a 12-month period. The approach uses precisely targeted genetic modifications to address root causes rather than managing symptoms.' },
    { headline: 'Ocean Exploration Mission Discovers Vast Network of Hydrothermal Vent Ecosystems Supporting Unique Life Forms Unknown to Science', summary: 'The newly mapped vent systems span hundreds of kilometers along mid-ocean ridges and host organisms adapted to extreme temperatures and chemical conditions. Researchers believe these ecosystems could provide insights into the origins of life on Earth and potential for life elsewhere.' },
    { headline: 'Nuclear Fusion Reactor Sustains Net Energy Output for Record Duration, Advancing Path Toward Clean Unlimited Power', summary: 'The experimental reactor maintained stable plasma conditions producing more energy than consumed for a continuous period previously thought impossible. Engineering challenges remain before commercial deployment, but the achievement represents a critical step toward fusion as a viable energy source.' },
    { headline: 'Ancient DNA Analysis Rewrites Human Migration Timeline, Revealing Previously Unknown Population Movements Across Continents', summary: 'Genetic evidence from 200 ancient specimens shows complex patterns of interbreeding and migration that contradict simpler models of human dispersal. The findings have profound implications for understanding how modern populations acquired genetic adaptations to different environments.' },
    { headline: 'Breakthrough in Room-Temperature Superconductor Research Could Transform Power Grids, Transportation, and Computing Infrastructure', summary: 'The material exhibits zero electrical resistance under conditions achievable with existing technology, opening possibilities for lossless power transmission and ultra-efficient electronics. Independent laboratories are working to replicate the results before the scientific community can confirm the discovery.' },
  ],
  health: [
    { headline: 'Global Health Agencies Report Significant Progress in Pandemic Preparedness as New Surveillance Systems Enable Early Warning Detection', summary: 'Advanced genomic sequencing networks deployed across 150 countries can now identify novel pathogens within days of emergence. The enhanced monitoring infrastructure represents a major investment in global health security following lessons learned from recent outbreaks.' },
    { headline: 'Revolutionary Immunotherapy Approach Shows Exceptional Results in Treating Aggressive Cancers That Previously Had Limited Options', summary: 'The treatment reprograms patients\' own immune cells to recognize and destroy tumor cells with remarkable precision, achieving remission in a majority of participants across multiple cancer types. Side effects are significantly milder than conventional chemotherapy.' },
    { headline: 'Mental Health Services Expansion Initiative Receives Record Funding as Governments Recognize Growing Crisis Among All Age Groups', summary: 'New programs will fund community mental health centers, telehealth platforms, and school-based counseling services. The investment reflects a paradigm shift in viewing mental health care as essential infrastructure rather than an optional supplement to physical medicine.' },
    { headline: 'Personalized Medicine Breakthrough Enables Cancer Treatment Tailored to Individual Genetic Profiles, Dramatically Improving Outcomes', summary: 'Genomic profiling of tumors allows oncologists to select therapies most likely to succeed for each patient, moving away from one-size-fits-all approaches. Early data shows response rates nearly double compared to standard treatment protocols.' },
    { headline: 'Wearable Health Monitoring Devices Gain Medical Grade Accuracy as Technology Enables Continuous Disease Prevention Tracking', summary: 'New generations of consumer wearables can detect early signs of cardiac arrhythmias, respiratory conditions, and metabolic disturbances with clinical-level precision. Regulatory bodies are developing frameworks to integrate this data into standard healthcare workflows.' },
    { headline: 'Antibiotic Resistance Crisis Prompts Development of Novel Antimicrobial Classes Using Artificial Intelligence Drug Discovery Platforms', summary: 'AI systems have identified promising new compounds that kill drug-resistant bacteria through mechanisms unlike any existing antibiotic class. Clinical trials are planned within two years as the world races to address the growing threat of untreatable infections.' },
  ],
  entertainment: [
    { headline: 'Independent Film Breakout Sensation Dominates Global Box Office, Proving Audiences Crave Original Storytelling Over Franchise Sequels', summary: 'The low-budget production has earned over $400 million worldwide through strong word-of-mouth and critical acclaim. Industry executives are reassessing their reliance on established franchises after the film demonstrated that fresh narratives can achieve massive commercial success.' },
    { headline: 'Streaming Platforms Enter New Competitive Phase as Services Differentiate Through Exclusive Creator Partnerships and Interactive Content', summary: 'Major platforms are investing in long-term relationships with acclaimed filmmakers and experimenting with branching narrative formats that let audiences influence story outcomes. The evolution signals maturation beyond the subscriber growth-at-all-costs strategy of earlier years.' },
    { headline: 'Music Industry Experiences Global Renaissance as Live Concert Attendance and Album Sales Reach Highest Levels in Thirty Years', summary: 'A diverse roster of artists across genres is driving unprecedented demand for both recorded music and live performances. The resurgence is attributed to a new generation of musicians blending cultural influences and leveraging direct-to-fan digital platforms.' },
    { headline: 'Video Game Industry Surpasses Film and Music Combined as Interactive Entertainment Becomes Dominant Form of Global Media Consumption', summary: 'Revenue from gaming now exceeds the combined totals of traditional entertainment sectors, driven by mobile gaming in emerging markets and premium experiences on consoles and PC. Cultural influence extends beyond gaming into fashion, music, and social interaction.' },
    { headline: 'Award-Winning Television Series Redefines Storytelling Boundaries with Multi-Narrative Structure Spanning Multiple Time Periods', summary: 'The ambitious production weaves together storylines across different eras to explore enduring themes of human resilience and connection. Critics have hailed it as a landmark achievement in serialized storytelling that pushes the creative limits of the medium.' },
    { headline: 'Virtual Reality Concert Experiences Attract Millions of Viewers as Artists Embrace Immersive Digital Performance Formats', summary: 'Musicians are creating fully immersive concert environments where remote audiences can interact with performances in three-dimensional virtual spaces. The technology enables artists to reach global fans while experimenting with visual and auditory experiences impossible in physical venues.' },
  ],
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
    <article className={`relative bg-gradient-to-br ${gradient} h-full w-full flex flex-col justify-between p-6 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group`}>
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
        <ShareButton headline={story.headline} summary={story.summary} />
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {story.tags.map(tag => (
            <span key={tag} className={`text-[11px] px-3 py-1 rounded-full border font-semibold backdrop-blur-sm ${accent}`}>
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>
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

// ─── Skeleton Card (Dark) ──────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-gray-950 h-full w-full flex flex-col justify-between p-6 rounded-2xl overflow-hidden shadow-lg animate-pulse border border-white/10">
      <div className="absolute inset-0 opacity-20"><div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" /></div>
      <div className="relative z-10 flex-1 flex flex-col justify-center my-4 space-y-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4"><div className="w-7 h-7 bg-white/10 rounded-lg" /><div className="h-5 w-px bg-white/20" /><div className="h-4 w-20 bg-white/10 rounded" /></div>
        <div className="h-8 w-full bg-white/10 rounded mb-3" />
        <div className="h-8 w-3/4 bg-white/10 rounded mb-4" />
        <div className="space-y-2 mb-5"><div className="h-4 w-full bg-white/5 rounded" /><div className="h-4 w-5/6 bg-white/5 rounded" /></div>
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

            {/* Reels snapping container */}
            <div className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col gap-4 pb-4">
              {stories.map(story => (
                <div key={story.id} className="h-full min-h-[calc(100vh-175px)] max-h-[750px] w-full shrink-0 snap-start">
                  <NewsCard story={story} />
                </div>
              ))}
              {loading && (
                <>
                  <div className="h-full min-h-[calc(100vh-175px)] max-h-[750px] w-full shrink-0 snap-start">
                    <SkeletonCard />
                  </div>
                  <div className="h-full min-h-[calc(100vh-175px)] max-h-[750px] w-full shrink-0 snap-start">
                    <SkeletonCard />
                  </div>
                </>
              )}
              {/* Observer target */}
              <div ref={observerTarget} className="h-4 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="shrink-0 py-2.5 text-center border-t border-white/5 bg-black/40">
        <p className="text-[10px] text-gray-500 font-medium">NewsPulse • Swipe up for next story • Auto-updates</p>
      </footer>
    </div>
  )
}

export default App
