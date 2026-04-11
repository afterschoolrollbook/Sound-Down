import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CONTENT = {
  ko: {
    metaTitle: '이용약관 | Sound-Down',
    metaDesc: 'Sound-Down 이용약관 — 서비스 이용 조건 및 주의사항을 안내합니다.',
    title: '이용약관',
    updated: '최종 업데이트: 2025년 1월 1일',
    sections: [
      {
        title: '1. 서비스 소개',
        content: 'Sound-Down(sound-down.com)은 CC0 라이선스 효과음을 무료로 검색하고 다운로드할 수 있는 도구 서비스입니다. 본 서비스를 이용함으로써 아래 약관에 동의한 것으로 간주합니다.',
      },
      {
        title: '2. 서비스 이용 조건',
        content: '다음 조건에 동의하는 경우에만 서비스를 이용할 수 있습니다.',
        items: [
          '만 14세 이상이어야 합니다.',
          '관련 법령을 준수해야 합니다.',
          'CC0 음원은 저작권 없이 자유롭게 사용 가능하나, CC-BY 음원은 출처 표기가 필요합니다.',
          '서비스를 상업적 목적으로 무단 이용하거나 자동화(크롤링)하는 것을 금지합니다.',
        ],
      },
      {
        title: '3. 저작권 안내',
        content: 'Sound-Down은 Freesound.org 등 공개 API를 통해 CC0 및 무료 상업용 음원을 제공합니다. CC0 음원은 출처 표기 없이 상업적으로 사용 가능합니다. CC-BY 음원은 원작자 출처 표기가 필요합니다. 각 음원의 라이선스를 반드시 확인하세요.',
      },
      {
        title: '4. 면책 조항',
        content: 'Sound-Down은 이용자가 다운로드한 음원의 사용으로 인한 법적 문제에 대해 책임을 지지 않습니다. 서비스는 "있는 그대로" 제공되며, 특정 목적에 대한 적합성을 보증하지 않습니다.',
      },
      {
        title: '5. 서비스 변경 및 중단',
        content: 'Sound-Down은 사전 고지 없이 서비스를 변경하거나 일시 중단할 수 있습니다. 서비스 중단으로 인한 손해에 대해 책임을 지지 않습니다.',
      },
      {
        title: '6. 광고',
        content: '본 서비스는 Google AdSense를 통한 광고를 포함합니다. 광고 콘텐츠는 Google이 관리하며 Sound-Down과 무관합니다.',
      },
      {
        title: '7. 준거법',
        content: '본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 대한민국 법원을 관할 법원으로 합니다.',
      },
      {
        title: '8. 문의',
        items: ['이메일: minsiljjag@gmail.com', '운영자: Sound-Down 운영팀'],
      },
    ],
    linkPrivacy: '개인정보처리방침 →',
    linkFaq: '자주 묻는 질문 →',
    footer: '© 2024 Sound-Down. CC0 무료 효과음 다운로드.',
    langBtn: '🇺🇸 English',
  },
  en: {
    metaTitle: 'Terms of Service | Sound-Down',
    metaDesc: 'Sound-Down Terms of Service — conditions and guidelines for using our service.',
    title: 'Terms of Service',
    updated: 'Last updated: January 1, 2025',
    sections: [
      {
        title: '1. About the Service',
        content: 'Sound-Down (sound-down.com) is a free tool for searching and downloading CC0-licensed sound effects. By using this service, you agree to the terms below.',
      },
      {
        title: '2. Conditions of Use',
        content: 'You may use this service only if you agree to the following conditions.',
        items: [
          'You must be at least 14 years old.',
          'You must comply with applicable laws.',
          'CC0 sounds may be used freely without attribution. CC-BY sounds require crediting the original author.',
          'Unauthorized commercial use or automated access (scraping/crawling) of this service is prohibited.',
        ],
      },
      {
        title: '3. Copyright Notice',
        content: 'Sound-Down provides CC0 and free commercial-use audio via public APIs such as Freesound.org. CC0 sounds can be used commercially without attribution. CC-BY sounds require crediting the original creator. Always check the license of each sound before use.',
      },
      {
        title: '4. Disclaimer',
        content: 'Sound-Down is not responsible for any legal issues arising from your use of downloaded audio. The service is provided "as is" without any warranty of fitness for a particular purpose.',
      },
      {
        title: '5. Service Changes & Interruption',
        content: 'Sound-Down may modify or temporarily suspend the service without prior notice. We are not liable for any damages resulting from service interruptions.',
      },
      {
        title: '6. Advertising',
        content: 'This service includes ads served by Google AdSense. Ad content is managed by Google and is unrelated to Sound-Down.',
      },
      {
        title: '7. Governing Law',
        content: 'These terms are governed by the laws of the Republic of Korea. Any disputes shall be subject to the jurisdiction of Korean courts.',
      },
      {
        title: '8. Contact',
        items: ['Email: minsiljjag@gmail.com', 'Operator: Sound-Down Team'],
      },
    ],
    linkPrivacy: 'Privacy Policy →',
    linkFaq: 'FAQ →',
    footer: '© 2024 Sound-Down. Free CC0 Sound Effects Downloader.',
    langBtn: '🇰🇷 한국어',
  },
}

export default function Terms() {
  const [lang, setLang] = useState('ko')

  useEffect(() => {
    const saved = localStorage.getItem('sd_lang')
    if (saved && CONTENT[saved]) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('sd_lang', next)
  }

  const t = CONTENT[lang]

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">🔊</div>
            <span className="logo-text">Sound<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 680 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6 }}>
            {t.title}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 48 }}>{t.updated}</p>

          {t.sections.map((s, i) => (
            <div key={i} className="section">
              <h2 className="section-title">{s.title}</h2>
              <div className="section-body">
                {s.content && <p>{s.content}</p>}
                {s.items && (
                  <ul>
                    {s.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkPrivacy}</Link>
            <Link href="/faq" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkFaq}</Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .section { margin-bottom: 40px; }
        .section-title {
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 14px; padding-left: 12px;
          border-left: 3px solid var(--accent);
        }
        .section-body { color: var(--text2); font-size: 14px; line-height: 1.85; }
        .section-body p { margin-bottom: 8px; }
        .section-body ul { list-style: disc; padding-left: 20px; margin-top: 8px; }
        .section-body ul li { margin-bottom: 4px; }
      `}</style>
    </>
  )
}
