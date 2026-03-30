import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const S = {
  page: { minHeight:'100vh', background:'#080c10', fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#eef2f7', padding:'0 0 60px' },
  wrap: { maxWidth:820, margin:'0 auto', padding:'0 20px' },
  card: { background:'#0f1419', border:'1px solid #1e2830', borderRadius:14, padding:28, marginBottom:20 },
  input: { background:'#171e26', border:'1px solid #1e2830', borderRadius:8, padding:'10px 14px', color:'#eef2f7', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, outline:'none', width:'100%', boxSizing:'border-box' },
  btn: (c='#00d4aa') => ({ background:c, color:c==='#00d4aa'?'#000':'#fff', border:'none', borderRadius:9, padding:'11px 28px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer' }),
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:50, height:28, borderRadius:14, background:value?'#00d4aa':'#1e2830', position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ width:22, height:22, borderRadius:11, background:'#fff', position:'absolute', top:3, left:value?25:3, transition:'left 0.2s' }} />
    </div>
  )
}

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
    <div style={{ minHeight:'100vh', background:'#080c10', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ background:'#0f1419', border:'1px solid #1e2830', borderRadius:14, padding:40, width:360 }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ width:44, height:44, background:'#00d4aa', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>🎵</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#eef2f7' }}>Admin</h1>
          <p style={{ color:'#445566', fontSize:14, marginTop:4 }}>Sound-Down 관리자 패널</p>
        </div>
        <form onSubmit={submit}>
          <input type="password" placeholder="비밀번호" value={pw} onChange={e=>setPw(e.target.value)}
            style={{ ...S.input, borderColor:err?'#00d4aa':'#1e2830', marginBottom:8 }} />
          {err && <p style={{ color:'#00d4aa', fontSize:13, marginBottom:8 }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...S.btn(), width:'100%', marginTop:8, opacity:loading?0.6:1 }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [cooldownDur, setCooldownDur] = useState(12)
  const [adsOn, setAdsOn] = useState(true)
  const [thumbDownBanner, setThumbDownBanner] = useState(false)
  const [saved, setSaved] = useState(false)
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
      setCooldownDur(data.cooldown ?? 12)
      setAdsOn(data.adsOn ?? true)
      setThumbDownBanner(data.thumbDownBanner ?? false)
    } catch (err) {
      console.error('설정 불러오기 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) { setAdminToken(token); setAuthed(true) }
    else { setLoading(false) }
    fetchSettings()
  }, [fetchSettings])

  const handleLogin = (token) => { setAdminToken(token); setAuthed(true) }

  const kvSave = async (body) => {
    const res = await fetch('/api/settings/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
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

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setPwMsg({ type:'error', text:'새 비밀번호는 6자 이상이어야 합니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    if (newPw !== newPwConfirm) { setPwMsg({ type:'error', text:'새 비밀번호가 일치하지 않습니다.' }); setTimeout(() => setPwMsg(null), 3000); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPw, newPw }),
      })
      const data = await res.json()
      if (!res.ok) { setPwMsg({ type:'error', text: data.error || '변경 실패' }) }
      else { setCurrentPw(''); setNewPw(''); setNewPwConfirm(''); setPwMsg({ type:'success', text:'✅ 비밀번호가 변경되었습니다!' }) }
      setTimeout(() => setPwMsg(null), 4000)
    } catch {
      setPwMsg({ type:'error', text:'서버 오류. 다시 시도해주세요.' })
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) return <div style={{ minHeight:'100vh', background:'#080c10', display:'flex', alignItems:'center', justifyContent:'center', color:'#445566', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>불러오는 중...</div>
  if (!authed) return <LoginScreen onLogin={handleLogin} />

  return (
    <>
      <Head>
        <title>Admin · Sound-Down</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={S.page}>
        <div style={{ borderBottom:'1px solid #0f1419', padding:'18px 0', marginBottom:36 }}>
          <div style={{ ...S.wrap, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800 }}>관리자 대시보드</h1>
              <p style={{ color:'#445566', fontSize:13, marginTop:2 }}>Sound-Down Admin Panel · Supabase 연동</p>
            </div>
            <a href="/" style={{ color:'#445566', fontSize:13, textDecoration:'none' }}>← 사이트 보기</a>
          </div>
        </div>

        <div style={S.wrap}>
          <div style={S.card}>
            <h2 style={{ fontSize:17, fontWeight:700, marginBottom:20 }}>🎵 Freesound API 설정</h2>
            <p style={{ color:'#445566', fontSize:14, marginBottom:20 }}>freesound.org에서 무료 API 키를 발급받아 Vercel 환경변수에 입력하세요.</p>
            {[
              { key:'NEXT_PUBLIC_FREESOUND_API_KEY', desc:'Freesound API 키', important:true },
              { key:'NEXT_PUBLIC_ADSENSE_CLIENT', desc:'애드센스 게시자 ID', important:true },
              { key:'NEXT_PUBLIC_AD_SLOT_TOP', desc:'상단 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_AD_SLOT_COOLDOWN', desc:'⭐ 쿨다운 광고 슬롯 ID (가장 중요!)', important:true },
              { key:'NEXT_PUBLIC_AD_SLOT_MIDDLE', desc:'중간 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_AD_SLOT_FOOTER', desc:'하단 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_ADMIN_PASSWORD', desc:'관리자 초기 비밀번호 (최초 1회)', important:true },
              { key:'ADMIN_SECRET_TOKEN', desc:'서버 API 보안 토큰 (랜덤 문자열 32자+)', important:true },
            ].map(({ key, desc, important }) => (
              <div key={key} style={{ background:'#171e26', border:`1px solid ${important?'#00d4aa33':'#1e2830'}`, borderLeftColor:important?'#00d4aa':'#1e2830', borderLeftWidth:important?3:1, borderRadius:10, padding:'14px 18px', marginBottom:8 }}>
                <code style={{ color:'#00d4aa', fontSize:13 }}>{key}</code>
                <p style={{ color:'#8899aa', fontSize:13, marginTop:3 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <h2 style={{ fontSize:17, fontWeight:700, marginBottom:20 }}>⚙️ 사이트 설정</h2>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <label style={{ fontWeight:600 }}>쿨다운 시간</label>
                <span style={{ background:'#00d4aa', color:'#000', borderRadius:8, padding:'3px 12px', fontWeight:700, fontSize:15 }}>{cooldownDur}초</span>
              </div>
              <input type="range" min={5} max={30} value={cooldownDur} onChange={e=>setCooldownDur(parseInt(e.target.value))} style={{ width:'100%', accentColor:'#00d4aa', cursor:'pointer' }} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                <span style={{ color:'#445566', fontSize:12 }}>5초 (이탈 낮음)</span>
                <span style={{ color:'#445566', fontSize:12 }}>30초 (광고 수익 높음)</span>
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600 }}>광고 활성화</div>
                  <div style={{ color:'#445566', fontSize:13, marginTop:2 }}>{adsOn?'광고 표시 중':'광고 숨김'}</div>
                </div>
                <Toggle value={adsOn} onChange={setAdsOn} />
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:600 }}>🖼️ Thumb-Down 배너 노출</div>
                  <div style={{ color:'#445566', fontSize:13, marginTop:2 }}>{thumbDownBanner?'헤더 + 배너 표시 중':'배너 숨김 (광고 미승인 시 권장)'}</div>
                </div>
                <Toggle value={thumbDownBanner} onChange={setThumbDownBanner} />
              </div>
            </div>
            <button onClick={handleSave} style={{ ...S.btn(saved?'#1E8449':'#00d4aa'), transition:'background 0.3s' }}>
              {saved?'✅ 저장 완료!':'설정 저장'}
            </button>
          </div>

          <div style={S.card}>
            <h2 style={{ fontSize:17, fontWeight:700, marginBottom:20 }}>🔒 비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'#8899aa', fontSize:13, display:'block', marginBottom:6 }}>현재 비밀번호</label>
                <input type="password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'#8899aa', fontSize:13, display:'block', marginBottom:6 }}>새 비밀번호 (6자 이상)</label>
                <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="새 비밀번호 입력" style={S.input} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ color:'#8899aa', fontSize:13, display:'block', marginBottom:6 }}>새 비밀번호 확인</label>
                <input type="password" value={newPwConfirm} onChange={e=>setNewPwConfirm(e.target.value)} placeholder="새 비밀번호 재입력" style={S.input} />
              </div>
              {pwMsg && (
                <div style={{ padding:'10px 14px', borderRadius:8, marginBottom:12, fontSize:13, background:pwMsg.type==='success'?'#0d1f0d':'#1f0d0d', border:`1px solid ${pwMsg.type==='success'?'#1a4a1a':'#4a1a1a'}`, color:pwMsg.type==='success'?'#5a9a5a':'#00d4aa' }}>{pwMsg.text}</div>
              )}
              <button type="submit" disabled={pwLoading} style={{ ...S.btn('#3a5aff'), opacity:pwLoading?0.6:1 }}>
                {pwLoading?'변경 중...':'비밀번호 변경'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
