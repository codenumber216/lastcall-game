/* ============================================================================
   Last Call — 비밀 양조 가마솥(연금술) 데이터 & 로직 (index.html <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 signature_alchemy_cauldron / 설계서 t17_alchemy_cauldron.md

   핵심(IdleOn 가마솥 버블):
     · 거품(버블) = 영구 패시브 가산 버프. 재료를 부어 '즉시' 레벨업(타이머·용병 미점유).
     · 효과(Lv) = per_level × Lv (가산). 기존 전역 가산 그룹(무용담·펫·카드와 동일)에 합산 →
       전역 캡(전투 +150% / 생산 +120% / 증류 샘플 90%)에서 자동 클리핑.
     · 레벨업 비용 = base_qty × floor(1.15^Lv) (지수 증가로 페이싱). 레벨 무한.
     · 가마솥 해금 = 주점 단계 도달(World2→3단계 · World3→4단계 · World4→5단계).

   레벨형 거품 15종 확정(구 "보류 1종(융합)" 표기는 폐기 — 융합은 §6대로 하단 FUSION 블록에 별도 구현,
   레벨 없는 보유형이라 bubbles 배열에 안 넣음). 외상(credit)·시간(offline)·행운(희귀드롭 t31)은 배선 완료.
   물약(vial, t17 §5)은 VIALS 블록으로 구현 완료. 거품 합성(fusion, t17 §6)은 FUSION 블록으로 구현 완료.
   ============================================================================ */
const ALCHEMY = {
  cost_growth: 1.15,
  cauldrons: [
    { color: "빨강", icon: "🔴", domain: "전투", stage_min: 3 },   // World 2
    { color: "초록", icon: "🟢", domain: "조달", stage_min: 3 },   // World 2
    { color: "파랑", icon: "🔵", domain: "운영", stage_min: 4 },   // World 3
    { color: "노랑", icon: "🟡", domain: "범용", stage_min: 5 }    // World 4
  ],
  // group = 기존 라이브 가산 그룹 / distill_sample = signature_distillery.sample_ratio(90%캡)
  bubbles: [
    { id: "취권",   cauldron: "빨강", group: "combat_atk",     perLv: 0.005, base: { 광석: 5 },       effect: "근접(검술) 피해" },
    { id: "명사수", cauldron: "빨강", group: "combat_atk",     perLv: 0.005, base: { 나무껍질: 5 },   effect: "원거리(궁술) 피해" },
    { id: "폭주",   cauldron: "빨강", group: "combat_atk",     perLv: 0.006, base: { 마석가루: 3 },   effect: "마법 피해" },
    { id: "철벽",   cauldron: "빨강", group: "combat_survive", perLv: 0.003, base: { 광석: 5 },       effect: "받는 피해 감소" },
    { id: "풍년",   cauldron: "초록", group: "gather_rate",    perLv: 0.005, base: { 약초: 5 },       effect: "채집 획득량" },
    { id: "사냥꾼", cauldron: "초록", group: "gather_rate",    perLv: 0.005, base: { 몬스터고기: 5 }, effect: "조달 산출" },
    { id: "발효",   cauldron: "초록", group: "brew_speed",     perLv: 0.004, base: { 홉: 5 },         effect: "양조 속도" },
    { id: "증류",   cauldron: "초록", group: "distill_sample", perLv: 0.002, base: { 약수: 5 },       effect: "증류탑 샘플 비율" },
    { id: "입소문", cauldron: "파랑", group: "rep_gain",       perLv: 0.005, base: { 꿀: 5 },         effect: "명성 획득" },
    { id: "황금",   cauldron: "파랑", group: "funds_gain",     perLv: 0.004, base: { 작물: 5 },       effect: "자금 획득" },
    { id: "환대",   cauldron: "파랑", group: "satisfaction",   perLv: 0.004, base: { 포도: 5 },       effect: "손님 만족", pctPoint: true },
    { id: "외상",   cauldron: "파랑", group: "credit_recovery", perLv: 0.03,  base: { 꿀: 5 },         effect: "외상 회수 속도" },
    { id: "만물",   cauldron: "노랑", group: "xp_all",         perLv: 0.003, base: { 쌀: 5 },         effect: "전 스킬 XP" },
    { id: "시간",   cauldron: "노랑", group: "offline_min",    perLv: 3,     base: { 약수: 5 },       effect: "오프라인 시간", min: true },   // offlineExtendHours가 분으로 소비
    { id: "행운",   cauldron: "노랑", group: "rare_drop",       perLv: 0.004, base: { 꿀: 5 },         effect: "희귀 드롭" }   // tickGathering 희귀재료 배수(luckBonus)
    // 융합 거품(레벨 없는 보유형 4종)은 이 배열 밖 FUSION 블록에 별도 구현(t17 §6)
  ]
};
const CAULDRON_BY_COLOR = {}; ALCHEMY.cauldrons.forEach(c => CAULDRON_BY_COLOR[c.color] = c);
const BUBBLE_BY_ID = {}; ALCHEMY.bubbles.forEach(b => BUBBLE_BY_ID[b.id] = b);

/* ── 상태/헬퍼 ─────────────────────────────────────────────────────────────── */
function alchemyCauldronUnlocked(color) { const c = CAULDRON_BY_COLOR[color]; return c && state.tavernStage >= c.stage_min; }
function bubbleLevel(id) { return (state.alchemy && state.alchemy.bubbles[id]) || 0; }
function bubbleCost(b, lv) {                                   // lv→lv+1 비용 = base × floor(1.15^lv) × (시공 거품 -15%, floor·최소1)
  const mult = Math.floor(Math.pow(ALCHEMY.cost_growth, lv));
  const fc = fusionOwned("시공 거품") ? 0.85 : 1;   // t17 §6 hook: bubble_cost_mult
  const out = {}; for (const m in b.base) out[m] = Math.max(1, Math.floor(b.base[m] * mult * fc)); return out;
}
function alchemyCostText(cost) { return Object.entries(cost).map(([k, v]) => `${k} ${v}`).join("·"); }
function bubbleEffectPct(b, lv) { return b.perLv * lv * 100; }
function bubbleEffectText(b, lv) {
  if (b.min) return `+${Math.round(b.perLv * lv)}분`;   // 시간 거품: 오프라인 분
  return `+${bubbleEffectPct(b, lv).toFixed(1)}${b.pctPoint ? "%p" : "%"}`;
}
function bubbleCanPay(cost) { for (const m in cost) if ((state.materials[m] || 0) < cost[m]) return false; return true; }
function bubblePay(cost) { for (const m in cost) state.materials[m] = (state.materials[m] || 0) - cost[m]; }

function levelUpBubble(id) {
  const b = BUBBLE_BY_ID[id]; if (!b) return;
  if (!alchemyCauldronUnlocked(b.cauldron)) { log(`${CAULDRON_BY_COLOR[b.cauldron].domain} 가마솥이 아직 해금되지 않았습니다.`); render(); return; }
  const lv = bubbleLevel(id), cost = bubbleCost(b, lv);
  if (!bubbleCanPay(cost)) { log(`${id} 거품 레벨업 재료 부족: ${alchemyCostText(cost)}`); render(); return; }
  bubblePay(cost); state.alchemy.bubbles[id] = lv + 1;
  log(`⚗️ ${id} 거품 Lv.${lv + 1} — ${b.effect} ${bubbleEffectText(b, lv + 1)}.`);
  render();
}

// 효과 그룹 가산 합(활성 거품만). 캡은 각 소비처(Math.min)에서 이미 적용됨.
function cauldronBonus(group) {
  const bb = state.alchemy && state.alchemy.bubbles; if (!bb) return 0;
  let s = 0;
  for (const b of ALCHEMY.bubbles) { if (b.group !== group) continue; const lv = bb[b.id] || 0; if (lv > 0) s += b.perLv * lv; }
  return s;
}

/* ── 물약(특제주) — t17 §5 확정(2026-07-16). SSOT: signature_alchemy_cauldron.vials + mercenaries.stats_connection.
   거품과 동일 얼개(즉시·무타이머·용병 미점유). 재료 1개 투하 → 누적. 누적 5/20/50에서 실버/골드/플래티넘(교체 상승, 비누적).
   해금 = 주점 5단계(자치 도시, 노랑 가마솥과 동일). ============================================================ */
const VIALS = {
  unlock_stage: 5,
  grade_stat_points: { 실버: 5, 골드: 10, 플래티넘: 15 },        // 등급→스탯 pt(교체, 비누적)
  grade_cost_cumulative: { 실버: 5, 골드: 20, 플래티넘: 50 },     // 그 물약 재료 누적 투하량
  list: [
    { name: "곰의 정력주",     stat: "STR", statLabel: "완력", material: "곰의정수" },
    { name: "매의 눈 증류액",  stat: "DEX", statLabel: "재간", material: "매의깃털" },
    { name: "현자의 물",       stat: "INT", statLabel: "지력", material: "현자의결정" },
    { name: "거인의 피",       stat: "VIT", statLabel: "맷집", material: "거인고기" },
    { name: "입담 비약",       stat: "CHA", statLabel: "넉살", material: "악사의악보" }
  ]
};
const VIAL_BY_NAME = {}; VIALS.list.forEach(v => VIAL_BY_NAME[v.name] = v);
// 스탯→소비 그룹 매핑(mercenaries.stats_connection.mapping). per_point 0.01 고정(스탯 1pt = 그룹 +1%p).
const STAT_GROUP = { STR: "combat_atk", DEX: "gather_rate", INT: "xp_all", VIT: "combat_survive", CHA: "rep_gain" };

function vialCount(name) { return (state.vials && state.vials[name]) || 0; }
function vialGradeForCount(c) {
  if (c >= VIALS.grade_cost_cumulative.플래티넘) return "플래티넘";
  if (c >= VIALS.grade_cost_cumulative.골드) return "골드";
  if (c >= VIALS.grade_cost_cumulative.실버) return "실버";
  return null;
}
function vialGrade(name) { return vialGradeForCount(vialCount(name)); }
function vialsUnlocked() { return state.tavernStage >= VIALS.unlock_stage; }
// 스탯 pt × 0.01을 그룹에 가산(무용담·펫·거품·망토·마스터리와 동일 그룹 → 전역 캡 자동 클리핑). 신규 캡 불요.
function statBonus(group) {
  let s = 0;
  for (const k in STAT_GROUP) if (STAT_GROUP[k] === group) s += ((state.stats && state.stats[k]) || 0) * 0.01;
  return s;
}
// 물약에 재료 1개 투하 → 누적 +1 → 등급 재계산 → state.stats[stat] 교체(비누적) 반영.
function dropVial(vialName) {
  const v = VIAL_BY_NAME[vialName]; if (!v) return;
  if (!vialsUnlocked()) { log(`특제주는 주점 ${VIALS.unlock_stage}단계(자치 도시)부터 만들 수 있습니다.`); render(); return; }
  if ((state.materials[v.material] || 0) < 1) { log(`${v.material} 재료가 부족합니다.`); render(); return; }
  const prevGrade = vialGrade(vialName);
  state.materials[v.material] -= 1;
  state.vials[vialName] = (state.vials[vialName] || 0) + 1;
  const newGrade = vialGrade(vialName);
  state.stats[v.stat] = newGrade ? VIALS.grade_stat_points[newGrade] : 0;   // 교체 상승(비누적)
  if (newGrade !== prevGrade) log(`⚗️ ${vialName} — ${newGrade} 등급! (${v.statLabel} +${VIALS.grade_stat_points[newGrade]}, ${GROUP_LABEL[STAT_GROUP[v.stat]] || STAT_GROUP[v.stat]} +${VIALS.grade_stat_points[newGrade]}%)`);
  else log(`⚗️ ${vialName} 투하 (${v.material} -1) — 누적 ${state.vials[vialName]}`);
  render();
}

/* ── 융합 거품(거품 합성 메타) — t17 §6 확정(2026-07-16). SSOT: signature_alchemy_cauldron.fusion.
   가마솥별 고정 조합 1개씩(총 4종). 원료 거품 2종 각 Lv.50+ && 비용 충족 → 합성(100% 성공, 원료 레벨 비소비).
   레벨 없는 보유형(1회·영구). 효과는 전부 질적/곱연산 — 전역 캡(가산 그룹) 미참여. ==================== */
const FUSION = {
  recipes: [
    { id: "광전사 거품", cauldron: "빨강", sources: ["취권", "명사수"], sourceLv: 50, cost: { 자금: 20000, 마석가루: 50 }, effect: "습격 격퇴·던전 클리어 보상(자금·재료) ×1.25" },
    { id: "풍양 거품",   cauldron: "초록", sources: ["풍년", "발효"],   sourceLv: 50, cost: { 자금: 20000, 전설홉: 10 }, effect: "양조 재료 소비 -15%" },
    { id: "금고 거품",   cauldron: "파랑", sources: ["황금", "입소문"], sourceLv: 50, cost: { 자금: 20000, 유물: 5 },   effect: "의뢰 보상(자금·명성) ×1.2" },
    { id: "시공 거품",   cauldron: "노랑", sources: ["시간", "만물"],   sourceLv: 50, cost: { 자금: 20000, 산삼: 10 },  effect: "거품 레벨업 비용 -15%" }
  ]
};
const FUSION_BY_ID = {}; FUSION.recipes.forEach(f => FUSION_BY_ID[f.id] = f);

function fusionOwned(id) { return !!(state.alchemy && state.alchemy.fused && state.alchemy.fused[id]); }
function fusionSourcesReady(f) { return f.sources.every(s => bubbleLevel(s) >= f.sourceLv); }
function fusionCanPay(cost) { for (const m in cost) { const have = m === "자금" ? state.funds : (state.materials[m] || 0); if (have < cost[m]) return false; } return true; }
function fusionPay(cost) { for (const m in cost) { if (m === "자금") state.funds -= cost[m]; else state.materials[m] = (state.materials[m] || 0) - cost[m]; } }
function fuseBubble(id) {
  const f = FUSION_BY_ID[id]; if (!f) return;
  if (!alchemyCauldronUnlocked(f.cauldron)) { log(`${CAULDRON_BY_COLOR[f.cauldron].domain} 가마솥이 아직 해금되지 않았습니다.`); render(); return; }
  if (fusionOwned(id)) { log(`이미 ${id}을(를) 보유 중입니다.`); render(); return; }
  if (!fusionSourcesReady(f)) { log(`${id} 합성 조건 미충족: ${f.sources.join("·")} 각 Lv.${f.sourceLv} 필요.`); render(); return; }
  if (!fusionCanPay(f.cost)) { log(`${id} 합성 재료 부족: ${alchemyCostText(f.cost)}`); render(); return; }
  fusionPay(f.cost);
  state.alchemy.fused[id] = true;
  log(`⚗️✨ ${id} 합성 성공! ${f.effect}`);
  render();
}

// 소비처 훅(t17 §6-2). 전부 곱연산·질적 — 가산 그룹 아님(전역 캡 미참여).
function fusionLootMult() { return fusionOwned("광전사 거품") ? 1.25 : 1; }      // 습격·던전 자금·재료(명성 제외)
function fusionOrderMult() { return fusionOwned("금고 거품") ? 1.2 : 1; }        // 의뢰 자금·명성
// 양조 재료 절감 그룹(brew_mat) — 풍양 거품(0.15) + 황금 꿀벌 펫(0.20, equippedPetBonusAll) 가산, 상한 0.50
function brewMatSaving() { return Math.min(0.50, (fusionOwned("풍양 거품") ? 0.15 : 0) + equippedPetBonusAll("brew_mat")); }
