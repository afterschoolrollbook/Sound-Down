// pages/api/settings/get.js
// DB 없이 환경변수 기반으로 동작 — 별도 설정 불필요!

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // 런타임 설정은 메모리에서 관리 (서버 재시작 시 초기화됨)
  // 영구 저장이 필요하면 Vercel KV 연동 가능
  const settings = global._sounddownSettings || {
    cooldown: parseInt(process.env.DEFAULT_COOLDOWN || '12'),
    adsOn: true,
    thumbDownBanner: false,
  }

  return res.status(200).json(settings)
}
