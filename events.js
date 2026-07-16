/* ============================================================================
   Last Call — 이벤트 & 날씨 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 events_weather / 설계서 t11_events_seasons.md
   ※ 해금 없음·새 자원 없음 — 기존 수치(접객 명성·사냥 rate·던전·습격 확률·명성)에 변동만.
   ※ 효과는 전부 SSOT. 날씨 효과 문자열을 수치로 전사(손님±%=접객 명성, 사냥±%=사냥 rate).
   ※ 시즌 이벤트(연4회, t11 §2)는 SEASONS 블록으로 구현 완료(2026-07-16). 실제 달력(로컬 시간) 기준.
   ============================================================================ */
const EVENTS = {
  weather: {
    interval_h: 12,   // 12 인게임시간마다 재추첨(합=1.0). 오프라인 복귀 시 1회 재추첨.
    distribution: [
      { name: "맑음", icon: "☀️", prob: 0.50, desc: "기본" },
      { name: "흐림", icon: "⛅", prob: 0.20, desc: "접객 명성 -5%", serveRep: 0.95 },
      { name: "비",   icon: "🌧️", prob: 0.20, desc: "접객 명성 +20% · 사냥 -10%", serveRep: 1.20, huntMult: 0.90 },
      { name: "폭풍", icon: "⛈️", prob: 0.08, desc: "사냥·원정 불가 · 습격 -70%", huntMult: 0, dungeonBlocked: true, raidMult: 0.30 },
      { name: "축제분위기", icon: "🌈", prob: 0.02, desc: "명성 획득 +50%", repMult: 1.50 }
    ]
  },
  daily: {
    interval_h: 24,   // 게임 하루(24 인게임시간) 경계마다 각 확률 판정. 오프라인=경과 일수 일괄.
    list: {
      "단골방문":   { prob: 1.0,  funds: 150 },
      "떠돌이상인": { prob: 0.40, cost_funds: 300, pool: ["마석가루", "산삼", "전설홉"], amount: 3 },
      "술배달의뢰": { prob: 0.30, any_drink: 3, funds: 400 }
    }
  },
  special: {
    "대목":     { frequency_days: 30,  duration_days: 3, serveRepMult: 3, raid_interval_div: 1.5 },   // 접객 명성 ×3 · 부작용: 습격 빈도↑(peace_interval ÷1.5). 진상은 시스템 미구현
    "마왕의외상": { frequency_days: 360, duration_days: 7, reward_funds: 5000, title: "외상 추격자" },  // 완료 시 자금+5000+칭호
    "음유시인":  { daily_prob: 0.03, duration_days: 1, repMult: 2, card: "음유시인 단골", card_rate: 0.5 } // 명성 ×2(일시) + 카드 0.5
  },
  // t31 야간: 낮 18h/밤 6h 자동 순환. 밤 기본 중립, 야행 유령(장착) 밤 생산 +25%.
  night: { day_h: 18, night_h: 6, prod_bonus: 0.25, unlock_pet_nights: 5 },
  // t31 축제: 개최(비용) → 지속 → 접객 명성 ×2 + 즉시 명성 +200. 명성 1000 해금.
  festival: { unlock_rep: 1000, cost: { 자금: 3000, drinks_any: 20 }, duration_h: 12, serve_rep_mult: 2.0, rep_on_hold: 200, unlock_pet_holds: 10 },
  // t31 희귀 드롭: 채집 rate_per_h ≤ 5 재료(아래). 희귀 산출 ×(1+luck).
  luck: { rare_materials: ["전설홉", "산삼", "마석가루", "슬라임정수", "거인고기"] }
};

/* ── 시즌 이벤트(연 4회) — t11 §2 확정(2026-07-16). SSOT: events_weather.season_events.
   실제 달력(로컬 시간) 기준, 연도 무관 연례 반복. 시계 조작 방지 로직 없음(정책 확정).
   한정 재화 = 공통 토큰 1종(state.season.tokens). 기존 활동 5곳에 얹는 부스트, 신규 활동 없음. ==== */
const SEASONS = [
  { id: "봄",   name: "벚꽃 축제", icon: "🌸", start: [4, 1],   end: [4, 14],  tokenLabel: "벚꽃잎",   drink: "벚꽃주",     title: "벚꽃 주모" },
  { id: "여름", name: "맥주 축제", icon: "☀️", start: [7, 15],  end: [7, 28],  tokenLabel: "맥주뚜껑", drink: "시원한라거", title: "맥주 축제왕" },
  { id: "가을", name: "추수 축제", icon: "🍂", start: [10, 8],  end: [10, 21], tokenLabel: "황금이삭", drink: "수확와인",   title: "황금 추수꾼" },
  { id: "겨울", name: "송년 축제", icon: "❄️", start: [12, 18], end: [12, 31], tokenLabel: "눈꽃",     drink: "따뜻한뱅쇼", title: "송년의 주인" }
];
const SEASON_BY_ID = {}; SEASONS.forEach(s => SEASON_BY_ID[s.id] = s);
const SEASON_TOKEN_EARN = { serve: 1, raidWin: 5, order: 5, dungeonBoss: 5, festivalEnd: 10 };
const SEASON_TOKEN_TO_FUNDS = 50;     // 종료 시 잔여 토큰 자동 환전(1토큰=자금50)
const SEASON_TITLE_THRESHOLD = 100;   // lifetime 누적 토큰 100 → 시즌 칭호 자동 부여
const SEASON_DRINK_COST_TOKENS = 15;
const SEASON_SHOP_BUNDLES = [
  { name: "자금 꾸러미", cost: 20, gain: { 자금: 2000 } },
  { name: "재료 꾸러미", cost: 30, gain: { 마석가루: 20 } },
  { name: "전설 꾸러미", cost: 50, gain: { 전설홉: 5, 산삼: 5 } }
];
