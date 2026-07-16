/* ============================================================================
   Last Call — 전투(습격 방어) 데이터 (index.html에서 <script>로 로드)
   원본: lastcall_balance_data.json 의 raid_combat / skills.combat_contribution
         / economy(습격_격퇴=enemy_tiers.funds_reward) / reputation.gain_actions.습격_격퇴
         / skills.xp_per_action.raid_clear_by_tier / global_caps_and_safety
   재료·술 키는 코드와 동일(NFC).
   ============================================================================ */
const COMBAT = {
  // 적 티어 (enemy_tiers) — power 균등 무작위, funds_reward = 격퇴 자금
  enemy_tiers: [
    { tier: 1, name: "좀도둑 패거리",   power: { min: 50,   max: 100 },  funds: { min: 5,   max: 15 } },
    { tier: 2, name: "떠돌이 도적단",   power: { min: 200,  max: 350 },  funds: { min: 20,  max: 40 } },
    { tier: 3, name: "몬스터 떼",       power: { min: 400,  max: 600 },  funds: { min: 50,  max: 80 } },
    { tier: 4, name: "용병 깡패단",     power: { min: 700,  max: 900 },  funds: { min: 80,  max: 120 } },
    { tier: 5, name: "자칭 영주", role: "미니보스", power: { min: 1200, max: 1800 }, funds: { min: 150, max: 250 } },
    { tier: 6, name: "엉뚱 마왕", role: "최종보스", power: { min: 5000, max: 8000 }, funds: { min: 500, max: 800 } }
  ],
  // ↑ name은 라벨 suffix 없는 확정값(SSOT raid_combat.enemy_tiers). 메타 구분은 role 필드. 로그엔 name만 노출.

  // 습격 주기·스케줄 (raid_schedule)
  peace_interval_h: { min: 6, max: 12 },
  first_raid_min_stage: 2,   // first_raid_grace: 1단계 면제 → 2단계 승급 후 첫 습격
  // 단계별 일반 습격 티어 (tier_by_stage). 1=면제(빈 배열). 보스 5/6은 스토리 1회성(boss_gating).
  tier_by_stage: { 1: [], 2: [1], 3: [1, 2], 4: [2, 3], 5: [3, 4], 6: [4] },

  // 전력 배율 상한/계수 (resolution + global_caps_and_safety)
  m_atk_cap: 1.50,            // combat_additive_group_cap +150%
  m_survive_cap: 1.00,        // +100%
  m_account_per_10k: 0.05,    // 명성 10,000당 +5%
  m_account_cap: 0.50,        // 캡 +50%
  audience: { 낮음: 0, 중간: 0.05, 높음: 0.15 },

  // 적 전력 가감 (raid_modifiers)
  enemy_rep_per_1000: 0.05,   // 명성 1000당 적 전력 +5%
  enemy_consecutive_bonus: 0.15, // 2연속 격퇴 후 다음 습격 +15%

  // 방벽 (facilities.방벽) — 확정값(SSOT)
  wall_durability_max: 100,        // durability_max
  wall_absorb_ratio: 0.5,          // loot_absorb_ratio: 패배 약탈 피해의 50% 흡수
  wall_repair_cost_per_point: 20,  // repair_cost_funds_per_1p: 내구도 1%p 수리 = 자금 20

  // 부상 (defeat / death_policy)
  injury_recovery_h: 2,

  // 패배 규칙 (defeat)
  defeat: {
    패배: { min: 0.7, lootDrink: 0.10, lootFunds: 0.05, wall: 15, injure: 0, cooldown_h: 3 },
    완패: { min: 0.0, lootDrink: 0.25, lootFunds: 0.15, wall: 30, injure: 1, cooldown_h: 3 }
  },

  // 격퇴 명성 (reputation.gain_actions.습격_격퇴)
  rep_by_tier: { 1: 10, 2: 30, 3: 60, 4: 100, 5: 300, 6: 1000 },
  // 격퇴 전투 XP (skills.xp_per_action.raid_clear_by_tier). 패배 시 50%.
  xp_by_tier: { 1: 50, 2: 120, 3: 250, 4: 450, 5: 900, 6: 2000 },

  // 용병 전투 기여 (skills.combat_contribution) — 전투 스킬·레벨별. 사이값은 선형 보간.
  contribution: {
    검술: { 1: 6, 20: 120, 40: 240, 60: 360, 99: 594 },
    궁술: { 1: 5, 30: 150, 60: 300, 99: 495 },
    마법: { 1: 5, 30: 150, 60: 330, 99: 540 }
  },

  // 술버프 → 전투 기여 (buff_application). raid형(회복의약주)도 습격 시 발동.
  buffs: {
    "영웅의폭탄주": { atk: 0.20 },      // 전 전투력 +20%
    "화끈한증류주": { atk: 0.15 },      // 공격 속도 +15%
    "보리의정수":   { atk: 0.30 },      // 전투력 +30%(부분)
    "도사의곡차":   { atk: 0.25 },      // 마법 위력 +25%
    "용기의에일":   { survive: 0.20 },  // 받는 피해 -20%
    "거인의흑맥주": { survive: 0.15 },  // HP 최대치 +15%
    "회복의약주":   { survive: 0.10 },  // 전투 중 HP 회복 (raid형)
    "함정꾼의독주": { trap: 0.30 }      // 함정 효과 +30% (설치 함정 기여분에 ×1.3)
  },

  // 함정 시스템(t03·t06, 미구현 12건 #2=A, 2026-07-16 확정) — 함정꾼의독주 trap 버프의 소비처.
  // 원안 5종(미끄럼~마법함정)은 v1 균일 설치물 1종으로 단순화.
  trap: {
    power_per: 15,                    // 설치 1개당 P_base 가산(플랫)
    cost: { 광석: 3, 목재: 3 },        // 설치 1개 비용
    install_max_divisor: 10,          // 상한 계산: floor(로스터 최고 전투Lv / 10)
    install_max_cap: 9                // 상한 캡
  }
};

// 전투 기여 보간: skill 테이블에서 lv에 해당하는 값(키 사이는 선형, 범위 밖은 양끝값)
function combatContribution(skill, lv) {
  const tbl = COMBAT.contribution[skill];
  if (!tbl) return 0;
  const keys = Object.keys(tbl).map(Number).sort((a, b) => a - b);
  if (lv <= keys[0]) return tbl[keys[0]];
  if (lv >= keys[keys.length - 1]) return tbl[keys[keys.length - 1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (lv >= keys[i] && lv <= keys[i + 1]) {
      const a = keys[i], b = keys[i + 1];
      return tbl[a] + (tbl[b] - tbl[a]) * (lv - a) / (b - a);
    }
  }
  return tbl[keys[0]];
}
