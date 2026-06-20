/* ============================================================================
   Last Call — 의뢰 게시판 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 kingdom_systems.orders / 설계서 t25_order_board.md
   ※ 값은 전부 SSOT에서 옮김(임의 생성 금지). 생성은 example_orders를 '확정 템플릿 풀'로 추첨.
     drink_any_delivery·reputation_reach는 SSOT에 예시 템플릿(수량/delta)이 없어 엔진은 지원하나
     현재 생성되지 않음 — 기획에 값 추가 시 templates에 넣으면 자동 생성됨.
   ============================================================================ */
const ORDERS = {
  count_per_week: 5,                 // 주간 게시 건수
  refresh_game_hours: 168,           // 주(週) = 168 인게임시간마다 5건 전부 갱신

  tier_unlock_stage: { C: 1, B: 1, A: 3, S: 4, SS: 6 },
  tier_weights_by_stage: {
    1: { C: 70, B: 30 },
    2: { C: 55, B: 45 },
    3: { C: 30, B: 40, A: 30 },
    4: { C: 15, B: 35, A: 35, S: 15 },
    5: { B: 20, A: 35, S: 30, SS: 15 },
    6: { A: 25, S: 40, SS: 35 }
  },
  reward_by_tier: {
    C:  { funds: 200,   rep: 10 },
    B:  { funds: 500,   rep: 20 },
    A:  { funds: 1500,  rep: 50,  material: { 마석가루: 3 } },
    S:  { funds: 5000,  rep: 120, material: { 전설홉: 5 } },
    SS: { funds: 15000, rep: 300, material: { 거인고기: 2 } }
  },
  // 동일 템플릿(type+대상) 누적 완료 횟수 → 보상 전체 곱. 구간 최대(내림차순 조회).
  repeat_bonus: [
    { count: 30, mult: 3 },
    { count: 15, mult: 2.5 },
    { count: 7,  mult: 2 },
    { count: 3,  mult: 1.5 }
  ],

  // 의뢰 템플릿 풀 = SSOT example_orders (확정 값). 티어 추첨 후 그 티어 템플릿에서 무작위.
  templates: [
    { tier: "C",  type: "drink_delivery",    drinkId: "보리맥주",     qty: 5 },
    { tier: "C",  type: "material_delivery", material: "약초",        qty: 20 },
    { tier: "B",  type: "drink_delivery",    drinkId: "화끈한증류주", qty: 8 },
    { tier: "A",  type: "drink_delivery",    drinkId: "용기의에일",   qty: 6 },
    { tier: "A",  type: "raid_clears",       n: 3 },
    { tier: "S",  type: "drink_delivery",    drinkId: "보리의정수",   qty: 2 },
    { tier: "SS", type: "drink_delivery",    drinkId: "왕국의축배",   qty: 1 }
  ]
};
