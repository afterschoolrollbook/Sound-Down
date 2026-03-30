// pages/api/settings/save.js

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers['x-admin-token']
  const validToken = process.env.ADMIN_SECRET_TOKEN || 'sounddown-admin-token'

  if (!token || token !== validToken) {
    return res.status(401).json({ error: '인증 실패' })
  }

  const { cooldown, adsOn, thumbDownBanner } = req.body

  // 메모리에 설정 저장
  global._sounddownSettings = {
    cooldown: typeof cooldown === 'number' ? cooldown : 12,
    adsOn: typeof adsOn === 'boolean' ? adsOn : true,
    thumbDownBanner: typeof thumbDownBanner === 'boolean' ? thumbDownBanner : false,
  }

  return res.status(200).json({ ok: true })
}
