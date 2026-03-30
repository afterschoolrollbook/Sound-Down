// pages/api/settings/password.js
// 비밀번호 변경은 Vercel 환경변수를 직접 바꿔야 영구 적용됩니다.
// 이 API는 세션 내 임시 변경만 지원합니다.

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { currentPw, newPw } = req.body
  const correctPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'

  if (!currentPw || currentPw !== correctPw) {
    return res.status(401).json({ error: '현재 비밀번호가 틀렸습니다' })
  }

  if (!newPw || newPw.length < 6) {
    return res.status(400).json({ error: '새 비밀번호는 6자 이상이어야 합니다' })
  }

  // 메모리에 임시 저장 (영구 적용은 Vercel 환경변수에서 NEXT_PUBLIC_ADMIN_PASSWORD 변경 필요)
  global._tempAdminPw = newPw

  return res.status(200).json({ ok: true, message: '변경됐습니다. 영구 적용은 Vercel 환경변수에서 변경하세요.' })
}
