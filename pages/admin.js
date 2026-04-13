import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

// ===== 스타일 =====
const S = {
  page: {
    minHeight: '100vh',
    background: '#080c10',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#eef2f7',
    padding: '0 0 60px',
  },
  wrap: { maxWidth: 820, margin: '0 auto', padding: '0 20px' },
  card: {
    background: '#0f1419',
    border: '1px solid #1e2830',
    borderRadius: 14,
    padding: 28,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    background: '#171e26',
    border: '1px solid #1e2830',
    borderRadius: 10,
    padding: '14px 18px',
    marginBottom: 8,
  },
  code: { color: '#00d4aa', fontFamily: 'monospace', fontSize: 13 },
  label: { color: '#445566', fontSize: 13, marginTop: 3 },
  example: { color: '#334455', fontSize: 12, fontFamily: 'monospace' },
  input: {
    background: '#171e26',
    border: '1px solid #1e2830',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#eef2f7',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  btn: (color = '#00d4aa') => ({
    background: color,
    color: color === '#00d4aa' ? '#000' : '#fff',
    border: 'none',
    borderRadius: 9,
    padding: '11px 28px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  }),
}

// ===== 토글 =====
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 50, height: 28, borderRadius: 14,
        background: value ? '#00d4aa' : '#1e2830',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 11, background: '#fff',
        position: 'absolute', top: 3, left: value ? 25 : 3,
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

// ===== 로그인 화면 =====
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/settings/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || '비밀번호가 틀렸습니다')
        setTimeout(() => setErr(''), 2500)
      } else {
        sessionStorage.setItem('admin_token', data.token)
        onLogin(data.token)
      }
    } catch {
      setErr('서버 연결 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080c10',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background: '#0f1419', border: '1px solid #1e2830', borderRadius: 14, padding: 40, width: 360 }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, background: '#00d4aa', borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 16,
          }}>🎵</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#eef2f7' }}>Admin</h1>
          <p style={{ color: '#445566', fontSize: 14, marginTop: 4 }}>Sound-Down 관리자 패널</p>
        </div>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{ ...S.input, borderColor: err ? '#00d4aa' : '#1e2830', marginBottom: 8 }}
          />
          {err && <p style={{ color: '#00d4aa', fontSize: 13, marginBottom: 8 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn(), width: '100%', marginTop: 8, opacity: loading ? 0.6 : 1 }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ===== 제휴 카드 =====
function AffiliateCard({ emoji, title, titleSub, desc, badge, badgeColor, badgeBg, ctaText, ctaUrl, enabled, onToggle }) {
  return (
    <div style={{
      background: '#131a22', border: `1px solid ${enabled ? '#1e2830' : '#0f1419'}`,
      borderRadius: 12, padding: 18,
      opacity: enabled ? 1 : 0.45, transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{emoji}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
            <div style={{ color: '#445566', fontSize: 12 }}>{titleSub}</div>
          </div>
        </div>
        <Toggle value={enabled} onChange={onToggle} />
      </div>
      <p style={{ color: '#334455', fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: badgeBg, color: badgeColor }}>{badge}</span>
        <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: '#445566', textDecoration: 'none', padding: '4px 10px', border: '1px solid #1e2830', borderRadius: 6 }}>
          {ctaText} →
        </a>
      </div>
    </div>
  )
}

// ===== 대시보드 =====
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(true)

  // 설정값
  const [cooldownDur, setCooldownDur] = useState(12)
  const [adsOn, setAdsOn] = useState(true)
  const [thumbDownBanner, setThumbDownBanner] = useState(false)
  const [saved, setSaved] = useState(false)

  // 제휴 설정
  const [affiliateLinks, setAffiliateLinks] = useState({
    tubebuddy:     'https://www.tubebuddy.com/pricing?a=YOUR_ID',
    canva:         'https://partner.canva.com/YOUR_ID',
    envato:        'https://elements.envato.com/?ref=YOUR_ID',
    vidiq:         'https://vidiq.com/#_YOUR_ID',
    epidemicSound: 'https://www.epidemicsound.com/?utm_source=affiliate&utm_medium=YOUR_ID',
  })
  const [affiliateEnabled, setAffiliateEnabled] = useState({
    tubebuddy: true, canva: true, envato: true, vidiq: true, epidemicSound: false,
  })
  const [affiliateSaved, setAffiliateSaved] = useState(false)


  // 블로그 글쓰기
  const [blogTab, setBlogTab] = useState('write')
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogSaved, setBlogSaved] = useState(false)
  const [blogError, setBlogError] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [blogForm, setBlogForm] = useState({
    slug: '', title_ko: '', title_en: '',
    content_ko: '', content_en: '',
    description_ko: '', description_en: '',
    tags: '', published: true,
  })

  const fetchBlogPosts = async () => {
    setBlogLoading(true)
    try {
      const res = await fetch('/api/blog/posts', {
        headers: { 'x-admin-token': adminToken },
      })
      const data = await res.json()
      setBlogPosts(Array.isArray(data) ? data : [])
    } catch {}
    setBlogLoading(false)
  }

  const handleTogglePublished = async (post) => {
    await fetch('/api/blog/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    })
    fetchBlogPosts()
  }

  const handleBlogSubmit = async () => {
    if (!blogForm.slug || !blogForm.title_ko || !blogForm.content_ko) {
      setBlogError('슬러그, 제목(한국어), 내용(한국어)은 필수입니다.')
      setTimeout(() => setBlogError(''), 3000)
      return
    }
    setBlogLoading(true)
    try {
      const body = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      const method = editingPost ? 'PUT' : 'POST'
      if (editingPost) body.id = editingPost.id
      const res = await fetch('/api/blog/posts', {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setBlogSaved(true)
      setTimeout(() => setBlogSaved(false), 2500)
      setBlogForm({ slug:'', title_ko:'', title_en:'', content_ko:'', content_en:'', description_ko:'', description_en:'', tags:'', published:true })
      setEditingPost(null)
      fetchBlogPosts()
    } catch {
      setBlogError('저장 실패. 다시 시도해주세요.')
      setTimeout(() => setBlogError(''), 3000)
    }
    setBlogLoading(false)
  }

  const handleBlogDelete = async (id) => {
    if (!confirm('삭제할까요?')) return
    await fetch('/api/blog/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
      body: JSON.stringify({ id }),
    })
    fetchBlogPosts()
  }

  const handleBlogEdit = (post) => {
    setEditingPost(post)
    setBlogForm({
      slug: post.slug, title_ko: post.title_ko || '', title_en: post.title_en || '',
      content_ko: post.content_ko || '', content_en: post.content_en || '',
      description_ko: post.description_ko || '', description_en: post.description_en || '',
      tags: post.tags ? post.tags.join(', ') : '', published: post.published,
    })
    setBlogTab('write')
  }

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPwConfirm, setNewPwConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/get')
      if (!res.ok) return
      const data = await res.json()
      setCooldownDur(data.cooldown)
      setAdsOn(data.adsOn)
      setThumbDownBanner(data.thumbDownBanner ?? false)
      if (data.affiliateLinks) setAffiliateLinks(data.affiliateLinks)
      if (data.affiliateEnabled) setAffiliateEnabled(data.affiliateEnabled)
    } catch (err) {
      console.error('설정 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) {
      setAdminToken(token)
      setAuthed(true)
    } else {
      setLoading(false)
    }
    fetchSettings()
  }, [fetchSettings])

  const handleLogin = (token) => {
    setAdminToken(token)
    setAuthed(true)
  }

  const kvSave = async (body) => {
    const res = await fetch('/api/settings/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('저장 실패')
  }

  const handleSave = async () => {
    try {
      await kvSave({ cooldown: cooldownDur, adsOn, thumbDownBanner })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      alert('저장 실패. 다시 시도해주세요.')
    }
  }

  const handleAffiliateSave = async () => {
    try {
      await kvSave({ affiliateLinks, affiliateEnabled })
      setAffiliateSaved(true)
      setTimeout(() => setAffiliateSaved(false), 2500)
    } catch {
      alert('저장 실패. 다시 시도해주세요.')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPw.length < 6) {
      setPwMsg({ type: 'error', text: '새 비밀번호는 6자 이상이어야 합니다.' })
      setTimeout(() => setPwMsg(null), 3000)
      return
    }
    if (newPw !== newPwConfirm) {
      setPwMsg({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' })
      setTimeout(() => setPwMsg(null), 3000)
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPw, newPw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwMsg({ type: 'error', text: data.error || '변경 실패' })
      } else {
        setCurrentPw('')
        setNewPw('')
        setNewPwConfirm('')
        setPwMsg({ type: 'success', text: '✅ 비밀번호가 변경되었습니다! 다음 로그인부터 새 비밀번호를 사용하세요.' })
      }
      setTimeout(() => setPwMsg(null), 4000)
    } catch {
      setPwMsg({ type: 'error', text: '서버 오류. 다시 시도해주세요.' })
    } finally {
      setPwLoading(false)
    }
  }

  const affiliateCardData = [
    { key: 'tubebuddy', emoji: '📊', title: 'TubeBuddy', titleSub: '채널 성장 · 썸네일 A/B 테스트', desc: '유튜버 필수 도구. 썸네일 A/B 테스트, SEO 점수, 키워드 분석. 반복 커미션.', badge: '30% 반복 커미션', badgeColor: '#1a56db', badgeBg: '#eff6ff', ctaText: '제휴 신청', ctaUrl: 'https://www.tubebuddy.com/affiliates' },
    { key: 'canva', emoji: '🎨', title: 'Canva Pro', titleSub: '썸네일 직접 만들기', desc: '다운받은 썸네일에서 영감을 얻어 나만의 썸네일 제작. 건당 최대 $36.', badge: '최대 $36 / 건', badgeColor: '#7c3aed', badgeBg: '#f5f3ff', ctaText: '제휴 신청', ctaUrl: 'https://www.canva.com/help/canva-affiliate-marketing-program/' },
    { key: 'envato', emoji: '🗂️', title: 'Envato Elements', titleSub: '유튜브 인트로 · 템플릿', desc: '유튜브 인트로, 자막 템플릿, 이펙트 무제한 다운로드. 쿠키 90일.', badge: '30% 커미션 · 90일 쿠키', badgeColor: '#059669', badgeBg: '#ecfdf5', ctaText: '제휴 신청', ctaUrl: 'https://impact.com' },
    { key: 'vidiq', emoji: '📈', title: 'VidIQ', titleSub: '유튜브 조회수 성장 도구', desc: '트렌딩 키워드, 경쟁 채널 분석, 최적 업로드 시간 제안. 반복 커미션.', badge: '25% 반복 커미션', badgeColor: '#d97706', badgeBg: '#fffbeb', ctaText: '제휴 신청', ctaUrl: 'https://vidiq.com/affiliates' },
    { key: 'epidemicSound', emoji: '🎵', title: 'Epidemic Sound', titleSub: '저작권 걱정 없는 배경음악', desc: '유튜브 영상 배경음악 구독 서비스. Sound-Down과 연계 추천 가능.', badge: '쿠키 45일', badgeColor: '#0f766e', badgeBg: '#f0fdfa', ctaText: '제휴 신청', ctaUrl: 'https://www.flexoffers.com' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#445566', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        불러오는 중...
      </div>
    )
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  return (
    <>
      <Head>
        <title>Admin · Sound-Down</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        {/* 헤더 */}
        <div style={{ borderBottom: '1px solid #0f1419', padding: '18px 0', marginBottom: 36 }}>
          <div style={{ ...S.wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>관리자 대시보드</h1>
              <p style={{ color: '#445566', fontSize: 13, marginTop: 2 }}>Sound-Down Admin Panel · Supabase 연동</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a href="/" style={{ color: '#445566', fontSize: 13, textDecoration: 'none' }}>← 사이트 보기</a>
              <button onClick={() => { sessionStorage.removeItem('admin_token'); setAuthed(false); setAdminToken('') }} style={{ background: 'none', border: '1px solid #333', color: '#445566', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>로그아웃</button>
            </div>
          </div>
        </div>

        <div style={S.wrap}>

          {/* ===== 섹션 1: 애드센스 가이드 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>💰 애드센스 연동 가이드</h2>
            <p style={{ color: '#445566', fontSize: 14, marginBottom: 20 }}>
              Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 에서 아래 값을 추가하세요.
            </p>
            {[
              { key: 'NEXT_PUBLIC_FREESOUND_API_KEY', desc: 'Freesound API 키 (freesound.org에서 무료 발급)', example: 'your_freesound_api_key', important: true },
              { key: 'NEXT_PUBLIC_ADSENSE_CLIENT', desc: '애드센스 게시자 ID', example: 'ca-pub-1234567890123456', important: true },
              { key: 'NEXT_PUBLIC_AD_SLOT_TOP', desc: '상단 배너 광고 슬롯 ID', example: '1111111111' },
              { key: 'NEXT_PUBLIC_AD_SLOT_COOLDOWN', desc: '⭐ 쿨다운 광고 슬롯 ID (가장 중요)', example: '2222222222', important: true },
              { key: 'NEXT_PUBLIC_AD_SLOT_MIDDLE', desc: '결과 하단 광고 슬롯 ID', example: '3333333333' },
              { key: 'NEXT_PUBLIC_AD_SLOT_FOOTER', desc: '하단 광고 슬롯 ID', example: '4444444444' },
              { key: 'NEXT_PUBLIC_AD_SLOT_LEFT', desc: '왼쪽 사이드바 광고 슬롯 ID (PC 전용)', example: '5555555555' },
              { key: 'NEXT_PUBLIC_AD_SLOT_RIGHT', desc: '오른쪽 사이드바 광고 슬롯 ID (PC 전용)', example: '6666666666' },
              { key: 'NEXT_PUBLIC_ADMIN_PASSWORD', desc: '관리자 초기 비밀번호 (최초 1회)', example: '초기_비밀번호', important: true },
              { key: 'ADMIN_SECRET_TOKEN', desc: '서버 API 보안 토큰 (랜덤 문자열)', example: 'random_secret_32자_이상', important: true },
            ].map(({ key, desc, example, important }) => (
              <div key={key} style={{ ...S.row, borderColor: important ? '#0d2a22' : '#1e2830', borderLeftColor: important ? '#00d4aa' : '#1e2830', borderLeftWidth: important ? 3 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div><span style={S.code}>{key}</span><p style={S.label}>{desc}</p></div>
                  <span style={S.example}>{example}</span>
                </div>
              </div>
            ))}
            <div style={{ background: '#0a1f18', border: '1px solid #0d3326', borderRadius: 10, padding: 16, marginTop: 16 }}>
              <p style={{ color: '#2a7a5a', fontSize: 13, lineHeight: 1.7 }}>
                ✅ <strong>Supabase 연동 순서:</strong><br />
                1. supabase.com → New project → sound-down 프로젝트 생성<br />
                2. SQL Editor에서: <code style={{ color: '#00d4aa' }}>CREATE TABLE settings (key TEXT PRIMARY KEY, value JSONB NOT NULL);</code><br />
                3. Settings → API → URL + service_role 키 복사<br />
                4. Vercel 환경변수에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 입력 후 Redeploy
              </p>
            </div>
          </div>

          {/* ===== 섹션 2: 수익화 전략 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>📊 수익화 전략</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { icon: '⏱️', title: '쿨다운 광고', color: '#0a1219', accent: '#00d4aa', desc: '다운로드마다 10~15초 대기 동안 광고 강제 노출. 가장 높은 수익 구간.' },
                { icon: '📍', title: '6개 광고 슬롯', color: '#0a1219', accent: '#4a9aff', desc: '상단/쿨다운/결과하단/푸터/좌우사이드바 배치. 페이지뷰당 최대 수익.' },
                { icon: '🌐', title: '한/영 이중 언어', color: '#0a1219', accent: '#4aaa6a', desc: '영어권 트래픽 확보. 영어권 CPC가 3~5배 높음.' },
                { icon: '🔗', title: '제휴 마케팅', color: '#0a1219', accent: '#aaaa4a', desc: '전환 1건 = 클릭 수백 건 수익. Supabase에 링크 저장.' },
              ].map(({ icon, title, desc, color, accent }) => (
                <div key={title} style={{ background: color, border: `1px solid ${accent}33`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: accent }}>{title}</div>
                  <div style={{ color: '#445566', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 섹션 3: 제휴 마케팅 관리 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🔗 제휴 마케팅 관리</h2>
            <p style={{ color: '#445566', fontSize: 14, marginBottom: 20 }}>
              토글 켜고 링크 입력 후 저장하면 Supabase에 즉시 반영됩니다. 어떤 기기에서도 동일하게 적용.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12, marginBottom: 20 }}>
              {affiliateCardData.map((card) => (
                <AffiliateCard
                  key={card.key}
                  {...card}
                  enabled={affiliateEnabled[card.key]}
                  onToggle={(v) => setAffiliateEnabled((prev) => ({ ...prev, [card.key]: v }))}
                />
              ))}
            </div>
            <div style={{ background: '#0f1419', border: '1px solid #1e2830', borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <p style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>🔑 제휴 링크 직접 입력</p>
              {Object.keys(affiliateLinks).map((key) => {
                const card = affiliateCardData.find((c) => c.key === key)
                return (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <label style={{ color: '#445566', fontSize: 12, display: 'block', marginBottom: 4 }}>
                      {card?.emoji} {card?.title}
                    </label>
                    <input
                      type="text"
                      value={affiliateLinks[key]}
                      onChange={(e) => setAffiliateLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                      style={{ ...S.input, fontSize: 13 }}
                    />
                  </div>
                )
              })}
            </div>
            <button onClick={handleAffiliateSave} style={{ ...S.btn(affiliateSaved ? '#0d5a3a' : '#00d4aa'), transition: 'background 0.3s' }}>
              {affiliateSaved ? '✅ Supabase 저장 완료!' : '제휴 설정 저장'}
            </button>
          </div>

          {/* ===== 섹션 4: 사이트 설정 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>⚙️ 사이트 설정</h2>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>쿨다운 시간</label>
                <span style={{ background: '#00d4aa', color: '#000', borderRadius: 8, padding: '3px 12px', fontWeight: 700, fontSize: 15 }}>{cooldownDur}초</span>
              </div>
              <input type="range" min={5} max={30} value={cooldownDur} onChange={(e) => setCooldownDur(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#00d4aa', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ color: '#445566', fontSize: 12 }}>5초 (이탈 낮음)</span>
                <span style={{ color: '#445566', fontSize: 12 }}>30초 (광고 수익 높음)</span>
              </div>
              <div style={{ background: '#0f1419', borderRadius: 8, padding: 12, marginTop: 12 }}>
                <p style={{ color: '#334455', fontSize: 13, lineHeight: 1.6 }}>
                  💡 <strong style={{ color: '#445566' }}>최적값: 10~15초</strong> — 10~15초가 수익과 UX의 균형점입니다.
                </p>
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>광고 활성화</div>
                  <div style={{ color: '#445566', fontSize: 13, marginTop: 2 }}>{adsOn ? '광고가 표시됩니다' : '광고가 숨겨집니다'}</div>
                </div>
                <Toggle value={adsOn} onChange={setAdsOn} />
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>🖼️ Thumb-Down 배너 노출</div>
                  <div style={{ color: '#445566', fontSize: 13, marginTop: 2 }}>
                    {thumbDownBanner ? '헤더 + 푸터 위 배너가 표시됩니다' : '배너가 숨겨집니다 (광고 미승인 시 권장)'}
                  </div>
                </div>
                <Toggle value={thumbDownBanner} onChange={setThumbDownBanner} />
              </div>
            </div>
            <button onClick={handleSave} style={{ ...S.btn(saved ? '#0d5a3a' : '#00d4aa'), transition: 'background 0.3s' }}>
              {saved ? '✅ Supabase 저장 완료!' : '설정 저장'}
            </button>
          </div>

          {/* ===== 섹션 5: 블로그 글쓰기 ===== */}
          <div style={S.card}>
            <h2 style={{ ...S.cardTitle, justifyContent: 'space-between' }}>
              <span>✍️ 블로그 글 관리</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setBlogTab("write"); setEditingPost(null); setBlogForm({ slug:"",title_ko:"",title_en:"",content_ko:"",content_en:"",description_ko:"",description_en:"",tags:"",published:true }) }}
                  style={{ ...S.btn(blogTab === "write" ? "#00d4aa" : "#1e2830"), padding: "7px 16px", fontSize: 13 }}>✏️ 글쓰기</button>
                <button onClick={() => { setBlogTab("list"); fetchBlogPosts() }}
                  style={{ ...S.btn(blogTab === "list" ? "#00d4aa" : "#1e2830"), padding: "7px 16px", fontSize: 13 }}>📋 글 목록</button>
              </div>
            </h2>
            {blogTab === "write" && (
              <div>
                {editingPost && (
                  <div style={{ background: "#0d1f1a", border: "1px solid #1a4a3a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#00d4aa" }}>
                    ✏️ 수정 중: <strong>{editingPost.title_ko}</strong>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>슬러그 * (URL: /blog/슬러그)</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(p => ({...p, slug: e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}))}
                      placeholder="free-sound-effects-for-youtube" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>태그 (쉼표로 구분)</label>
                    <input value={blogForm.tags} onChange={e => setBlogForm(p => ({...p, tags: e.target.value}))}
                      placeholder="효과음, 유튜브, CC0" style={S.input} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>제목 (한국어) *</label>
                    <input value={blogForm.title_ko} onChange={e => setBlogForm(p => ({...p, title_ko: e.target.value}))}
                      placeholder="유튜브 무료 효과음 다운로드 방법" style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>제목 (English)</label>
                    <input value={blogForm.title_en} onChange={e => setBlogForm(p => ({...p, title_en: e.target.value}))}
                      placeholder="Free Sound Effects for YouTube" style={S.input} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>요약설명 (한국어) — SEO</label>
                    <input value={blogForm.description_ko} onChange={e => setBlogForm(p => ({...p, description_ko: e.target.value}))}
                      placeholder="저작권 없는 CC0 효과음을 무료로 다운로드하세요." style={S.input} />
                  </div>
                  <div>
                    <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>요약설명 (English)</label>
                    <input value={blogForm.description_en} onChange={e => setBlogForm(p => ({...p, description_en: e.target.value}))}
                      placeholder="Download free CC0 sound effects." style={S.input} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>본문 (한국어) * — HTML 가능: h2, p, ul, li, strong</label>
                  <textarea value={blogForm.content_ko} onChange={e => setBlogForm(p => ({...p, content_ko: e.target.value}))}
                    placeholder="<h2>무료 효과음이란?</h2>
<p>CC0 라이선스 효과음은...</p>"
                    style={{ ...S.input, height: 220, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#8899aa", fontSize: 12, display: "block", marginBottom: 4 }}>본문 (English) — HTML 가능</label>
                  <textarea value={blogForm.content_en} onChange={e => setBlogForm(p => ({...p, content_en: e.target.value}))}
                    placeholder="<h2>What are Free Sound Effects?</h2>
<p>CC0 licensed sounds...</p>"
                    style={{ ...S.input, height: 220, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <Toggle value={blogForm.published} onChange={v => setBlogForm(p => ({...p, published: v}))} />
                  <span style={{ fontSize: 14, color: "#8899aa" }}>{blogForm.published ? "공개" : "비공개"}</span>
                </div>
                {blogError && <p style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10 }}>{blogError}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleBlogSubmit} disabled={blogLoading}
                    style={{ ...S.btn(blogSaved ? "#00b894" : "#00d4aa"), color: "#000", opacity: blogLoading ? 0.6 : 1, transition: "background 0.3s" }}>
                    {blogLoading ? "저장 중..." : blogSaved ? "✅ 저장 완료!" : editingPost ? "✏️ 수정 저장" : "📝 발행"}
                  </button>
                  {editingPost && (
                    <button onClick={() => { setEditingPost(null); setBlogForm({ slug:"",title_ko:"",title_en:"",content_ko:"",content_en:"",description_ko:"",description_en:"",tags:"",published:true }) }}
                      style={{ ...S.btn("#1e2830"), fontSize: 14 }}>취소</button>
                  )}
                </div>
                <p style={{ color: "#445566", fontSize: 12, marginTop: 10 }}>
                  발행된 글: <a href="/blog" target="_blank" style={{ color: "#00d4aa" }}>/blog</a>
                </p>
              </div>
            )}
            {blogTab === "list" && (
              <div>
                {blogLoading && <p style={{ color: "#445566", fontSize: 14 }}>불러오는 중...</p>}
                {!blogLoading && blogPosts.length === 0 && <p style={{ color: "#445566", fontSize: 14 }}>아직 글이 없어요.</p>}
                {blogPosts.map(post => (
                  <div key={post.id} style={{ ...S.row, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{post.title_ko}</span>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                          background: post.published ? '#0a2a1a' : '#2a0a0a',
                          color: post.published ? '#00d4aa' : '#ff6b6b',
                        }}>{post.published ? '공개' : '비공개'}</span>
                      </div>
                      <div style={{ color: "#445566", fontSize: 12 }}>/blog/{post.slug} · {new Date(post.created_at).toLocaleDateString("ko-KR")}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleTogglePublished(post)}
                        style={{ ...S.btn(post.published ? "#2a1a00" : "#0a2a1a"), padding: "6px 12px", fontSize: 12 }}>
                        {post.published ? '비공개로' : '공개로'}
                      </button>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                        style={{ ...S.btn("#0d1f2a"), padding: "6px 12px", fontSize: 12, textDecoration: "none", color: "#00d4aa" }}>보기</a>
                      <button onClick={() => handleBlogEdit(post)}
                        style={{ ...S.btn("#0d2a1a"), padding: "6px 12px", fontSize: 12 }}>수정</button>
                      <button onClick={() => handleBlogDelete(post.id)}
                        style={{ ...S.btn("#2a0d0d"), padding: "6px 12px", fontSize: 12 }}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== 섹션 6: 비밀번호 변경 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🔒 비밀번호 변경</h2>
            <p style={{ color: '#445566', fontSize: 14, marginBottom: 20 }}>
              변경된 비밀번호는 <strong style={{ color: '#8899aa' }}>Supabase에 SHA-256 해시 저장</strong>되어
              모든 기기에서 영구 적용됩니다.
            </p>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: '#445566', fontSize: 13, display: 'block', marginBottom: 6 }}>현재 비밀번호</label>
                <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: '#445566', fontSize: 13, display: 'block', marginBottom: 6 }}>새 비밀번호 (6자 이상)</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="새 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#445566', fontSize: 13, display: 'block', marginBottom: 6 }}>새 비밀번호 확인</label>
                <input type="password" value={newPwConfirm} onChange={(e) => setNewPwConfirm(e.target.value)} placeholder="새 비밀번호 재입력" style={S.input} />
              </div>
              {pwMsg && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13,
                  background: pwMsg.type === 'success' ? '#0a1f18' : '#1f0a0a',
                  border: `1px solid ${pwMsg.type === 'success' ? '#0d3326' : '#3a0d0d'}`,
                  color: pwMsg.type === 'success' ? '#00d4aa' : '#ff6666',
                }}>{pwMsg.text}</div>
              )}
              <button type="submit" disabled={pwLoading} style={{ ...S.btn('#3a5aff'), opacity: pwLoading ? 0.6 : 1 }}>
                {pwLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          </div>

          {/* ===== 섹션 6: 배포 가이드 ===== */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>🚀 Vercel 배포 가이드</h2>
            {[
              { title: 'GitHub에 코드 업로드', desc: 'Sound-Down 저장소 생성 → 파일 업로드 → Commit' },
              { title: 'Supabase 프로젝트 생성', desc: 'supabase.com → New project → sound-down → SQL로 settings 테이블 생성' },
              { title: '@supabase/supabase-js 설치 확인', desc: 'package.json에 "@supabase/supabase-js": "^2.45.0" 포함 여부 확인' },
              { title: '환경 변수 추가', desc: 'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_SECRET_TOKEN, NEXT_PUBLIC_ADMIN_PASSWORD 설정' },
              { title: '도메인 연결', desc: 'Vercel → Settings → Domains → sound-down.com 연결' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < 4 ? '1px solid #0f1419' : 'none' }}>
                <div style={{ width: 28, height: 28, background: '#00d4aa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#000', flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: '#445566', fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
