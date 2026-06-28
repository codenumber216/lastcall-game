/* ============================================================================
   Last Call — 이벤트 & 날씨 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 events_weather / 설계서 t11_events_seasons.md
   ※ 해금 없음·새 자원 없음 — 기존 수치(접객 명성·사냥 rate·던전·습격 확률·명성)에 변동만.
   ※ 효과는 전부 SSOT. 날씨 효과 문자열을 수치로 전사(손님±%=접객 명성, 사냥±%=사냥 rate).
   ※ 시즌 이벤트(연4회)는 _status:deferred — 미구현(신규 한정 자원).
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
  }
};
