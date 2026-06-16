/* ============================================================================
   Last Call — 발효 슬롯/속도 설정 (index.html에서 <script>로 불러옴)
   원본: lastcall_balance_data.json
     - tavern_bar.brewing_slots (slot_count_by_stage, assignment, speed_and_yield)
     - tavern_bar.brewmaster_passive (제조속도 +50%)
     - core_formulas.brewing_speed_per_level (양조 레벨당 +0.5%p, (Lv-1)×0.5%p)
     - global_caps_and_safety.production_speed_additive_cap (+120%)
     - material_production.gather_slots (채집 슬롯도 동일한 단계별 1~6)
   ============================================================================ */
const FERMENTATION = {
  // 주점 단계별 슬롯 수 (발효·채집 모두 동일 1~6). progression_axis.fermentation_slots 정합.
  slot_count_by_stage: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },

  // 술도사 클래스 패시브: 제조속도 +50% (가산)
  brewmaster_passive_speed: 0.50,

  // 양조 스킬 레벨당 제조속도 +0.5%p (가산). 확정 공식: (Lv-1) × 0.5%p
  //   → Lv.1 = +0%, Lv.99 = +49%. (core_formulas.brewing_speed_per_level, 2026-06-13 확정)
  brew_speed_per_level: 0.005,

  // 제조속도 합산 상한 (production_speed_additive_cap +120%)
  speed_additive_cap: 1.20,

  // 배치 자격 (assignment.who_can_brew / gather_slots.who_can_gather)
  who_can_brew_min_level: 1,
  who_can_gather_min_level: 1,

  // 공용 용병 풀 상한 (mercenaries.max_slots) — 발효·채집·전투가 나눠 씀
  merc_pool_max: 10,

  // ── 양조 폭발 (tavern_bar.brewing_slots.explosion, 2026-06-13 확정) ──
  //   발생 조건: 슬라임 종족 용병이 양조하는 슬롯 ("몸으로 발효" 설정, t13).
  //   ★ 레시피·재료와 무관 — '누가 양조하느냐(슬라임이냐)'로 결정. 비슬라임은 폭발 없음.
  explosion: {
    base_rate: 0.05,                         // 1병 완성 시 폭발 확률(슬라임 용병 양조)
    cleanup_min: 5,                          // 폭발 후 슬롯 정리(재가동 불가) 게임시간(분)
    // 슬라임 '가끔 폭발 면역' 패시브: 발생분을 확률적으로 자가 무효화(완화).
    //   확정(2026-06-13): 30% 자가 무효화 → 실효 폭발율 = 5% × (1-0.3) = 3.5%.
    slime_self_immune_chance: 0.3,
    mastery_full_negates: true               // 마스터리 풀 100% → 0% (마스터리 시스템 도입 후 연결)
    // 페널티: 투입 재료 100% 손실 · 수율 0 · 진행도 리셋 · 5분 정리 (위로 XP 0.3은 XP 시스템 대기)
  }
};

/* ── 버프(술 따르기) 설정 (tavern_bar.buff_activation) ──────────────────────
   slots            : 동시 버프 슬롯 수 (drink_buff_concurrent_slots)
   consume          : 발동 시 소비 병수
   same_series_block: 같은 계열(series) 동시 활성 금지
   duplicate_block  : 같은 술 동시 활성 금지
   stacking         : 슬롯 버프 간 곱연산 (계열이 전부 달라 항상 multiplicative) — _meta.convention   */
const BUFF = {
  slots: 3,
  consume: 1,
  same_series_block: true,
  duplicate_block: true,
  stacking: "multiplicative"
};
