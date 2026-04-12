import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const SITE = 'sound-down'

  // GET - 글 목록 or 개별 글
  if (req.method === 'GET') {
    const { slug } = req.query

    if (slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('site', SITE)
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error || !data) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(data)
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title_ko, title_en, description_ko, description_en, tags, created_at')
      .eq('site', SITE)
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST - 글 작성 (관리자만)
  if (req.method === 'POST') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { slug, title_ko, title_en, content_ko, content_en, description_ko, description_en, tags } = req.body

    if (!slug || !title_ko || !content_ko) {
      return res.status(400).json({ error: 'slug, title_ko, content_ko 필수' })
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ site: SITE, slug, title_ko, title_en, content_ko, content_en, description_ko, description_en, tags }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // PUT - 글 수정
  if (req.method === 'PUT') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id, ...fields } = req.body

    const { data, error } = await supabase
      .from('blog_posts')
      .update(fields)
      .eq('id', id)
      .eq('site', SITE)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE - 글 삭제
  if (req.method === 'DELETE') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.body

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('site', SITE)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
