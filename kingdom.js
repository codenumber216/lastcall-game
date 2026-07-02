/* ============================================================================
   Last Call — 왕국 성장(무용담·술통) 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 kingdom_systems.stamps/statues
              + _resource_aliases + _growth_readiness + core_formulas.stamp_statue_interpolation
   ※ 무용담 17종 전부 + 술통 11종 활성(deferred=축제 술통 1종만, 축제 시스템 미구현). 값/효과 전부 SSOT.
   target: 효과가 합산될 게임 수치 그룹(확장=upgrade_cost_reduction·왕국=rep_gain 확정). null 없음.
   ============================================================================ */
const KINGDOM = {
  level_max: 20,

  // 무용담(stamps) — 17종 전부 활성 (안주=요리·제작=대장일·원정=원정 시스템 구현으로 해제)
  stamps: {
    "양조": { lv1: "+3%", max: "+30%", cost: { 홉: 50 },  target: "brew_speed" },
    "안주": { lv1: "-3%", max: "-25%", cost: { 고기: 30 }, target: "cook_mat" },   // 요리 효율(안주 재료 -%) · 고기→몬스터고기 alias
    "접객": { lv1: "+3%", max: "+30%", cost: { 자금: 100 }, target: "satisfaction" },
    "경영": { lv1: "+5%", max: "+50%", cost: { 자금: 200 }, target: "funds_gain" },
    "홍보": { lv1: "+3%", max: "+30%", cost: { 자금: 150 }, target: "rep_gain" },
    "조달": { lv1: "+3%", max: "+30%", cost: { 약초: 50 }, target: "gather_rate" },
    "제작": { lv1: "-4%", max: "-35%", cost: { 철: 40 }, target: "craft_mat" },   // 대장일 재료 -% · 철→광석 alias
    "검술": { lv1: "+4%", max: "+35%", cost: { 광석: 40 },   target: "combat_atk" },
    "궁술": { lv1: "+4%", max: "+35%", cost: { 나무껍질: 40 }, target: "combat_atk" },
    "마법": { lv1: "+5%", max: "+40%", cost: { 마석가루: 20 }, target: "combat_atk" },
    "함정": { lv1: "+5%", max: "+40%", cost: { 독버섯: 20 },  target: "combat_atk" },
    "방어": { lv1: "+3%", max: "+25%", cost: { 광석: 50 },   target: "combat_survive" },
    "확장": { lv1: "+5%", max: "+40%", cost: { 목재: 50 },   target: "upgrade_cost_reduction" },   // 주점 승급 build_cost 자금분 -%
    "원정": { lv1: "+3%", max: "+25%", cost: { 자금: 150 }, target: "discovery" },   // 원정 발견 +%(보상량↑) — 대장일·요리처럼 시스템 구현으로 해제
    "영업": { lv1: "+30분", max: "+5시간", cost: { 자금: 200 }, target: "offline" },   // "영업(오프라인)"
    "왕국": { lv1: "+5%", max: "+40%", cost: { 자금: 300 },  target: "rep_gain" },   // 전 명성 획득 +%(getter, power 캡 별개)
    "전설": { lv1: "x1.1", max: "x2.0", cost: { 전설홉: 3 },  target: "combat_atk" }     // 곱→가산(eff-1), +150% 클립
  },

  // 술통(statues) — deferred(축제) 제외 11종 (장인=대장일·모험=원정 구현으로 해제). 왕의 술통 해금 기준 11종.
  statues: {
    "양조의 술통": { lv1: "+3%", max: "+30%", cost: { 술: 500 },     target: "brew_speed" },
    "장인의 술통": { lv1: "+4%", max: "+35%", cost: { 철: 500 },     target: "quality" },   // 제작 품질(등급업 확률) · 철→광석 alias
    "모험의 술통": { lv1: "+5%", max: "+40%", cost: { 유물: 100 },   target: "discovery" },   // 원정 발견(보상량↑)
    "용맹의 술통": { lv1: "+5%", max: "+40%", cost: { 도적금화: 200 }, target: "combat_atk" },
    "환대의 술통": { lv1: "+5%", max: "+50%", cost: { 자금: 300 },    target: "satisfaction" },
    "번영의 술통": { lv1: "+5%", max: "+45%", cost: { 자금: 500 },    target: "funds_gain" },
    "풍요의 술통": { lv1: "+5%", max: "+40%", cost: { 작물: 300 },    target: "gather_rate" }, // 채집 rate(생산 +120% 캡)
    "명성의 술통": { lv1: "+5%", max: "+45%", cost: { 자금: 400 },    target: "rep_gain" },
    "마법의 술통": { lv1: "+5%", max: "+40%", cost: { 마석: 100 },    target: "combat_atk" },
    "수호의 술통": { lv1: "-5%", max: "-40%", cost: { 강철: 300 },    target: "combat_survive" }, // 받는 피해 -X% → 생존
    "왕의 술통":   { lv1: "+3%", max: "+20%", cost: { 전설재료: 1 },  target: "all_skill", unlock: "all_statues_lv10" }
  },

  // 기부재 표기명 → 실재 state 키 (_resource_aliases). 술/전설술/유물은 특수 처리.
  aliases: { 고기: "몬스터고기", 철: "광석", 강철: "광석", 도적금화: "자금", 마석: "마석가루", 전설재료: "전설홉" }
};
