/* ============================================================================
   Last Call — 단골 카드 & 펫 도감 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 cards_and_pets
   ※ 값/효과는 전부 SSOT. deferred(카드 0·펫 2=영주의 여우·콩이의 친구)는 도감 슬롯 유지·드롭 비활성.
   ※ g/v = 효과가 합산될 가산 그룹과 값(없는 시스템 대상=null, 도감 표시만).
     그룹: gather_rate·brew_speed(생산) / combat_atk·combat_survive(전투) /
           rep_gain·funds_gain / offline / all_skill / xp_조달·xp_all
   ※ 펫 게이트는 우리 스킬모델로 매핑: 채집/벌목/낚시/농사/사냥→조달, 양조→양조,
     검술/궁술/마법/방패술/함정술→전투. 사냥늑대=사냥누적1000·끈기거북=오프라인100h 임계 확정.
     영주의 여우(엔딩 계승)는 엔딩 미구현 → deferred(엔딩 구현 시 해제).
   ============================================================================ */
const CARDS = {
  grade_dupes: { 실버: 4, 골드: 10, 플래티넘: 20 },  // dupes 임계값(보유1=일반)
  pity: { per_miss: 0.1, cap_mult: 5.0 },           // core_formulas.pity_rare_drop
  list: [
    // 손님 단골(구현 8)
    { id: "술꾼 단골", kind: "손님", effect: "술 매출 +3%",   g: "funds_gain", v: 0.03, gate: { type: "satisfaction_gauge", v: 75 } }, // t27: 만족도 게이지 75 도달(보너스합 우회 폐지·원안 복귀)
    { id: "귀족 단골", kind: "손님", effect: "고급 의뢰 +1 (예정)",  g: null, v: 0, gate: { type: "tavernStage", v: 5 } }, // 의뢰 티어/슬롯 조작 미모델 → (예정)
    { id: "모험가 단골", kind: "손님", effect: "원정 발견 +5%", g: "discovery", v: 0.05, gate: { type: "dungeon_boss" } }, // 던전 보스 클리어 획득 · discovery(expeditionRewardMult)
    { id: "음유시인 단골", kind: "손님", effect: "명성 획득 +5%", g: "rep_gain", v: 0.05, gate: { type: "음유시인_이벤트" } }, // 음유시인 특별 이벤트로 획득
    { id: "용병 단골",   kind: "손님", effect: "검술 XP +3%",  g: "xp_전투", v: 0.03, gate: { type: "customer_type", customer: "용병" } },   // 용병 손님 30명 접대
    { id: "상인 단골",   kind: "손님", effect: "자금 획득 +4%", g: "funds_gain", v: 0.04, gate: { type: "customer_type", customer: "상인" } }, // 상인 손님 30명 접대
    { id: "마법사 단골", kind: "손님", effect: "마법 XP +4%",  g: "xp_전투", v: 0.04, gate: { type: "customer_type", customer: "마법사" } }, // 마법사 손님 30명 접대
    { id: "마왕 단골", kind: "손님", effect: "전 매출 +5%",   g: "funds_gain", v: 0.05, gate: { type: "raidTier", tier: 6 } },
    // 적 카드(구현 7) — raid 티어 격퇴 시 base_rate(피티) 드롭
    { id: "좀도둑 카드",   kind: "적", effect: "전투력 +3% (함정 피해)",  g: "combat_atk", v: 0.03, gate: { type: "raidTier", tier: 1, base_rate: 0.25 } },
    { id: "도적단 카드",   kind: "적", effect: "전투력 +4% (전투 드롭)",  g: "combat_atk", v: 0.04, gate: { type: "raidTier", tier: 2, base_rate: 0.22 } },
    { id: "고블린 카드",   kind: "적", effect: "사냥 XP +5%",    g: "xp_조달", v: 0.05, gate: { type: "raidTier", tier: 3, base_rate: 0.20 } },
    { id: "오크 카드",     kind: "적", effect: "근접 피해 +5%",  g: "combat_atk", v: 0.05, gate: { type: "raidTier", tier: 3, base_rate: 0.18 } },
    { id: "용병깡패 카드", kind: "적", effect: "방어술 XP +4%",  g: "xp_전투", v: 0.04, gate: { type: "raidTier", tier: 4, base_rate: 0.18 } },
    { id: "자칭영주 카드", kind: "적", effect: "명성 획득 +5%",  g: "rep_gain", v: 0.05, gate: { type: "raidTier", tier: 5, base_rate: 0.30 } },
    { id: "마왕군 카드",   kind: "적", effect: "보스 드롭 +8% (예정)",  g: null, v: 0,    gate: { type: "raidTier", tier: 6, base_rate: 0.50 } } // 드롭률 개별 가산 미연결 → (예정)
  ],
  // 세트(전부 보유 시 발동). 일부는 deferred 카드 포함 → 현재 미완성.
  sets: [
    { name: "단골 정예", cards: ["술꾼 단골", "용병 단골", "상인 단골", "마법사 단골"], g: "funds_gain", v: 0.08 },
    { name: "주점 전설", cards: ["음유시인 단골", "귀족 단골", "모험가 단골", "마왕 단골"], g: "rep_gain", v: 0.10 },
    { name: "도적 토벌", cards: ["좀도둑 카드", "도적단 카드", "고블린 카드", "오크 카드"], g: "combat_atk", v: 0.08, label: "전투력 +8% (전투 드롭)" },
    { name: "영웅의 증명", cards: ["용병깡패 카드", "자칭영주 카드", "마왕군 카드", "모험가 단골"], g: null, v: 0, label: "보스 드롭 +15% (예정)" },
    { name: "왕국의 위엄", cards: ["마왕 단골", "마왕군 카드", "귀족 단골", "음유시인 단골"], g: "xp_all", v: 0.05 }
  ],
  // deferred 카드(획득 불가, 도감 슬롯 유지) — 개수 15 맞춤. 손님 종류 시스템(t27)으로 전부 해제
  deferred: []
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
    { id: "사냥 늑대",   specialty: "사냥", effect: "사냥 획득량 +12%", g: "gather_rate", v: 0.12, gate: { type: "gather_count", threshold: 1000 } }, // 사냥 재료 누적 1000개
    { id: "채집 다람쥐", specialty: "채집", effect: "채집 속도 +12%",   g: "gather_rate", v: 0.12, gate: { type: "skill", skill: "조달", lv: 99 } },
    { id: "벌목 비버",   specialty: "벌목", effect: "목재 획득 +15%",   g: "gather_rate", v: 0.15, gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "낚시 수달",   specialty: "낚시", effect: "낚시 산출 +15% (희귀 어종)", g: "gather_rate", v: 0.15, gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "농사 황소",   specialty: "농사", effect: "작물 성장 -15%",   g: "gather_rate", v: 0.15, gate: { type: "skill", skill: "조달", lv: 50 } },
    { id: "양조 두꺼비", specialty: "양조", effect: "발효 시간 -15%",   g: "brew_speed", v: 0.15, gate: { type: "skill", skill: "양조", lv: 99 } },
    { id: "검술 호랑이", specialty: "검술", effect: "근접 피해 +10%",   g: "combat_atk", v: 0.10, gate: { type: "skill", skill: "전투", lv: 60 } },
    { id: "궁술 매",     specialty: "궁술", effect: "원거리 피해 +10%", g: "combat_atk", v: 0.10, gate: { type: "clears", n: 50 } },
    { id: "마법 와이번", specialty: "마법", effect: "마법 피해 +15%",   g: "combat_atk", v: 0.15, gate: { type: "skill", skill: "전투", lv: 99 } },
    { id: "방패 고슴도치", specialty: "방어", effect: "습격 피해 -5%",  g: "combat_survive", v: 0.05, gate: { type: "skill", skill: "전투", lv: 70 } },
    { id: "함정 거미",   specialty: "함정", effect: "전투력 +20% (함정 피해)", g: "combat_atk", v: 0.20, gate: { type: "skill", skill: "전투", lv: 60 } },
    { id: "끈기 거북",   specialty: "범용", effect: "오프라인 효율 +5%", g: "offline", v: 0.05, gate: { type: "offline_total", threshold_h: 100 } }, // 오프라인 누적 100시간 · v=0.05(효율 +5%p, applyOffline 소비)
    { id: "황금 꿀벌",   specialty: "양조", effect: "양조 재료 -20%", g: "brew_mat", v: 0.20,        gate: { type: "dual", a: { skill: "양조", lv: 70 }, b: { skill: "조달", lv: 70 } } }, // 풍양 거품(t17 §6-4)이 brew_mat 그룹 신설 → 연쇄 해제. 상한 -50%(풍양0.15+꿀벌0.20=0.35)
    { id: "원정 군마",   specialty: "원정", effect: "원정 시간 -20%",   g: null, v: 0, gate: { type: "expedition_count", n: 30 } }, // t30: 원정 30회 완료. 시간 -20% 코드 특수 연결
    { id: "곰 용병",     specialty: "전설", effect: "전 스킬 +5%",      g: "all_skill", v: 0.05, gate: { type: "raidTier", tier: 6 } },
    { id: "접객 고양이", specialty: "접객", effect: "손님 만족 +8%",   g: null, v: 0, gate: { type: "satisfaction_gauge", v: 90 } }, // t27: 만족도 게이지 90 → baseline +8(코드 특수 연결)
    { id: "요리 너구리", specialty: "요리", effect: "안주 효과 +15%",  g: null, v: 0, gate: { type: "skill", skill: "요리", lv: 50 } }, // t28: 요리 Lv.50. '안주 효과 +15%'는 코드 특수 연결(안주 value ×1.15)
    { id: "제작 드래곤", specialty: "대장일", effect: "장비 품질 +1등급 확률", g: null, v: 0, gate: { type: "skill", skill: "대장일", lv: 80 } }, // t29: 대장일 Lv.80. 품질(등급업 확률) 코드 특수 연결
    { id: "충견 무사",   specialty: "전설", effect: "전 스킬 XP +8%",       g: "xp_all", v: 0.08, gate: { type: "relationship", char: "진", lv: 5 } }, // t04: 진 관계 Lv.5(외상 탕감 이벤트). 관계 시스템 구현으로 해제
    { id: "경영 부엉이", specialty: "경영", effect: "외상 회수 +20%",       g: "credit_recovery", v: 0.20, gate: { type: "reputation", min: 5000 } }, // credit 구현으로 해제. gate 원안 '경영 스킬'→명성 5000(유명 길드 주점, 경영 규모) 대체
    { id: "행운 토끼",   specialty: "범용", effect: "희귀 드롭 +10%",       g: "rare_drop",  v: 0.10, gate: { type: "festival_count", n: 10 } }, // t31: 축제 10회(게이트) + 희귀 드롭(효과). 축제·행운 구현으로 해제
    { id: "야행 유령",   specialty: "범용", effect: "야간 생산 +25%",       g: "night_prod", v: 0.25, gate: { type: "night_count", n: 5 } }, // t31: 밤 5회 경험(게이트). 효과=밤 조건부 생산(nightProductionBonus 특수 연결)
    { id: "소문 참새",   specialty: "홍보", effect: "명성 획득 +15%",       g: "rep_gain",   v: 0.15, gate: { type: "promo_hours", n: 50 } } // 소문내기 활동 구현으로 해제(구 '홍보 앵무' 개명). 게이트=소문내기 배치 50시간
  ],
  deferred: ["영주의 여우", "콩이의 친구"]
};

/* ── 도감 완성도 마일스톤 (SSOT completion_log.completion_basis / milestone_rule) ──
   B 확정(2026-06-27): 분모 = '현재 획득 가능' 종 수(deferred 제외) = 카드 15 + 펫 23 = 38 (현행).
   완성도% = 보유 종 수 ÷ 획득가능 종 수 × 100 (항목 1개=1 균등). 보유 판정: 카드 grade≥일반·펫 owned.
   보류 콘텐츠 해제 시 그 항목이 obtainable로 전환되며 분모·분자에 자동 합류(basis_total 재계산).
   마일스톤 보상은 도달 시 영구(%가 나중에 내려가도 회수 안 함) → state.domeMaxPct로 추적.
   - xp_all: 전 스킬 XP 보너스(비스택, 최고 도달 1구간만)
   - pet_slot: 펫 슬롯 +1(영구) / rep_mult: 명성 획득 ×배수(영구, 곱)
   - getter_mult: '전 획득량(자금·명성·재료·XP 획득)' ×배수 — power 캡(전투+150%/생산+120%)과 별개(곱)
   - title: 코스메틱(게임 수치 영향 0). 값/효과는 전부 SSOT. */
const COMPLETION = {
  basis_total: CARDS.list.length + PETS.list.length, // 획득 가능분: 카드 15 + 펫 23 = 38 (deferred 제외, 값은 항상 실배열로 재계산)
  pet_slot_at: 0.50,
  milestones: [
    { p: 0.25, label: "전 스킬 XP +2%",                  xp_all: 0.02 },
    { p: 0.50, label: "전 스킬 XP +5% · 펫 슬롯 +1",       xp_all: 0.05, pet_slot: 1 },
    { p: 0.75, label: "전 스킬 XP +10% · 명성 x1.5",       xp_all: 0.10, rep_mult: 1.5 },
    { p: 0.90, label: "전 스킬 XP +15% · 전 획득 x1.15",   xp_all: 0.15, getter_mult: 1.15 },
    { p: 1.00, label: "최종 칭호 + 전용 엔딩 (코스메틱)",   title: true }
  ]
};
