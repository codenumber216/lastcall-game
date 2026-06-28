/* ============================================================================
   Last Call — 요리·안주 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 cooking / 설계서 t28_cooking.md
   ※ 혼합(C): 안주 효과 = 전투 보조(M_atk/M_survive)·운영(만족도 baseline)·보조(XP). 값 전부 SSOT.
   ※ 제조시간 = duration_h × 3600 (양조와 동일, TIME_SCALE). 재료 전부 채집물.
   ※ 요리 너구리 펫 '안주 효과 +15%' = 장착 시 안주 value ×1.15(계정).
   ============================================================================ */
const COOKING = {
  skill: "요리",
  snack_slots: 2,                 // 비치 슬롯 2(술 버프와 별개) → 비치 안주 효과 상시
  snack_stock_penalty: 5,         // 안주 재고 0 → 만족도 -5/h
  racoon_bonus: 0.15,             // 요리 너구리 장착 → 안주 효과 ×(1+0.15)
  // effect_groups: survive→M_survive(+100%캡) / atk→M_atk(+150%캡) / satisfaction→만족도 baseline / xp→스킬 XP
  snacks: [
    { name: "구운 고기",   kind: "survive",      value: 0.05, mat: { 몬스터고기: 2 },           duration_h: 1, reqLv: 1,  effect: "생존 +5%" },
    { name: "보리빵",     kind: "satisfaction", value: 3,    mat: { 보리: 5 },                 duration_h: 1, reqLv: 5,  effect: "만족도 +3" },
    { name: "약초 무침",   kind: "survive",      value: 0.06, mat: { 약초: 8 },                 duration_h: 1, reqLv: 10, effect: "생존 +6%" },
    { name: "몬스터 스튜", kind: "survive",      value: 0.08, mat: { 몬스터고기: 3, 약초: 3 },   duration_h: 2, reqLv: 20, effect: "생존 +8%" },
    { name: "꿀 안주",     kind: "satisfaction", value: 5,    mat: { 꿀: 5 },                   duration_h: 2, reqLv: 25, effect: "만족도 +5" },
    { name: "약초 매운탕", kind: "atk",          value: 0.06, mat: { 독버섯: 2, 약초: 5 },       duration_h: 3, reqLv: 35, effect: "전투력 +6%" },
    { name: "영웅 정식",   kind: "atk",          value: 0.05, mat: { 몬스터고기: 5, 쌀: 5 },     duration_h: 3, reqLv: 40, effect: "전투력 +5%" },
    { name: "산삼 약선",   kind: "xp",           value: 0.08, mat: { 산삼: 1, 꿀: 5 },           duration_h: 3, reqLv: 50, effect: "전 스킬 XP +8%" },
    { name: "마석 구이",   kind: "atk",          value: 0.10, mat: { 마석가루: 2, 몬스터고기: 5 }, duration_h: 4, reqLv: 60, effect: "전투력 +10%" },
    { name: "거인 통구이", kind: "survive",      value: 0.12, mat: { 거인고기: 1, 보리: 10 },     duration_h: 6, reqLv: 70, effect: "생존 +12%" },
    { name: "슬라임 젤리", kind: "satisfaction", value: 8,    mat: { 슬라임정수: 1, 꿀: 8 },     duration_h: 4, reqLv: 75, effect: "만족도 +8" },
    { name: "왕의 만찬",   kind: "dual",  value: { atk: 0.08, satisfaction: 10 }, mat: { 거인고기: 2, 전설홉: 3 }, duration_h: 6, reqLv: 85, effect: "전투력 +8% · 만족도 +10" }
  ]
};
const SNACK_BY_ID = {}; COOKING.snacks.forEach(s => SNACK_BY_ID[s.name] = s);
