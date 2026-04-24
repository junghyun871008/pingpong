# 🏓 PingPong GUIDE v2.0
> 초보자 영어 말하기 앱 — 업데이트 로그 및 개발 가이드

**버전**: v2.0  
**업데이트**: 2026-04-24  
**이전 버전**: v1.0 (PINGPONG_GUIDE.md)

---

## ✅ v2.0 변경사항 요약

### 🔴 버그 수정
| 항목 | 문제 | 해결 |
|------|------|------|
| `MissionScreen` turns 뮤테이션 | `mission.turns.push()` 로 props 직접 변경 | 로컬 `useState<Turn[]>` 로 관리 |
| 교정 결과 사라짐 | 마지막 결과만 표시 | `Record<number, CorrectionEntry>` 누적 히스토리 |
| STT 싱글톤 누수 | 페이지 이동 후 이전 recognition 잔존 | `destroyRecognition()` 으로 인스턴스 완전 정리 |
| FreeTalk API 히스토리 미전달 | `history` 파라미터를 API에 전달하지 않음 | 최근 6턴 대화 맥락 포함하여 전달 |

### 🟡 UX 개선
- **자동 스크롤**: 새 말풍선 생성 시 자동으로 맨 아래로 스크롤
- **모바일 Safe Area**: `env(safe-area-inset-bottom)` 적용 — 노치/홈버튼 겹침 없음
- **FreeTalk 랜덤 시작**: 매번 같은 질문으로 시작하던 문제 수정 (30개 중 랜덤)
- **교정 인라인 표시**: 교정 결과가 대화창 내 사용자 말풍선 바로 아래에 표시
- **다크모드 강제 해제**: 라이트 모드 고정 (가독성 일관성)
- **모델 수정**: freetalk API `gpt-4o` 로 변경 (안정적 모델)

### 🟢 신규 기능

#### XP + 레벨 시스템
- 미션 완료: **+20 XP**
- 자유대화 이동: **+10 XP**
- 레벨 1~10 (Beginner → Champion)
- 레벨업 시 모달 팝업
- 레벨별 임계값: 50 → 130 → 250 → 410 → 620 → 880 → 1190 → 1550 → 1960 → 2500

#### 미션 30개로 확장
- v1: 5개 → v2: **30개**
- 주제: 아침인사, 커피, 음식, 날씨, 가족, 취미, 출퇴근, 쇼핑, 건강, 여행, 음악, 직장, 카페, 계절, 드라마, 식당, 헬스장, 꿈 등

#### FreeTalk 프롬프트 30개로 확장
- v1: 5개 → v2: **30개**
- 카테고리: 일상, 출퇴근, 음식, 취미, 날씨/계절, 감정, 목표/꿈

#### PWA (Progressive Web App)
- `public/sw.js` 서비스 워커: Cache First + Network First 전략
- `public/manifest.json` 업데이트: shortcuts, maskable icon
- `public/icon-192.png`, `icon-512.png` 아이콘 생성
- `components/PWARegister.tsx`: 서비스워커 등록 + 설치 배너
- 홈 화면 추가 시 앱처럼 실행 가능

---

## 🏗️ 현재 아키텍처

```
pingpong/
├── app/
│   ├── api/
│   │   ├── correct/route.ts    # AI 문장 교정 API
│   │   └── freetalk/route.ts   # AI 자유 대화 API (히스토리 포함)
│   ├── globals.css             # 글로벌 스타일 + 애니메이션 + safe-area
│   ├── layout.tsx              # 메타데이터 + PWA + PWARegister
│   └── page.tsx                # 메인 화면 라우터 + XP 관리
├── components/
│   ├── freetalk/
│   │   └── FreeTalkScreen.tsx  # 자유 대화 (랜덤 시작, 자동스크롤)
│   ├── home/
│   │   ├── HomeScreen.tsx      # 홈 (XPBar 포함)
│   │   └── XPBar.tsx           # XP/레벨 진행 바 (신규)
│   ├── mission/
│   │   ├── CorrectionCard.tsx  # 교정 카드 (standalone)
│   │   ├── MissionBubble.tsx   # 말풍선 + 인라인 교정 표시
│   │   └── MissionScreen.tsx   # 미션 화면 (버그 수정됨)
│   ├── review/
│   │   └── ReviewCard.tsx      # 복습 표현 카드
│   ├── ui/
│   │   └── LevelUpModal.tsx    # 레벨업 축하 모달 (신규)
│   └── PWARegister.tsx         # PWA 서비스워커 + 설치 배너 (신규)
├── data/
│   ├── freeTalkPrompts.ts      # 30개 프롬프트
│   └── missions.ts             # 30개 미션
├── lib/
│   ├── correction.ts           # 로컬 교정 규칙
│   ├── fallback.ts             # API 실패 시 폴백
│   ├── mission.ts              # 랜덤 미션 선택
│   ├── review.ts               # 복습 항목 관리
│   ├── storage.ts              # localStorage 유틸
│   ├── streak.ts               # 연속 학습 기록
│   └── xp.ts                   # XP/레벨 시스템 (신규)
├── public/
│   ├── icon-192.png            # PWA 아이콘 (신규)
│   ├── icon-512.png            # PWA 아이콘 (신규)
│   ├── manifest.json           # PWA 매니페스트
│   └── sw.js                   # 서비스 워커 (신규)
├── services/
│   ├── ai.ts                   # API 요청 함수
│   ├── audio.ts                # 오디오 언락
│   ├── speech.ts               # STT (버그 수정됨)
│   └── tts.ts                  # TTS
├── types/
│   ├── chat.ts                 # ChatMessage 타입
│   └── mission.ts              # Turn, Mission 타입
├── vercel.json                 # Vercel 배포 설정 (신규)
└── PINGPONG_GUIDE_v2.md        # 이 파일
```

---

## 🚀 배포 방법

### Vercel 배포 (추천)
1. [vercel.com](https://vercel.com) 접속 → New Project
2. GitHub 레포지토리 `junghyun871008/pingpong` 연결
3. **Environment Variables** 설정:
   ```
   OPENAI_API_KEY = sk-xxxxxxxxxxxxxxxxxxxx
   ```
4. Deploy 클릭 → 자동 빌드 + 배포

### 환경변수 (필수)
| 변수명 | 설명 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API 키 (필수) |

---

## 🧠 AI 시스템 프롬프트

### 교정 API (`/api/correct`)
```
You are an English speaking coach for absolute beginners.
- Correct the user's spoken English naturally
- Ignore capitalization and punctuation mistakes
- Give very short Korean explanation
- Give one easy next question
- Output JSON: { corrected, note, nextQuestion }
```

### 자유대화 API (`/api/freetalk`)
```
You are a friendly English conversation partner for beginners.
- Use conversation history (last 6 turns) for context
- Correct only unnatural spoken expressions
- Short Korean comment
- One easy follow-up question
- Output JSON: { corrected, note, nextQuestion }
```

---

## 🔊 음성 시스템

### TTS (듣기)
- `window.speechSynthesis` 사용
- 속도: 0.82 (초보자에 맞게 느리게)
- 언어: `en-US`

### STT (말하기) — v2 수정됨
- Web Speech API (`webkitSpeechRecognition`)
- `continuous: true` + 버튼으로 시작/종료
- 페이지 이동 시 인스턴스 완전 정리 (`destroyRecognition()`)
- 지원 브라우저: Chrome, Samsung Internet

---

## 🎮 게임화 시스템

### XP 획득
| 행동 | XP |
|------|-----|
| 미션 완료 | +20 XP |
| 자유대화 이동 | +10 XP |

### 레벨 테이블
| 레벨 | 칭호 | 누적 XP |
|------|------|---------|
| 1 | Beginner 🌱 | 0 |
| 2 | Learner 🌿 | 50 |
| 3 | Speaker 🌸 | 130 |
| 4 | Talker ⭐ | 250 |
| 5 | Fluent 🔥 | 410 |
| 6 | Pro 💎 | 620 |
| 7 | Expert 🏆 | 880 |
| 8 | Master 👑 | 1190 |
| 9 | Legend 🌟 | 1550 |
| 10 | Champion 🚀 | 1960 |

---

## 📈 v3 로드맵 (다음 단계)

### 우선순위 높음
- [ ] **발음 점수** — Web Audio API + AI 분석
- [ ] **스페이스드 리피티션 복습** — SM-2 알고리즘 적용
- [ ] **주제별 미션 선택** — 여행, 직장, 일상 카테고리

### 중간 우선순위
- [ ] **Push 알림** — 매일 오전 8:20 학습 리마인더
- [ ] **학습 통계** — 주간 그래프, 총 학습 시간
- [ ] **공유 기능** — 오늘 배운 문장 카카오톡 공유

### 나중에
- [ ] **계정 시스템** — 여러 기기 동기화
- [ ] **친구 랭킹** — Streak, XP 비교
- [ ] **미션 즐겨찾기** — 다시 하고 싶은 미션 저장

---

## 🚨 알려진 주의사항

| 환경 | 상태 |
|------|------|
| Chrome (Android) | ✅ 최적 |
| Chrome (iOS) | ✅ 좋음 |
| Samsung Internet | ✅ 좋음 |
| Safari (iOS) | ⚠️ STT 제한적 |
| 카카오톡 인앱 | ❌ STT 불가 |

> **안내 문구**: "크롬에서 열면 음성이 더 잘 작동해요 🎤"

---

## 💡 핵심 한 줄

> **"사용자가 매일 한 문장이라도 말하게 만드는 앱"**
