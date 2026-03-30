/**
 * /api/download
 * 오디오 파일 프록시 다운로드
 * Freesound CDN에서 파일을 받아 attachment 헤더로 전달
 */
export default async function handler(req, res) {
  const { url, name = 'sound' } = req.query

  // 허용 도메인만 처리 (보안)
  const allowed = [
    'cdn.freesound.org',
    'freesound.org',
    'cdn.pixabay.com',
    'mixkit.imgix.net',
  ]
  const isAllowed = allowed.some(d => url?.includes(d))
  if (!url || !isAllowed) {
    return res.status(403).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!response.ok) throw new Error()

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'audio/mpeg'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${name}.mp3"`)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(Buffer.from(buffer))
  } catch {
    res.status(500).json({ error: 'Download failed' })
  }
}
