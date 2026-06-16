/* ============================================================================
   Last Call — 스킬 XP/레벨 데이터 (index.html에서 <script>로 로드)
   원본: lastcall_balance_data.json
     - core_formulas.xp_to_next_level : floor(N^2.2 * 8) + 50
     - skills.brewing_xp_per_craft    : 양조 1병당 XP(레벨 구간별)
     - skills.xp_per_action.gather_per_material : 채집 재료 1개당 조달 XP = 3
     - skills.brewing_speed_per_level / gather_rate_per_level : (Lv-1)×0.5%p, 캡 +120%
   ============================================================================ */
const SKILLS = {
  level_max: 99,

  // 다음 레벨까지 필요 XP (N = 현재 레벨)
  xpToNext(N) { return Math.floor(Math.pow(N, 2.2) * 8) + 50; },

  // 양조 1병당 XP — 레벨 구간별(키=레벨 임계값). 현재 양조 레벨로 가장 가까운 하위 키 값 사용.
  brewing_xp_per_craft: { 1: 20, 10: 35, 15: 50, 25: 80, 35: 110, 50: 170, 60: 230, 75: 380, 85: 600 },

  // 채집한 재료 1개당 조달 스킬 XP
  gather_xp_per_material: 3,

  // 레벨당 생산 속도/산출 보정 (양조·조달 공통): (Lv-1) × 0.5%p, 가산, 캡 +120%
  rate_per_level: 0.005,
  rate_cap: 1.20
};

// 양조 레벨 → 1병당 XP (구간 계단 조회)
function brewingXpForLevel(lv) {
  let v = 20;
  for (const k in SKILLS.brewing_xp_per_craft) if (lv >= +k) v = SKILLS.brewing_xp_per_craft[k];
  return v;
}
