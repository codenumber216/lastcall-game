/* ============================================================================
   Last Call — 장비(무기·방어구·세트) 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 equipment / 설계서 t26_equipment.md
   ※ 도감 카탈로그는 생성형: 무기 5계열×5등급=25 + 방어구 3종×5등급=15 + 세트 7×4부위=28 = 68.
   ※ 값은 전부 SSOT. SSOT 미정 2건 → 0(기획 리포트): 장신구 등급별 %·방패 피해감소.
   ※ 세트 피스 효과: 그룹이 명확한 것만 가산 그룹에 매핑(불명확=g:null, 도감/세트 표시만).
     던전 드롭만 활성(제작=대장일 보류). 장착=용병 단위 / 도감=계정 단위.
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

  // 던전 세트 (dungeon_sets). 피스 효과 → 가산 그룹 매핑(명확한 것만, 불명확=g:null).
  sets: [
    { name: "쥐꼬리 세트", dungeon: "하수도",     grade: "일반", pc2: { label: "사냥 +5%",      g: "gather_rate",   v: 0.05 }, pc4: { label: "채집 +10%",       g: "gather_rate",   v: 0.10 } },
    { name: "거미줄 세트", dungeon: "거미 동굴",   grade: "고급", pc2: { label: "궁술 +5%",      g: "combat_atk",    v: 0.05 }, pc4: { label: "선제 사격 +30%",  g: null,            v: 0 } },
    { name: "도적 세트",   dungeon: "도적 소굴",   grade: "고급", pc2: { label: "전투 드롭 +5%", g: null,            v: 0 },    pc4: { label: "함정 피해 +20%",  g: null,            v: 0 } },
    { name: "망자 세트",   dungeon: "폐허 무덤",   grade: "희귀", pc2: { label: "마법 +8%",      g: "combat_atk",    v: 0.08 }, pc4: { label: "언데드 추가 피해", g: null,           v: 0 } },
    { name: "용비늘 세트", dungeon: "용의 둥지",   grade: "영웅", pc2: { label: "방어 +10%",     g: "combat_survive", v: 0.10 }, pc4: { label: "화염 면역",       g: null,           v: 0 } },
    { name: "마계 세트",   dungeon: "마계 입구",   grade: "영웅", pc2: { label: "전 전투력 +8%", g: "combat_atk",    v: 0.08 }, pc4: { label: "보스 추가 피해",  g: null,            v: 0 } },
    { name: "마왕성 세트", dungeon: "마왕성 심층", grade: "전설", pc2: { label: "전 스킬 +5%",   g: "all_skill",     v: 0.05 }, pc4: { label: "전설 효과(최강)", g: null,            v: 0 } }
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
  if (it.slot === "무기" && it.line === "방패") return EQUIPMENT.shield_survive_by_grade[it.grade]; // 0(미정)
  return 0;
}
function equipItemAccessoryAtk(it) {     // 장신구 % 공격(M_atk)
  return (it && it.slot === "장신구") ? EQUIPMENT.accessory_atk_by_grade[it.grade] : 0;  // 0(미정)
}
