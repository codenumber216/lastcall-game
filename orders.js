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

  // 생성 공식(SSOT kingdom_systems.orders.generation): 티어→type→대상/수량(범위 균등) 추첨.
  // 모든 술/재료 키는 코드 식별자와 일치(공백 없음, NFC). example_orders는 샘플이라 출제 소스에서 제외.
  generation: {
    by_tier: {
      C: {
        types: ["drink_delivery", "material_delivery", "drink_any_delivery"],
        drink_pool: ["보리맥주", "싸구려와인", "어부의탁배기", "농부의막걸리", "나무꾼의송진주", "광부의철맥주"],
        drink_qty: { min: 4, max: 8 },
        material_pool: ["홉", "작물", "약초", "생선", "나무껍질", "광석", "보리", "쌀", "목재"],
        material_qty: { min: 15, max: 30 },
        any_qty: { min: 8, max: 14 }
      },
      B: {
        types: ["drink_delivery", "material_delivery", "drink_any_delivery"],
        drink_pool: ["화끈한증류주", "용기의에일", "수련자의청주", "풍요의탁주", "보리맥주", "싸구려와인"],
        drink_qty: { min: 6, max: 10 },
        material_pool: ["홉", "작물", "약초", "생선", "나무껍질", "광석", "보리", "쌀", "꿀", "약수", "몬스터고기"],
        material_qty: { min: 25, max: 45 },
        any_qty: { min: 12, max: 20 }
      },
      A: {
        types: ["drink_delivery", "material_delivery", "raid_clears"],
        drink_pool: ["화끈한증류주", "용기의에일", "함정꾼의독주", "수련자의청주", "도사의곡차", "풍요의탁주"],
        drink_qty: { min: 5, max: 8 },
        material_pool: ["꿀", "약수", "몬스터고기", "독버섯", "마석가루", "산삼"],
        material_qty: { min: 10, max: 20 },
        raid_n: { min: 2, max: 4 }
      },
      S: {
        types: ["drink_delivery", "raid_clears", "reputation_reach"],
        drink_pool: ["함정꾼의독주", "도사의곡차", "영웅의폭탄주", "회복의약주", "거인의흑맥주"],
        drink_qty: { min: 3, max: 6 },
        raid_n: { min: 4, max: 7 },
        rep_delta: { min: 1500, max: 3000 }
      },
      SS: {
        types: ["drink_delivery", "raid_clears", "reputation_reach"],
        drink_pool: ["거인의흑맥주", "보리의정수", "왕국의축배"],
        drink_qty: { min: 1, max: 3 },
        raid_n: { min: 8, max: 12 },
        rep_delta: { min: 4000, max: 8000 }
      }
    }
  }
};
