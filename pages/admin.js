import { useState, useEffect } from 'react'
import Head from 'next/head'

const DEFAULT_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'

const S = {
  page: { minHeight:'100vh', background:'#080c10', fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#eef2f7', padding:'0 0 60px' },
  wrap: { maxWidth:820, margin:'0 auto', padding:'0 20px' },
  card: { background:'#0f1419', border:'1px solid #1e2830', borderRadius:14, padding:28, marginBottom:20 },
  input: { background:'#171e26', border:'1px solid #1e2830', borderRadius:8, padding:'10px 14px', color:'#eef2f7', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, outline:'none', width:'100%' },
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
  const [err, setErr] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (pw === DEFAULT_PW) { onLogin() }
    else { setErr(true); setTimeout(() => setErr(false), 2000) }
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
          {err && <p style={{ color:'#00d4aa', fontSize:13, marginBottom:8 }}>비밀번호가 틀렸습니다</p>}
          <button type="submit" style={{ ...S.btn(), width:'100%', marginTop:8 }}>로그인</button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [cooldownDur, setCooldownDur] = useState(12)
  const [adsOn, setAdsOn] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('sd_admin_ok') === '1') setAuthed(true)
    const c = localStorage.getItem('sd_cooldown_dur')
    const a = localStorage.getItem('sd_ads_on')
    if (c) setCooldownDur(parseInt(c))
    if (a !== null) setAdsOn(a !== 'false')
  }, [])

  const handleLogin = () => { setAuthed(true); sessionStorage.setItem('sd_admin_ok', '1') }

  const handleSave = () => {
    localStorage.setItem('sd_cooldown_dur', cooldownDur.toString())
    localStorage.setItem('sd_ads_on', adsOn.toString())
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

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
              <p style={{ color:'#445566', fontSize:13, marginTop:2 }}>Sound-Down Admin Panel</p>
            </div>
            <a href="/" style={{ color:'#445566', fontSize:13, textDecoration:'none' }}>← 사이트 보기</a>
          </div>
        </div>

        <div style={S.wrap}>
          {/* Freesound API 가이드 */}
          <div style={S.card}>
            <h2 style={{ fontSize:17, fontWeight:700, marginBottom:20 }}>🎵 Freesound API 설정</h2>
            <p style={{ color:'#445566', fontSize:14, marginBottom:20 }}>freesound.org에서 무료 API 키를 발급받아 Vercel 환경변수에 입력하세요.</p>
            {[
              { key:'NEXT_PUBLIC_FREESOUND_API_KEY', desc:'Freesound API 키 (freesound.org → 로그인 → API → Request API key)', important:true },
              { key:'NEXT_PUBLIC_ADSENSE_CLIENT', desc:'애드센스 게시자 ID', important:true },
              { key:'NEXT_PUBLIC_AD_SLOT_TOP', desc:'상단 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_AD_SLOT_COOLDOWN', desc:'⭐ 쿨다운 광고 슬롯 ID (가장 중요!)', important:true },
              { key:'NEXT_PUBLIC_AD_SLOT_MIDDLE', desc:'중간 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_AD_SLOT_FOOTER', desc:'하단 광고 슬롯 ID' },
              { key:'NEXT_PUBLIC_ADMIN_PASSWORD', desc:'관리자 비밀번호 (반드시 변경!)', important:true },
            ].map(({ key, desc, important }) => (
              <div key={key} style={{ background:'#171e26', border:`1px solid ${important?'#00d4aa33':'#1e2830'}`, borderLeftColor:important?'#00d4aa':'#1e2830', borderLeftWidth:important?3:1, borderRadius:10, padding:'14px 18px', marginBottom:8 }}>
                <code style={{ color:'#00d4aa', fontSize:13 }}>{key}</code>
                <p style={{ color:'#8899aa', fontSize:13, marginTop:3 }}>{desc}</p>
              </div>
            ))}
            <div style={{ background:'#0a1f0a', border:'1px solid #1a3a1a', borderRadius:10, padding:16, marginTop:16 }}>
              <p style={{ color:'#5a9a5a', fontSize:13, lineHeight:1.7 }}>
                ✅ <strong>Freesound API 키 발급 순서:</strong><br />
                1. freesound.org 접속 → 회원가입<br />
                2. 상단 메뉴 → API → Request API key<br />
                3. 앱 이름: Sound-Down, 설명 입력 후 신청<br />
                4. 이메일로 받은 키를 Vercel 환경변수에 입력<br />
                5. Redeploy → 실제 Freesound 검색 결과 표시!
              </p>
            </div>
          </div>

          {/* 사이트 설정 */}
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
            <button onClick={handleSave} style={{ ...S.btn(saved?'#1E8449':'#00d4aa'), transition:'background 0.3s' }}>
              {saved?'✅ 저장 완료!':'설정 저장'}
            </button>
          </div>

          {/* 크로스 프로모션 */}
          <div style={S.card}>
            <h2 style={{ fontSize:17, fontWeight:700, marginBottom:16 }}>🔗 크로스 프로모션 현황</h2>
            <div style={{ background:'#171e26', borderRadius:10, padding:16 }}>
              <p style={{ color:'#8899aa', fontSize:14, lineHeight:1.7 }}>
                ✅ Sound-Down 하단 → Thumb-Down 링크 (자동 적용됨)<br />
                ☐ Thumb-Down 하단 → Sound-Down 링크 추가 필요<br /><br />
                <span style={{ color:'#00d4aa' }}>Thumb-Down 코드에 아래 컴포넌트를 추가하세요:</span><br />
                <code style={{ fontSize:12, color:'#8899aa' }}>
                  {`<a href="https://sound-down.com">효과음도 필요하세요? → Sound-Down</a>`}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
