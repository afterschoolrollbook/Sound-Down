import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── 번역 ───────────────────────────────────────────
const LANGS = {
  ko: {
    metaTitle: 'Sound-Down - 무료 효과음 다운로드 | CC0 저작권 무료',
    metaDesc: '동물소리, 유튜브 효과음, 자연의 소리, 밈 사운드 등 저작권 걱정 없는 CC0 무료 효과음을 검색·미리듣기·다운로드하세요.',
    badge: '무료 · CC0 · 저작권 걱정 없음',
    heroTitle1: '저작권 걱정 없는',
    heroTitle2: '무료 효과음',
    heroSub: '동물소리·유튜브 효과음·밈사운드·자연의 소리 등 모든 CC0 무료 효과음을 한 곳에서!',
    searchPlaceholder: '효과음 검색... (예: 강아지, 알림음, 빗소리)',
    searchBtn: '검색',
    searching: '검색 중...',
    waitBtn: (n) => `${n}초 대기`,
    allCat: '전체',
    resultsLabel: (n) => `검색 결과 ${n}개`,
    play: '재생',
    pause: '정지',
    download: '다운로드',
    license: 'CC0 무료',
    cooldownTitle: '다운로드 준비 중...',
    cooldownSub: '아래 광고를 잠시 봐주세요 :)',
    adLabel: '광고',
    howTitle: '사용 방법',
    how1: '원하는 효과음 검색 또는 카테고리 선택',
    how2: '재생 버튼으로 미리듣기',
    how3: '다운로드 버튼 클릭 → 무료 저장',
    crossTitle: '썸네일도 필요하세요?',
    crossDesc: '유튜브 썸네일을 무료로 다운로드하세요',
    crossLink: 'Thumb-Down 바로가기 →',
    footer: '© 2024 Sound-Down. CC0 무료 효과음 다운로드.',
    noResult: '검색 결과가 없어요. 다른 키워드로 검색해보세요!',
    sec: '초',
  },
  en: {
    metaTitle: 'Sound-Down - Free Sound Effects Download | CC0 Royalty Free',
    metaDesc: 'Download free CC0 sound effects: animal sounds, YouTube effects, nature sounds, meme sounds. No copyright worries!',
    badge: 'Free · CC0 · Royalty Free',
    heroTitle1: 'Royalty-Free',
    heroTitle2: 'Sound Effects',
    heroSub: 'Animal sounds, YouTube effects, meme sounds, nature & more — all CC0 free in one place!',
    searchPlaceholder: 'Search sounds... (e.g. dog, notification, rain)',
    searchBtn: 'Search',
    searching: 'Searching...',
    waitBtn: (n) => `Wait ${n}s`,
    allCat: 'All',
    resultsLabel: (n) => `${n} results found`,
    play: 'Play',
    pause: 'Pause',
    download: 'Download',
    license: 'CC0 Free',
    cooldownTitle: 'Preparing download...',
    cooldownSub: 'Please view the ad below while you wait.',
    adLabel: 'Advertisement',
    howTitle: 'How to Use',
    how1: 'Search or pick a category',
    how2: 'Preview with the play button',
    how3: 'Click download — free to save!',
    crossTitle: 'Need thumbnails too?',
    crossDesc: 'Download YouTube thumbnails for free',
    crossLink: 'Go to Thumb-Down →',
    footer: '© 2024 Sound-Down. Free CC0 Sound Effects Downloader.',
    noResult: 'No results found. Try a different keyword!',
    sec: 's',
  },
}

// ─── 카테고리 ────────────────────────────────────────
const CATEGORIES = {
  ko: [
    { id: 'all',    icon: '🎵', label: '전체' },
    { id: 'animal', icon: '🐾', label: '동물' },
    { id: 'youtube',icon: '💥', label: '유튜브 효과음' },
    { id: 'nature', icon: '🌿', label: '자연의 소리' },
    { id: 'meme',   icon: '😂', label: '밈 사운드' },
    { id: 'game',   icon: '🎮', label: '게임 효과음' },
    { id: 'ui',     icon: '🔔', label: 'UI/앱' },
    { id: 'space',  icon: '🚀', label: '우주/특수' },
    { id: 'asmr',   icon: '😴', label: 'ASMR' },
  ],
  en: [
    { id: 'all',    icon: '🎵', label: 'All' },
    { id: 'animal', icon: '🐾', label: 'Animals' },
    { id: 'youtube',icon: '💥', label: 'YouTube SFX' },
    { id: 'nature', icon: '🌿', label: 'Nature' },
    { id: 'meme',   icon: '😂', label: 'Meme Sounds' },
    { id: 'game',   icon: '🎮', label: 'Game SFX' },
    { id: 'ui',     icon: '🔔', label: 'UI/App' },
    { id: 'space',  icon: '🚀', label: 'Space/Sci-Fi' },
    { id: 'asmr',   icon: '😴', label: 'ASMR' },
  ],
}

// ─── 카테고리 → 검색어 맵 ───────────────────────────
const CAT_QUERY = {
  animal:  { ko: '동물 울음소리', en: 'animal sound' },
  youtube: { ko: '알림음 효과음', en: 'notification alert sound effect' },
  nature:  { ko: '자연 빗소리',   en: 'nature rain wind' },
  meme:    { ko: '밈 재미있는',   en: 'meme funny sound effect' },
  game:    { ko: '게임 효과음',   en: 'game sound effect' },
  ui:      { ko: 'UI 클릭 버튼',  en: 'ui click button interface' },
  space:   { ko: '우주 SF',       en: 'space sci-fi cosmic' },
  asmr:    { ko: 'ASMR 백색소음', en: 'asmr white noise relaxing' },
}

// ─── 파형 시각화 ─────────────────────────────────────
function Waveform({ playing }) {
  const heights = [8,14,20,28,36,28,40,28,36,20,28,14,8,14,20]
  return (
    <div className="waveform">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`waveform-bar${playing ? ' playing' : ''}`}
          style={{
            height: `${h}px`,
            animationDelay: playing ? `${i * 0.06}s` : '0s',
          }}
        />
      ))}
    </div>
  )
}

// ─── 애드센스 슬롯 ───────────────────────────────────
function AdSlot({ slot, tall = false, label = '광고' }) {
  const ref = useRef(null)
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  useEffect(() => {
    if (!client || !ref.current) return
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [client])
  if (!client) {
    return (
      <div className={`ad-slot${tall ? ' tall' : ''}`}>
        <span style={{ fontSize: 24 }}>📢</span>
        <span>{label} 영역</span>
        <span style={{ fontSize: 11, color: '#223344', marginTop: 4 }}>
          NEXT_PUBLIC_ADSENSE_CLIENT 환경변수 설정 후 표시됩니다
        </span>
      </div>
    )
  }
  return (
    <div>
      <p className="ad-tag">{label}</p>
      <ins ref={ref} className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── 메인 컴포넌트 ───────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState('ko')
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [sounds, setSounds] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  const [maxCooldown, setMaxCooldown] = useState(12)
  const [showCooldownAd, setShowCooldownAd] = useState(false)
  const audioRef = useRef(null)

  const t = LANGS[lang]
  const cats = CATEGORIES[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('sd_lang')
    const savedCd = localStorage.getItem('sd_cooldown_dur')
    if (savedLang && LANGS[savedLang]) setLang(savedLang)
    if (savedCd) setMaxCooldown(parseInt(savedCd))
    // 진행 중인 쿨다운 복원
    const end = localStorage.getItem('sd_cooldown_end')
    if (end) {
      const rem = Math.ceil((parseInt(end) - Date.now()) / 1000)
      if (rem > 0) { setCooldown(rem); setShowCooldownAd(true) }
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) { setShowCooldownAd(false); return }
    const id = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('sd_lang', next)
  }

  const doSearch = async (q, cat = activeCat) => {
    const searchQuery = q.trim() || (cat !== 'all' ? CAT_QUERY[cat]?.[lang] : '') || (lang === 'ko' ? '효과음' : 'sound effect')
    setLoading(true)
    setSearched(true)
    setSounds([])
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}`)
      const data = await res.json()
      setSounds(data.sounds || [])
    } catch {
      setSounds([])
    }
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loading) return
    setActiveCat('all')
    doSearch(query, 'all')
  }

  const handleCat = (catId) => {
    setActiveCat(catId)
    setQuery('')
    if (catId === 'all') {
      setSounds([]); setSearched(false); return
    }
    doSearch('', catId)
  }

  const handlePlay = (sound) => {
    if (playingId === sound.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(sound.preview)
    audio.play().catch(() => {})
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(sound.id)
  }

  const handleDownload = async (sound) => {
    // 쿨다운 시작 (핵심 광고 전략!)
    const dur = maxCooldown
    setCooldown(dur)
    setShowCooldownAd(true)
    localStorage.setItem('sd_cooldown_end', (Date.now() + dur * 1000).toString())
    // 실제 다운로드
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(sound.download)}&name=${encodeURIComponent(sound.name)}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${sound.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.mp3`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(sound.download, '_blank')
    }
  }

  const cooldownPct = maxCooldown > 0 ? cooldown / maxCooldown : 0
  const circumference = 2 * Math.PI * 24

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        {/* Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Sound-Down",
          "description": t.metaDesc,
          "url": "https://sound-down.com",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        })}} />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        )}
      </Head>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="wrap header-inner">
          <a href="/" className="logo">
            <div className="logo-icon">🎵</div>
            <span className="logo-text">Sound<span>-Down</span></span>
          </a>
          <button className="lang-btn" onClick={toggleLang}>
            {lang === 'ko' ? '🇺🇸 English' : '🇰🇷 한국어'}
          </button>
        </div>
      </header>

      {/* 상단 광고 */}
      <div className="wrap" style={{ marginTop: 24 }}>
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP || '1111111111'} label={t.adLabel} />
      </div>

      <main className="wrap">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">{t.badge}</div>
          <h1 className="hero-title">
            {t.heroTitle1} <span className="hl">{t.heroTitle2}</span>
          </h1>
          <p className="hero-sub">{t.heroSub}</p>
        </section>

        {/* ── 카테고리 탭 ── */}
        <div className="cat-tabs">
          {cats.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab${activeCat === cat.id ? ' active' : ''}`}
              onClick={() => handleCat(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* ── 검색 ── */}
        <div className="search-wrap">
          <form onSubmit={handleSubmit}>
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder={t.searchPlaceholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className={`search-btn${cooldown > 0 ? ' waiting' : ''}`}
                disabled={loading}
              >
                {loading ? t.searching : t.searchBtn}
              </button>
            </div>
          </form>
        </div>

        {/* ── 쿨다운 + 광고 ── */}
        {showCooldownAd && cooldown > 0 && (
          <div className="cooldown-block">
            <div className="cooldown-top">
              <div className="ring-wrap">
                <svg className="ring-svg" viewBox="0 0 56 56">
                  <circle className="ring-bg" cx="28" cy="28" r="24" />
                  <circle className="ring-progress" cx="28" cy="28" r="24"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - cooldownPct)}
                  />
                </svg>
                <span className="ring-num">{cooldown}</span>
              </div>
              <div className="cooldown-text">
                <strong>{t.cooldownTitle}</strong>
                <p>{t.cooldownSub}</p>
              </div>
            </div>
            <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_COOLDOWN || '2222222222'} tall label={t.adLabel} />
          </div>
        )}

        {/* ── 로딩 ── */}
        {loading && (
          <div className="loading">
            <span /><span /><span />
          </div>
        )}

        {/* ── 결과 ── */}
        {!loading && sounds.length > 0 && (
          <section>
            <h2 className="results-label">{t.resultsLabel(sounds.length)}</h2>
            <div className="sound-list">
              {sounds.map((sound, idx) => (
                <div key={sound.id} className={`sound-card${playingId === sound.id ? ' playing' : ''}`}>
                  <button className={`play-btn${playingId === sound.id ? ' playing' : ''}`} onClick={() => handlePlay(sound)} title={t.play}>
                    {playingId === sound.id ? '⏸' : '▶'}
                  </button>
                  <div className="sound-info">
                    <div className="sound-name">{sound.name}</div>
                    <div className="sound-meta">
                      <span className="sound-tag">{sound.category}</span>
                      <span className="sound-duration">{sound.duration}s</span>
                      <span className="sound-license">{t.license}</span>
                    </div>
                  </div>
                  <Waveform playing={playingId === sound.id} />
                  <button className="dl-btn" onClick={() => handleDownload(sound)}>
                    ↓ {t.download}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 빈 결과 ── */}
        {!loading && searched && sounds.length === 0 && (
          <div className="empty">
            <div className="empty-icon">🔇</div>
            <p>{t.noResult}</p>
          </div>
        )}

        {/* 결과 하단 광고 */}
        {sounds.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_MIDDLE || '3333333333'} label={t.adLabel} />
          </div>
        )}

        {/* ── 크로스 프로모션 ── */}
        <div className="cross-promo">
          <div className="cross-promo-text">
            <strong>🖼️ {t.crossTitle}</strong>
            {t.crossDesc}
          </div>
          <a href="https://thumb-down.com" className="cross-link" target="_blank" rel="noopener noreferrer">
            {t.crossLink}
          </a>
        </div>

        {/* ── 사용 방법 ── */}
        <section className="how-section">
          <h2 className="section-title">{t.howTitle}</h2>
          <div className="steps">
            {[t.how1, t.how2, t.how3].map((text, i) => (
              <div key={i} className="step">
                <div className="step-num">{i + 1}</div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="wrap">
          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '4444444444'} label={t.adLabel} />
          <p className="footer-text">{t.footer}</p>
          <a href="/admin" className="admin-link">admin</a>
        </div>
      </footer>
    </>
  )
}
