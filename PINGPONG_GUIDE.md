# 🟢 PingPong MASTER GUIDE
> 초보자를 위한 영어 말하기 앱 (듀오링고 스타일)

---

# 🎯 1. 서비스 목표

PingPong은 “영어를 잘하게 하는 앱”이 아니다.

👉 목표는 단 하나:

**"사용자가 매일 한 문장이라도 말하게 만드는 것"**

---

# 🧠 2. 핵심 철학

1. 회화 > 문법
2. 짧게 > 정확하게
3. 느리게 > 많이
4. 듣기 → 따라하기 → 반복

---

# 👤 3. 타겟 사용자

- 영어 초보
- 말하기 두려운 사람
- 빠른 대화가 부담스러운 사용자

---

# 🔁 4. 기본 사용자 흐름

1. AI가 영어 문장 말함 (TTS)
2. 사용자가 듣고 따라 말함
3. 음성 → 텍스트 변환 (STT)
4. AI가 교정 + 짧은 피드백
5. AI가 다음 질문

👉 3~5턴 반복

---

# 🗣️ 5. AI 시스템 프롬프트 (핵심)
You are an English conversation partner for beginners.

Your goal is to help the user practice speaking English slowly and comfortably, like Duolingo.

Rules:

Always speak in short, simple sentences (1 sentence at a time).
Speak clearly and naturally like a friendly tutor.
Ask ONE follow-up question.
Keep the conversation slow and step-by-step.

Correction rules:

Ignore capitalization and punctuation mistakes.
Focus on speaking, not writing.
If understandable → say it's natural + suggest better version.
If wrong → correct + short Korean explanation.

Tone:

Be kind, encouraging, and simple.
Never overwhelm the user.

Output format:

corrected sentence
Korean feedback
next question

Example:

User: i go busan

Output:
I go to Busan.
전치사 "to"가 필요해요.
Where do you live?

Important:

This is a speaking practice app.
User may speak slowly.
Never rush.


---

# 🔊 6. 음성 시스템

## ✅ TTS (듣기)

- AI 문장 자동 재생
- "🔊 다시 듣기" 버튼 제공

```ts
speechSynthesis.speak(...)

🎤 STT (말하기)
❗ 핵심 규칙
❌ 자동 종료 금지
✅ 버튼으로 시작/종료
recognition.continuous = true;

⚠️ 7. 모바일 정책 (매우 중요)
반드시 지킬 것
❌ 페이지 로딩 시 마이크 요청 금지
✅ 버튼 클릭 시만 요청

📱 8. 브라우저 전략
환경	지원
크롬	✅ 최고
삼성인터넷	✅ 좋음
카카오톡	❌ 사용 금지

👉 사용자 안내 필수:

"크롬에서 열면 더 잘 작동합니다"

🎨 9. UI/UX 설계 원칙
높은 대비 (High Contrast)
큰 글씨
한 화면 = 한 행동
버튼 크기 큼
🎮 10. UX (듀오링고 스타일)
한 문장씩 진행
즉시 피드백
반복 가능
부담 없음
💬 11. 대화 구조
AI: 질문
USER: 답변
AI: 교정 + 칭찬
AI: 다음 질문

👉 계속 이어짐

🧠 12. 교정 기준
무시
대문자
마침표
쉼표
수정
어순
전치사
자연스러운 표현
🧩 13. 핵심 기능
1. Mission
짧은 상황 대화
3~5턴
2. Free Talk
자유 대화
AI 계속 질문
3. Review
이전 문장 저장
반복 학습
4. Streak
연속 학습 기록
🔊 14. UX 핵심 포인트
필수 기능
🔊 AI 음성 자동 재생
🎤 말하기 버튼 (시작/종료)
🔁 다시 듣기 버튼
🧠 짧은 피드백
🚨 15. 주요 문제 & 해결
❗ 마이크 계속 허용 요청

👉 해결:

미리 요청 금지
버튼 클릭 시 요청
❗ 카카오톡에서 안됨

👉 해결:

크롬 사용 안내
❗ 소리 안 나옴

👉 해결:

사용자 클릭 후 TTS 실행
🎯 16. 제품 목표

👉 "사용자가 부담 없이 계속 말하게 만든다"

📈 17. 다음 단계 로드맵
🟢 1단계 (완료)
기본 대화
음성
교정
🔵 2단계
XP 시스템
레벨 시스템
점수
🟣 3단계
발음 평가
반복 훈련
🟡 4단계
PWA (앱 설치)
알람 기능
🚀 18. 개발 체크리스트
 TTS 정상 작동
 STT 정상 작동
 모바일 UI 가독성 좋음
 AI 응답 짧음
 대화 자연스러움
💡 19. 핵심 한 줄

👉 "사용자가 매일 한 문장이라도 말하게 만드는 앱"

🔥 최종 목표

👉 "영어를 공부하게 하는 게 아니라, 말하게 만든다"


---

# 🎯 이 파일의 역할

이제 이 파일 하나면:

✔ 개발 방향 유지  
✔ AI 튜닝 기준  
✔ UX 기준  
✔ 기능 확장 기준  

👉 전부 해결됨

---

# 🚀 다음 단계 (원하면)

이제 진짜 서비스 단계다.

원하면 바로 해줄 수 있음:

👉 XP / 레벨 시스템  
👉 앱 설치 완성 (PWA)  
👉 알람 기능 (8:20 자동 실행 느낌)  
👉 발음 점수 시스템  

---

원하면 다음 단계 말해줘:

👉 “XP 시스템 만들어줘”  
👉 “앱처럼 설치하게 만들어줘”  

바로 이어서 간다 😎
-----