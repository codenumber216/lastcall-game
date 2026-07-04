/* ============================================================================
   Last Call — 던전 원정 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 signature_dungeon / 설계서 t19_dungeon_expedition.md
   ※ 습격 엔진(raid_combat) 재활용 — 층마다 단판 전력 비교. 값은 전부 SSOT.
   ※ 장비(t26) 구현됨 — 보스 세트/일반 드롭 활성, 50회 고유 드롭률 +25% 적용.
     보류: 100회 전설 변형(장비 변형 시스템 미구현)만.
   ============================================================================ */
const DUNGEON = {
  party_max: 3,
  run_base_h: 2,                 // 1회 원정 기본 2 인게임시간(TIME_SCALE 적용)
  key: { max_hold: 3, recharge_interval_h: 8, amount: 1, cap: 3 },   // 8게임시간마다 +1, 최대 3, 오프라인 가산
  cost_by_grade: { 하급: 1, 중급: 2, 상급: 3 },

  // 층 적 전력 / 보스 배율 (signature_dungeon.combat)
  combat: { floor_enemy_base: 0.4, floor_enemy_slope: 0.6, boss_enemy_mult: 1.1 },

  // 던전 목록 (grade = grade_by_dungeon)
  list: [
    { name: "하수도",     floors: 3,  rec_power: 200,  boss: "거대 쥐왕",   grade: "하급" },
    { name: "거미 동굴",   floors: 5,  rec_power: 500,  boss: "여왕 거미",   grade: "하급" },
    { name: "도적 소굴",   floors: 5,  rec_power: 900,  boss: "도적 두목",   grade: "중급" },
    { name: "폐허 무덤",   floors: 7,  rec_power: 1500, boss: "리치",       grade: "중급" },
    { name: "용의 둥지",   floors: 8,  rec_power: 3000, boss: "새끼 드래곤", grade: "상급" },
    { name: "마계 입구",   floors: 10, rec_power: 5000, boss: "마족 장군",   grade: "상급" },
    { name: "마왕성 심층", floors: 12, rec_power: 8000, boss: "(마왕 격퇴 후 해금)", grade: "상급", unlock: "raid_tier6" }
  ],

  // 보상 (rewards) — funds_mult는 rec_power에 곱, material는 등급 풀에서 종류 추첨
  rewards: {
    floor: { funds_mult: 0.1, material: 2, material_types: 1 },       // round(rec×0.1/floors), 재료 2 (1종)
    boss:  { funds_mult: 0.5, material: 5, material_types: 2,         // round(rec×0.5), 재료 5 (1~2종)
             card: "모험가 단골", first_clear_guaranteed: true, repeat_rate: 0.10 },
    // 장비 드롭률 (QA SSOT 확정 2026-07-04) — 보스 격퇴 시 set_piece·common 독립 롤. 등급별 확률.
    //   자금·재료·카드는 보장, 장비만 확률(좌절 방지). 키 제한(3/일)이 페이싱이라 확률형 적정.
    drop_rate: {
      set_piece_by_grade: { 하급: 0.60, 중급: 0.45, 상급: 0.35 },   // 세트 1부위(랜덤 슬롯)
      common_by_grade:    { 하급: 0.50, 중급: 0.45, 상급: 0.40 },   // 같은 등급 비세트 1개
      clear50_set_bonus: 0.25,                                       // 50회+ → set_piece 확률 +0.25
      prob_cap: 0.95
    },
    material_pool_by_grade: {
      하급: ["광석", "나무껍질", "약초", "몬스터고기"],
      중급: ["꿀", "독버섯", "마석가루", "약수"],
      상급: ["전설홉", "슬라임정수", "거인고기", "산삼"]
    }
  },

  // 던전별 누적 클리어 보너스 (clear_count_bonus). 100회 전설변형만 보류(변형 시스템 미구현).
  clear_count_bonus: [
    { count: 50, label: "고유 드롭률 +25%", drop: 0.25 },   // 50회+ 보스 시 추가 장비 드롭 25%(활성)
    { count: 10, label: "보상 +10%", reward_mult: 1.10 }
  ]
};
