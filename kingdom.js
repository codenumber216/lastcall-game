/* ============================================================================
   Last Call — 왕국 성장(무용담·술통) 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 kingdom_systems.stamps/statues
              + _resource_aliases + _growth_readiness + core_formulas.stamp_statue_interpolation
   ※ 구현 가능 23종만(_status:"deferred" 6종 제외). 값/효과는 전부 SSOT.
   ※ combat·kingdom 무용담 9종은 SSOT에 mat_per_lv(기부 비용)가 없음 → cost:null(기부 비활성, 효과 배선은 연결).
     → 기획이 mat_per_lv 채우면 cost만 넣으면 기부 활성됨.
   target: 효과가 합산될 게임 수치 그룹. null=대상 미지정(레벨/효과 계산만, 게임 미반영).
   ============================================================================ */
const KINGDOM = {
  level_max: 20,

  // 무용담(stamps) — deferred(안주·제작·원정) 제외 14종
  stamps: {
    "양조": { lv1: "+3%", max: "+30%", cost: { 홉: 50 },  target: "brew_speed" },
    "접객": { lv1: "+3%", max: "+30%", cost: { 자금: 100 }, target: "satisfaction" },
    "경영": { lv1: "+5%", max: "+50%", cost: { 자금: 200 }, target: "funds_gain" },
    "홍보": { lv1: "+3%", max: "+30%", cost: { 자금: 150 }, target: "rep_gain" },
    "조달": { lv1: "+3%", max: "+30%", cost: { 약초: 50 }, target: "gather_rate" },
    "검술": { lv1: "+4%", max: "+35%", cost: { 광석: 40 },   target: "combat_atk" },
    "궁술": { lv1: "+4%", max: "+35%", cost: { 나무껍질: 40 }, target: "combat_atk" },
    "마법": { lv1: "+5%", max: "+40%", cost: { 마석가루: 20 }, target: "combat_atk" },
    "함정": { lv1: "+5%", max: "+40%", cost: { 독버섯: 20 },  target: "combat_atk" },
    "방어": { lv1: "+3%", max: "+25%", cost: { 광석: 50 },   target: "combat_survive" },
    "확장": { lv1: "+5%", max: "+40%", cost: { 목재: 50 },   target: null },
    "영업": { lv1: "+30분", max: "+5시간", cost: { 자금: 200 }, target: "offline" },   // "영업(오프라인)"
    "왕국": { lv1: "+5%", max: "+40%", cost: { 자금: 300 },  target: null },
    "전설": { lv1: "x1.1", max: "x2.0", cost: { 전설홉: 3 },  target: "combat_atk" }     // 곱→가산(eff-1), +150% 클립
  },

  // 술통(statues) — deferred(장인·모험·축제) 제외 9종. 전부 donate_per_lv 보유.
  statues: {
    "양조의 술통": { lv1: "+3%", max: "+30%", cost: { 술: 500 },     target: "brew_speed" },
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
