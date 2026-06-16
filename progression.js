/* ============================================================================
   Last Call — 성장축 데이터 (명성·주점 단계 승급) — index.html에서 <script>로 로드
   원본: lastcall_balance_data.json 의 progression_axis / reputation / core_formulas.kingdom_score_actions
   ============================================================================ */

// 주점 단계표 (progression_axis.stages). 배열 index 0 = 1단계.
//   build_cost: "시작"(문자열)=초기 / 객체=승급 비용. '명성'은 게이트(비소비), 그 외는 소비.
//   merc_slots: 그 단계에서 쓸 수 있는 용병 수(문자열 → 최댓값 사용).
const STAGES = [
  { stage: 1, name: "외상 주점",   world: 1, reputation_min: 0,     merc_slots: "1~2", fermentation_slots: 1, build_cost: "시작" },
  { stage: 2, name: "동네 명소",   world: 1, reputation_min: 0,     merc_slots: "3",   fermentation_slots: 2, build_cost: { 목재: 30, 홉: 20, 자금: 500 } },
  { stage: 3, name: "길드 주점",   world: 2, reputation_min: 1000,  merc_slots: "4~5", fermentation_slots: 3, build_cost: { 철: 50, 돌: 20, 명성: 1000 } },
  { stage: 4, name: "요새 주점",   world: 3, reputation_min: 5000,  merc_slots: "6~7", fermentation_slots: 4, build_cost: { 강철: 30, 마석: 10, 명성: 5000 } },
  { stage: 5, name: "자치 도시",   world: 4, reputation_min: 15000, merc_slots: "8~9", fermentation_slots: 5, build_cost: { 미스릴: 30, 자금: 50000 } },
  { stage: 6, name: "왕국의 심장", world: 5, reputation_min: 50000, merc_slots: "10",  fermentation_slots: 6, build_cost: { 전설홉: 50, 슬라임정수: 20, 거인고기: 10, 명성: 50000 } }
];

// 명성 등급 (reputation.tiers)
const REPUTATION_TIERS = [
  { title: "동네 주점",     min: 0,     max: 999 },
  { title: "소문난 주점",    min: 1000,  max: 4999 },
  { title: "유명 길드 주점", min: 5000,  max: 14999 },
  { title: "자치 도시",      min: 15000, max: 49999 },
  { title: "왕국의 심장",    min: 50000, max: null }
];

// 명성 획득 행동값 (reputation.gain_actions + core_formulas.kingdom_score_actions)
//   ※ 자금(funds) 획득값은 원본 경제 소스가 전투·외상회수 등 미구현이라,
//     접객/의뢰의 자금은 '주점 매출' 임시값으로 둠(플래그). 명성값은 원본 그대로.
const REP_ACTIONS = {
  serve:        { rep: 2,  per: 10, funds: 100, label: "접객(손님 10명)" }, // 손님_접객 2/명 × 10명 = 명성 +20
  order:        { rep: 20, funds: 300, label: "의뢰 완료(B티어)" },          // 의뢰_완료 B티어 = 20
  festival:     { rep: 200, funds: 0, label: "축제 개최" }                    // 축제_개최 = 200
};

// merc_slots 문자열("1~2","4~5"…)에서 최댓값 정수 추출
function stageMercSlots(stage) {
  const s = String(STAGES[stage - 1].merc_slots);
  const nums = (s.match(/\d+/g) || ["1"]).map(Number);
  return Math.max(...nums);
}
