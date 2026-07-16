/* ============================================================================
   Last Call — 업적 6종 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 achievements(6종, 미구현 12건 #7=A, 2026-07-16)
   조건 충족 시 titles.list 칭호(state.events.titles) 자동 부여(폴링, checkCloakUnlocks 동형). 칭호 1회만.
   ============================================================================ */
const ACHIEVEMENTS = [
  { id: "외상 사냥꾼",   title: "외상 사냥꾼",   desc: "진 관계 Lv.5",             cond: () => relLevel("진") >= 5 },
  { id: "전설의 주조사", title: "전설의 주조사", desc: "보리의 정수 최초 제조",     cond: () => !!(state.story.flags && state.story.flags.brewedElixir) },
  { id: "불패의 주점",   title: "철벽 주점",     desc: "습격 20연속 격퇴",         cond: () => (state.combat.consecutiveClears || 0) >= 20 },
  { id: "마왕의 단골",   title: "마왕의 단골",   desc: "마왕 단골 카드 보유",       cond: () => cardOwned("마왕 단골") },
  { id: "만수르",       title: "외상 청산기",   desc: "자금 1,000,000 보유",      cond: () => state.funds >= 1000000 },
  { id: "영업왕",       title: "영업왕",       desc: "전 6트랙 Lv.99",           cond: () => CLOAKS.list.every(c => cloakOwned(c.track)) }
];
function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (state.events.titles[a.title]) return;
    if (a.cond()) {
      state.events.titles[a.title] = true;
      if (!settling) log(`🏆 업적 달성 — '${a.title}' 칭호 획득!`);
      needsFullRender = true;
    }
  });
}
