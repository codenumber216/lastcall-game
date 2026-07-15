/* ============================================================================
   Last Call — 장비(무기·방어구·세트) 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 equipment / 설계서 t26_equipment.md
   ※ 도감 카탈로그는 생성형: 무기 5계열×5등급=25 + 방어구 3종×5등급=15 + 세트 7×4부위=28 = 68.
   ※ 값은 전부 SSOT(장신구 %·방패 피해감소 확정: t29). 세트 피스는 그룹 명확한 것만 매핑(불명확=g:null).
     획득: 던전 드롭(무작위·세트) + 대장일 제작(지정, smithing t29) 공존. 장착=용병 단위 / 도감=계정 단위.
   ============================================================================ */
const EQUIPMENT = {
  slots: ["무기", "갑옷", "투구", "장신구"],
  grades: ["일반", "고급", "희귀", "영웅", "전설"],
  weapon_lines: {
    "검":    { skill: "검술",   mult: 1.0 },
    "활":    { skill: "궁술",   mult: 0.9 },
    "지팡이": { skill: "마법",   mult: 0.95 },
    "방패":  { skill: "방패술", mult: 0.6, also_armor: true },
    "함정구": { skill: "함정술", mult: 0.8 }
  },
  weapon_power_by_grade: { 일반: 40, 고급: 90, 희귀: 180, 영웅: 260, 전설: 350 },
  armor_reduce_by_grade: {
    갑옷: { 일반: 0.04, 고급: 0.07, 희귀: 0.10, 영웅: 0.13, 전설: 0.16 },
    투구: { 일반: 0.02, 고급: 0.035, 희귀: 0.05, 영웅: 0.065, 전설: 0.08 }
  },
  // SSOT 확정(t29): 장신구 공격 % → M_atk(+150%캡) / 방패 피해감소 → M_survive(+100%캡)
  accessory_atk_by_grade: { 일반: 0.02, 고급: 0.035, 희귀: 0.05, 영웅: 0.065, 전설: 0.08 },   // 장신구 M_atk %
  shield_survive_by_grade: { 일반: 0.03, 고급: 0.05, 희귀: 0.07, 영웅: 0.09, 전설: 0.11 },   // 방패 피해감소(also_armor, 무기 전투력 ×0.6도 별도)

  // 던전 세트 (dungeon_sets). 피스 효과 → 전부 가산 그룹 매핑(QA SSOT 확정 2026-07-04).
  //   조건부 효과(언데드/보스/화염 특효)는 v1에서 무조건 combat_atk/survive로 근사(적 종족·속성 미모델).
  //   라벨은 '실제 수치 (원안 플레이버)'로 표기해 오해 방지.
  //   legendary = 그 던전 100회 클리어 시 전설 변형(t26 §6.5, equipment.legendary_transform). base×~1.5.
  //   mercSetBonus에서 setLegendary(세트명)이면 pc2/pc4 대신 이 값 사용(그룹 g 동일 → 전역 캡 그대로).
  sets: [
    { name: "쥐꼬리 세트", dungeon: "하수도",     grade: "일반", pc2: { label: "조달 +5%",              g: "gather_rate",    v: 0.05 }, pc4: { label: "조달 +10%",              g: "gather_rate",    v: 0.10 }, legendary: { pc2: 0.08, pc4: 0.15 } },
    { name: "거미줄 세트", dungeon: "거미 동굴",   grade: "고급", pc2: { label: "전투력 +5% (궁술)",     g: "combat_atk",     v: 0.05 }, pc4: { label: "전투력 +12% (선제 사격)", g: "combat_atk",     v: 0.12 }, legendary: { pc2: 0.08, pc4: 0.18 } },
    { name: "도적 세트",   dungeon: "도적 소굴",   grade: "고급", pc2: { label: "전투력 +5% (전투 드롭)", g: "combat_atk",    v: 0.05 }, pc4: { label: "전투력 +12% (함정 피해)", g: "combat_atk",     v: 0.12 }, legendary: { pc2: 0.08, pc4: 0.18 } },
    { name: "망자 세트",   dungeon: "폐허 무덤",   grade: "희귀", pc2: { label: "전투력 +8% (마법)",     g: "combat_atk",     v: 0.08 }, pc4: { label: "전투력 +15% (언데드 특효)", g: "combat_atk",   v: 0.15 }, legendary: { pc2: 0.12, pc4: 0.22 } },
    { name: "용비늘 세트", dungeon: "용의 둥지",   grade: "영웅", pc2: { label: "피해 감소 +10% (방어)", g: "combat_survive", v: 0.10 }, pc4: { label: "피해 감소 +15% (화염 면역)", g: "combat_survive", v: 0.15 }, legendary: { pc2: 0.15, pc4: 0.22 } },
    { name: "마계 세트",   dungeon: "마계 입구",   grade: "영웅", pc2: { label: "전투력 +8%",           g: "combat_atk",     v: 0.08 }, pc4: { label: "전투력 +18% (보스 특효)", g: "combat_atk",     v: 0.18 }, legendary: { pc2: 0.12, pc4: 0.26 } },
    { name: "마왕성 세트", dungeon: "마왕성 심층", grade: "전설", pc2: { label: "전 스킬 +5%",          g: "all_skill",      v: 0.05 }, pc4: { label: "전 스킬 +10% (전설)",     g: "all_skill",      v: 0.10 }, legendary: { pc2: 0.08, pc4: 0.15 } }
  ]
};

// ── 도감 카탈로그(68종) 생성: 무기25 + 방어구15(갑옷·투구·장신구) + 세트28 ──
const EQUIP_CATALOG = (() => {
  const list = [];
  for (const line in EQUIPMENT.weapon_lines) for (const g of EQUIPMENT.grades)
    list.push({ id: `${g} ${line}`, kind: "weapon", slot: "무기", grade: g, line });
  for (const type of ["갑옷", "투구", "장신구"]) for (const g of EQUIPMENT.grades)
    list.push({ id: `${g} ${type}`, kind: "armor", slot: type, grade: g, type });
  EQUIPMENT.sets.forEach(s => EQUIPMENT.slots.forEach(slot =>
    list.push({ id: `${s.name} ${slot}`, kind: "set", slot, grade: s.grade, set: s.name })));
  return list;
})();
const EQUIP_BY_ID = {}; EQUIP_CATALOG.forEach(it => EQUIP_BY_ID[it.id] = it);
const EQUIP_SET_BY_DUNGEON = {}; EQUIPMENT.sets.forEach(s => EQUIP_SET_BY_DUNGEON[s.dungeon] = s);

// ── 아이템 전투 스탯 (순수 함수) ──
function equipItemPower(it) {            // 무기 전투력(플랫 P_base 가산)
  if (!it || it.slot !== "무기") return 0;
  if (it.kind === "set") return EQUIPMENT.weapon_power_by_grade[it.grade];   // 세트 무기: 등급 기본(계열 mult 1.0)
  return EQUIPMENT.weapon_power_by_grade[it.grade] * EQUIPMENT.weapon_lines[it.line].mult;
}
function equipItemSurvive(it) {          // 갑옷·투구·방패 피해감소(M_survive)
  if (!it) return 0;
  if (it.slot === "갑옷") return EQUIPMENT.armor_reduce_by_grade.갑옷[it.grade];
  if (it.slot === "투구") return EQUIPMENT.armor_reduce_by_grade.투구[it.grade];
  if (it.slot === "무기" && it.line === "방패") return EQUIPMENT.shield_survive_by_grade[it.grade]; // 방패 also_armor(t29 확정)
  return 0;
}
function equipItemAccessoryAtk(it) {     // 장신구 % 공격(M_atk)
  return (it && it.slot === "장신구") ? EQUIPMENT.accessory_atk_by_grade[it.grade] : 0;  // 장신구 M_atk(t29 확정)
}
