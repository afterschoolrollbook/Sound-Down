// pages/api/settings/login.js

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password } = req.body
  const correctPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'

  if (!password || password !== correctPw) {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다' })
  }

  const token = process.env.ADMIN_SECRET_TOKEN || 'sounddown-admin-token'
  return res.status(200).json({ token })
}
