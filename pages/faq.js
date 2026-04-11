import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const FAQS = {
  ko: [
    {
      q: 'Sound-Down은 무료인가요?',
      a: '네, 완전히 무료입니다. 회원가입이나 로그인 없이 바로 사용할 수 있습니다. 서비스 운영 비용은 Google AdSense 광고 수익으로 충당됩니다.',
    },
    {
      q: '다운로드한 효과음을 상업적으로 사용해도 되나요?',
      a: 'Sound-Down은 CC0 라이선스 음원만 제공합니다. CC0는 저작권이 없는 퍼블릭 도메인으로, 출처 표기 없이 상업적으로도 자유롭게 사용할 수 있습니다. 단, 일부 음원은 CC-BY 라이선스일 수 있으며, 이 경우 원작자 출처 표기가 필요합니다.',
    },
    {
      q: '어떤 카테고리의 효과음을 제공하나요?',
      a: '동물 소리, 유튜브 효과음, 자연의 소리, 밈 사운드, 게임 효과음, UI/앱 사운드, 우주/특수 소리, ASMR·백색소음 등 8개 카테고리를 제공합니다. 유튜버·크리에이터·영상 편집자에게 필요한 대부분의 효과음을 찾을 수 있습니다.',
    },
    {
      q: '음원 소스는 어디서 가져오나요?',
      a: 'Freesound.org, Pixabay Sound, Mixkit, NASA 공식 사운드, USGS 자연음 등 신뢰할 수 있는 CC0 음원 소스에서 가져옵니다. 모두 저작권 걱정 없이 사용 가능한 합법적 음원입니다.',
    },
    {
      q: '모바일에서도 사용할 수 있나요?',
      a: '네, 스마트폰과 태블릿을 포함한 모든 기기에서 사용 가능합니다. 반응형 디자인으로 제작되어 모바일에서도 미리듣기와 다운로드가 편리합니다.',
    },
    {
      q: '미리듣기가 안 돼요.',
      a: '브라우저의 자동재생 정책으로 인해 일부 환경에서 미리듣기가 제한될 수 있습니다. 재생 버튼을 직접 클릭하거나, 다른 브라우저를 시도해 보세요. Chrome 최신 버전을 권장합니다.',
    },
    {
      q: '원하는 효과음을 못 찾겠어요.',
      a: '검색어를 영어로 입력하면 더 많은 결과를 찾을 수 있습니다. 예: "dog bark", "explosion", "rain" 등. 카테고리 탭을 이용해 원하는 분류를 탐색하는 것도 좋은 방법입니다.',
    },
    {
      q: 'Thumb-Down은 무엇인가요?',
      a: 'Thumb-Down(thumb-down.com)은 Sound-Down의 자매 서비스입니다. YouTube 영상의 썸네일을 HD, HQ, SD 등 모든 화질로 무료 다운로드할 수 있는 도구입니다.',
    },
  ],
  en: [
    {
      q: 'Is Sound-Down free to use?',
      a: 'Yes, completely free. No sign-up or login required. The service is supported by Google AdSense advertising revenue.',
    },
    {
      q: 'Can I use downloaded sound effects commercially?',
      a: 'Sound-Down provides CC0-licensed audio only. CC0 is public domain — you can use it commercially without any attribution. Some sounds may be CC-BY licensed, which requires crediting the original author.',
    },
    {
      q: 'What categories of sound effects are available?',
      a: 'We offer 8 categories: Animal Sounds, YouTube SFX, Nature Sounds, Meme Sounds, Game SFX, UI/App Sounds, Space/Special FX, and ASMR/White Noise. You can find most sounds needed for YouTube, TikTok, and video editing.',
    },
    {
      q: 'Where do the sounds come from?',
      a: 'Sounds are sourced from trusted CC0 providers including Freesound.org, Pixabay Sound, Mixkit, NASA official sounds, and USGS nature recordings. All are legally available with no copyright concerns.',
    },
    {
      q: 'Does it work on mobile devices?',
      a: 'Yes, it works on all devices including smartphones and tablets. The site is fully responsive with mobile-friendly preview and download functionality.',
    },
    {
      q: 'Preview is not working.',
      a: "Browser autoplay policies may restrict audio preview in some environments. Try clicking the play button directly, or use a different browser. We recommend the latest version of Chrome.",
    },
    {
      q: "I can't find the sound effect I need.",
      a: 'Try searching in English for broader results — e.g., "dog bark", "explosion", "rain". You can also browse by category tabs to explore available sounds.',
    },
    {
      q: 'What is Thumb-Down?',
      a: 'Thumb-Down (thumb-down.com) is a sister service to Sound-Down. It lets you download YouTube video thumbnails in HD, HQ, SD, and all available qualities for free.',
    },
  ],
}

const META = {
  ko: {
    title: '자주 묻는 질문 (FAQ) | Sound-Down',
    desc: '무료 효과음 다운로드, CC0 라이선스, 상업적 사용 여부 등 자주 묻는 질문을 확인하세요.',
    heading: '자주 묻는 질문',
    sub: '무료 효과음 다운로드에 관해 많이 물어보시는 질문을 모았습니다.',
    contactTitle: '더 궁금한 점이 있으신가요?',
    contactDesc: 'minsiljjag@gmail.com 으로 문의해 주시면 빠르게 답변해 드리겠습니다.',
    linkPrivacy: '개인정보처리방침 →',
    linkTerms: '이용약관 →',
    footer: '© 2024 Sound-Down. CC0 무료 효과음 다운로드.',
    langBtn: '🇺🇸 English',
  },
  en: {
    title: 'FAQ | Sound-Down — Free CC0 Sound Effects',
    desc: 'Find answers about downloading free sound effects, CC0 licensing, commercial use, and more.',
    heading: 'Frequently Asked Questions',
    sub: 'Everything you need to know about downloading free CC0 sound effects.',
    contactTitle: 'Still have questions?',
    contactDesc: "Reach us at minsiljjag@gmail.com and we'll get back to you quickly.",
    linkPrivacy: 'Privacy Policy →',
    linkTerms: 'Terms of Service →',
    footer: '© 2024 Sound-Down. Free CC0 Sound Effects Downloader.',
    langBtn: '🇰🇷 한국어',
  },
}

export default function Faq() {
  const [lang, setLang] = useState('ko')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('sd_lang')
    if (saved && META[saved]) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    setOpen(null)
    localStorage.setItem('sd_lang', next)
  }

  const t = META[lang]
  const faqs = FAQS[lang]

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
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
            {t.heading}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 48 }}>{t.sub}</p>

          <div className="faq-list">
            {faqs.map(({ q, a }, i => (
              <div
                key={i}
                className={`faq-item${open === i ? ' open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="faq-q">
                  <span>{q}</span>
                  <span className="faq-icon">{open === i ? '−' : '+'}</span>
                </div>
                {open === i && <div className="faq-a">{a}</div>}
              </div>
            )))}
          </div>

          <div className="contact-box">
            <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.contactTitle}</p>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>{t.contactDesc}</p>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkPrivacy}</Link>
            <Link href="/terms" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkTerms}</Link>
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
        .faq-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }
        .faq-item {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 18px 20px;
          cursor: pointer; transition: border-color 0.2s; user-select: none;
        }
        .faq-item:hover { border-color: var(--surface3); }
        .faq-item.open { border-color: var(--accent); }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; font-size: 15px; font-weight: 600; color: var(--text);
        }
        .faq-icon { color: var(--accent); font-size: 20px; font-weight: 400; line-height: 1; flex-shrink: 0; }
        .faq-a {
          margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border);
          font-size: 14px; color: var(--text2); line-height: 1.8;
        }
        .contact-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px 28px;
        }
      `}</style>
    </>
  )
}
