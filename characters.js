/* ============================================================================
   Last Call — 용병(캐릭터) 로스터 (index.html에서 <script>로 불러옴)
   참조: lastcall_balance_data.json 의 mercenaries (공용 풀 최대 10), tavern_bar.brewmaster_passive

   각 용병:
     name        : 표시 이름
     brewLevel   : 양조 스킬 레벨 (1+이면 발효 슬롯 배치 가능 — assignment.who_can_brew)
     gatherLevel : 조달 스킬 레벨 (1+이면 채집 슬롯 배치 가능 — gather_slots.who_can_gather)
     brewmaster  : 술도사 클래스 여부 → 제조속도 +50% 패시브(brewmaster_passive)

   class       : 직업(추천값, 자유 전직 가능) — 표시·참고용
   gatherSkill : 주력 조달 스킬(사냥/채집/농사/원정 등) — 표시·참고용

   ※ [확정 로스터] JSON mercenaries.initial_roster(영입 시점 시작 레벨, 적성 기반)와 동일.
     보리=양조 천직(10·술도사), 콩이·도리=조달 강함. 직업은 자유 전직 가능.
   ============================================================================ */
const CHARACTERS = {
  // combatSkill/combatLevel: SSOT mercenaries.initial_roster 확정값(combat_skill/combat_lv).
  //   전투 레벨은 raid_clear_by_tier XP로 성장. 전력 환산 = combat.js combatContribution[skill][lv].
  "플레이어": { name: "플레이어", race: "선택",     class: "떠돌이 용병", brewLevel: 1,  gatherSkill: "채집", gatherLevel: 1, brewmaster: false, combatSkill: "검술", combatLevel: 4 },
  "진":       { name: "진",       race: "동양 검객", class: "검호",       brewLevel: 1,  gatherSkill: "사냥", gatherLevel: 5, brewmaster: false, combatSkill: "검술", combatLevel: 12 },
  "보리":     { name: "보리",     race: "슬라임",   class: "술도사",     brewLevel: 10, gatherSkill: "채집", gatherLevel: 5, brewmaster: true,  combatSkill: "검술", combatLevel: 1 }, // 술도사 ⭐ 제조속도 +50% / 슬라임 → 양조 폭발 0%
  "마라":     { name: "마라",     race: "이세계인", class: "약장수",     brewLevel: 1,  gatherSkill: "채집", gatherLevel: 1, brewmaster: false, combatSkill: "궁술", combatLevel: 1 },
  "도리":     { name: "도리",     race: "드워프",   class: "망치꾼",     brewLevel: 3,  gatherSkill: "농사", gatherLevel: 6, brewmaster: false, combatSkill: "검술", combatLevel: 3 },
  "셀라":     { name: "셀라",     race: "엘프",     class: "해결사",     brewLevel: 1,  gatherSkill: "원정", gatherLevel: 5, brewmaster: false, combatSkill: "궁술", combatLevel: 3 },
  "콩이":     { name: "콩이",     race: "햄스터",   class: "대마법사",   brewLevel: 1,  gatherSkill: "채집", gatherLevel: 6, brewmaster: false, combatSkill: "마법", combatLevel: 12 }
};

// 종족 패시브(mercenaries.race_passives, 미구현 12건 #4=A, 2026-07-16 수치 확정) — 그 용병 본인 단위(장착 펫과 동일 단위).
// 키=merc(캐릭터 id, race 표시문자열 아님 — 플레이어 race="선택"이라 merc로 직결). 기존 가산 그룹 합류 → 전역 캡 자동.
const RACE_PASSIVE = {
  "플레이어": { group: "xp_all",      value: 0.03, label: "전 스킬 XP +3%" },
  "셀라":     { group: "gather_rate", value: 0.05, label: "채집 효율 +5%" },
  "콩이":     { group: "gather_rate", value: 0.05, label: "채집 효율 +5%" },
  "보리":     { group: "brew_speed",  value: 0.05, label: "양조 속도 +5%" },   // 슬라임 폭발면역 0.3은 기구현 유지, 이건 추가분
  "도리":     { group: "smith_speed", value: 0.05, label: "제작 시간 -5%" },
  "진":       { group: "combat_atk",  value: 0.05, label: "전투력 +5%" },
  "마라":     { group: "rep_gain",    value: 0.05, label: "명성 획득 +5%" }
};
// 그룹별 합산(영입된 용병만, isRecruited는 index.html) — relationshipBonus와 동일 패턴(계정 단위 무조건 합산, 참여 여부 무관)
function racePassiveBonus(group) {
  let s = 0;
  for (const id in RACE_PASSIVE) { if (typeof isRecruited === "function" && isRecruited(id) && RACE_PASSIVE[id].group === group) s += RACE_PASSIVE[id].value; }
  return s;
}
