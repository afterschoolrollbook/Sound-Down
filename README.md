# Sound-Down - 무료 효과음 다운로더

저작권 걱정 없는 CC0 무료 효과음을 검색·미리듣기·다운로드할 수 있는 웹 서비스.
Freesound.org API 연동 + Google AdSense 수익화 전략 내장.

## ✨ 주요 기능
- 🔍 Freesound.org CC0 효과음 실시간 검색
- 🎵 8개 카테고리 (동물·유튜브·자연·밈·게임·UI·우주·ASMR)
- ▶️ 브라우저 내 미리듣기
- ⬇️ 다운로드 + 쿨다운 광고 (수익 최적화)
- 💰 4개 광고 슬롯
- 🌐 한국어 + 영어 동시 지원
- 🔗 Thumb-Down 크로스 프로모션

## 🚀 배포 방법

### 1. Freesound API 키 발급
1. freesound.org 접속 → 회원가입
2. 상단 메뉴 → API → Request API key
3. 앱 이름: Sound-Down 입력 후 신청
4. 이메일로 받은 키 복사

### 2. GitHub 업로드
```bash
git init && git add . && git commit -m "Sound-Down 첫 배포"
git remote add origin https://github.com/YOUR_USERNAME/Sound-Down.git
git push -u origin main
```

### 3. Vercel 배포
1. vercel.com → Add New Project → Sound-Down 저장소 연결
2. Environment Variables 설정 (아래 참고)
3. Deploy!

## ⚙️ 환경 변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_FREESOUND_API_KEY` | Freesound API 키 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | 애드센스 게시자 ID |
| `NEXT_PUBLIC_AD_SLOT_TOP` | 상단 광고 슬롯 |
| `NEXT_PUBLIC_AD_SLOT_COOLDOWN` | 쿨다운 광고 슬롯 ⭐ |
| `NEXT_PUBLIC_AD_SLOT_MIDDLE` | 중간 광고 슬롯 |
| `NEXT_PUBLIC_AD_SLOT_FOOTER` | 하단 광고 슬롯 |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 비밀번호 |

## 💰 수익화 전략
- 다운로드마다 10~15초 쿨다운 + 광고 강제 노출
- Thumb-Down 크로스 프로모션으로 방문자당 수익 2배

## 🔗 관련 서비스
- Thumb-Down: https://thumb-down.com (유튜브 썸네일 다운로더)
