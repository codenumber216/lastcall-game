/* ============================================================================
   Last Call — 단골 카드 & 펫 도감 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 cards_and_pets
   ※ 값/효과는 전부 SSOT. deferred(카드5·펫10)는 도감 슬롯 유지·드롭 비활성.
   ※ g/v = 효과가 합산될 가산 그룹과 값(없는 시스템 대상=null, 도감 표시만).
     그룹: gather_rate·brew_speed(생산) / combat_atk·combat_survive(전투) /
           rep_gain·funds_gain / offline / all_skill / xp_조달·xp_all
   ※ 펫 게이트는 우리 스킬모델로 매핑: 채집/벌목/낚시/농사/사냥→조달, 양조→양조,
     검술/궁술/마법/방패술/함정술→전투. 매핑 불명확(사냥 누적·오프라인 누적·엔딩)은 gate:{unmapped} (자동획득 보류).
   ============================================================================ */
const CARDS = {
  grade_dupes: { 실버: 4, 골드: 10, 플래티넘: 20 },  // dupes 임계값(보유1=일반)
  pity: { per_miss: 0.1, cap_mult: 5.0 },           // core_formulas.pity_rare_drop
  list: [
    // 손님 단골(구현 3)
    { id: "술꾼 단골", kind: "손님", effect: "술 매출 +3%",   g: "funds_gain", v: 0.03, gate: { type: "satisfaction", v: 0.75 } },
    { id: "귀족 단골", kind: "손님", effect: "고급 의뢰 +1",  g: null, v: 0, gate: { type: "tavernStage", v: 5 } },
    { id: "마왕 단골", kind: "손님", effect: "전 매출 +5%",   g: "funds_gain", v: 0.05, gate: { type: "raidTier", tier: 6 } },
    // 적 카드(구현 7) — raid 티어 격퇴 시 base_rate(피티) 드롭
    { id: "좀도둑 카드",   kind: "적", effect: "함정 피해 +3%",  g: null, v: 0,    gate: { type: "raidTier", tier: 1, base_rate: 0.25 } },
    { id: "도적단 카드",   kind: "적", effect: "전투 드롭 +4%",  g: null, v: 0,    gate: { type: "raidTier", tier: 2, base_rate: 0.22 } },
    { id: "고블린 카드",   kind: "적", effect: "사냥 XP +5%",    g: "xp_조달", v: 0.05, gate: { type: "raidTier", tier: 3, base_rate: 0.20 } },
    { id: "오크 카드",     kind: "적", effect: "근접 피해 +5%",  g: "combat_atk", v: 0.05, gate: { type: "raidTier", tier: 3, base_rate: 0.18 } },
    { id: "용병깡패 카드", kind: "적", effect: "방어술 XP +4%",  g: "xp_전투", v: 0.04, gate: { type: "raidTier", tier: 4, base_rate: 0.18 } },
    { id: "자칭영주 카드", kind: "적", effect: "명성 획득 +5%",  g: "rep_gain", v: 0.05, gate: { type: "raidTier", tier: 5, base_rate: 0.30 } },
    { id: "마왕군 카드",   kind: "적", effect: "보스 드롭 +8%",  g: null, v: 0,    gate: { type: "raidTier", tier: 6, base_rate: 0.50 } }
  ],
  // 세트(전부 보유 시 발동). 일부는 deferred 카드 포함 → 현재 미완성.
  sets: [
    { name: "단골 정예", cards: ["술꾼 단골", "용병 단골", "상인 단골", "마법사 단골"], g: "funds_gain", v: 0.08 },
    { name: "주점 전설", cards: ["음유시인 단골", "귀족 단골", "모험가 단골", "마왕 단골"], g: "rep_gain", v: 0.10 },
    { name: "도적 토벌", cards: ["좀도둑 카드", "도적단 카드", "고블린 카드", "오크 카드"], g: null, v: 0 },
    { name: "영웅의 증명", cards: ["용병깡패 카드", "자칭영주 카드", "마왕군 카드", "모험가 단골"], g: null, v: 0 },
    { name: "왕국의 위엄", cards: ["마왕 단골", "마왕군 카드", "귀족 단골", "음유시인 단골"], g: "xp_all", v: 0.05 }
  ],
  // deferred 카드(획득 불가, 도감 슬롯 유지) — 개수 15 맞춤
  deferred: ["용병 단골", "상인 단골", "마법사 단골", "음유시인 단골", "모험가 단골"]
};

const PETS = {
  equip_base: 3, equip_max: 6,
  // 펫 도감 보너스(보유 종류 수). null=대상 시스템 미존재(표시만).
  collection: [
    { n: 5,  g: "xp_조달", v: 0.05 },
    { n: 10, g: null,      v: 0 },      // 운영·제작 XP — 해당 스킬 없음
    { n: 15, g: "combat_atk", v: 0.08 },
    { n: 20, g: "xp_all",  v: 0.05 },
    { n: 25, g: "xp_all",  v: 0.08 }
  ],
  list: [
    { id: "사냥 늑대",   specialty: "사냥", effect: "사냥 획득량 +12%", g: "gather_rate", v: 0.12, gate: { type: "unmapped" } }, // '사냥 누적 1000' 매핑불가
    { id: "채집 다람쥐", specialty: "채집", effect: "채집 속도 +12%",   g: "gather_rate", v: 0.12, gate: { type: "skill", skill: "조달", lv: 99 } },
    { id: "벌목 비버",   specialty: "벌목", effect: "목재 획득 +15%",   g: "gather_rate", v: 0.15, gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "낚시 수달",   specialty: "낚시", effect: "희귀 어종 +15%",   g: null, v: 0,            gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "농사 황소",   specialty: "농사", effect: "작물 성장 -15%",   g: "gather_rate", v: 0.15, gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "양조 두꺼비", specialty: "양조", effect: "발효 시간 -15%",   g: "brew_speed", v: 0.15, gate: { type: "skill", skill: "양조", lv: 99 } },
    { id: "검술 호랑이", specialty: "검술", effect: "근접 피해 +10%",   g: "combat_atk", v: 0.10, gate: { type: "skill", skill: "전투", lv: 60 } },
    { id: "궁술 매",     specialty: "궁술", effect: "원거리 피해 +10%", g: "combat_atk", v: 0.10, gate: { type: "clears", n: 50 } },
    { id: "마법 와이번", specialty: "마법", effect: "마법 피해 +15%",   g: "combat_atk", v: 0.15, gate: { type: "skill", skill: "전투", lv: 99 } },
    { id: "방패 고슴도치", specialty: "방어", effect: "습격 피해 -5%",  g: "combat_survive", v: 0.05, gate: { type: "skill", skill: "전투", lv: 70 } },
    { id: "함정 거미",   specialty: "함정", effect: "함정 피해 +20%",   g: null, v: 0,            gate: { type: "skill", skill: "전투", lv: 60 } },
    { id: "끈기 거북",   specialty: "범용", effect: "오프라인 효율 +5%", g: "offline", v: 5, gate: { type: "unmapped" } }, // '오프라인 누적' 임계값 미정
    { id: "황금 꿀벌",   specialty: "양조", effect: "술 재료 +20%",     g: null, v: 0,            gate: { type: "dual", a: { skill: "양조", lv: 70 }, b: { skill: "조달", lv: 70 } } },
    { id: "영주의 여우", specialty: "범용", effect: "명성·자금 +15%",   g: "funds_gain", v: 0.15, gate: { type: "unmapped" } }, // '엔딩 도달' 미구현
    { id: "곰 용병",     specialty: "전설", effect: "전 스킬 +5%",      g: "all_skill", v: 0.05, gate: { type: "raidTier", tier: 6 } }
  ],
  deferred: ["제작 드래곤", "요리 너구리", "접객 고양이", "경영 부엉이", "홍보 앵무", "원정 군마", "행운 토끼", "야행 유령", "충견 무사", "콩이의 친구"]
};
