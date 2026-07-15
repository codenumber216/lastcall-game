/* ============================================================================
   Last Call — 명예의 망토(스킬 Lv.99 케이프) 데이터 & 로직 (index.html <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 signature_cloaks / 설계서 t18_legendary_cloaks.md

   핵심(Melvor 스킬케이프):
     · 게임 스킬 = 6트랙(양조/조달/전투/요리/대장일/원정, state.skills). 원안 18스킬은 통합.
     · 트랙 Lv.99 달성 시 그 망토 자동 획득(폴링) → 계정 영구 활성(장착 관리 없음, 상시 퍽).
     · 효과: 그룹 가산(전투/원정) 또는 특수 훅(양조 2병·조달 배수·안주·품질).

   구현 6종 + 전설 승급 6종 + 만능 망토(t33 마스터리 연쇄). 보류: 18개 세부 망토(트랙 통합)·
   접객/경영/소문내기 망토(레벨 트랙 아님).
   ============================================================================ */
const CLOAKS = {
  unlock_skill_level: 99,
  list: [
    { track: "양조",   name: "술도사의 앞치마", effect: "술 2병 생산 확률 +30%",   hook: "brew_double",   value: 0.30,
      legendary: { name: "불멸의 술도사 앞치마", effect: "2병 생산 확률 +50%(전설)", value: 0.50 } },   // t33 legendary_effects.양조 "3병 생산(2병 확률+50%)" → 확률 수치로 구현(라벨은 실제 수치)
    { track: "조달",   name: "조달왕의 망토",   effect: "채집 산출 ×1.3",          hook: "gather_mult",   value: 0.30,
      legendary: { name: "불멸의 조달왕 망토", effect: "채집 산출 ×1.5(전설)", value: 0.50 } },
    { track: "전투",   name: "검성의 망토",     effect: "전투력 +25%",             group: "combat_atk",   value: 0.25,
      legendary: { name: "불멸의 검성 망토", effect: "전투력 +40%(전설)", value: 0.40 } },
    { track: "요리",   name: "명요리사 앞치마", effect: "안주 효과 +50%",          hook: "snack_mult",    value: 0.50,
      legendary: { name: "불멸의 명요리사 앞치마", effect: "안주 효과 +80%(전설)", value: 0.80 } },
    { track: "대장일", name: "대장장이 앞치마", effect: "제작 품질 +1등급 보장",    hook: "smith_quality", value: 1.0,
      legendary: { name: "불멸의 대장장이 앞치마", effect: "제작 품질 +2등급 보장(전설)" } },
    { track: "원정",   name: "원정가의 망토",   effect: "원정 보상 +30%",          group: "discovery",    value: 0.30,
      legendary: { name: "불멸의 원정가 망토", effect: "원정 보상 +50%(전설)", value: 0.50 } }
  ]
};
const CLOAK_BY_TRACK = {}; CLOAKS.list.forEach(c => CLOAK_BY_TRACK[c.track] = c);

function cloakOwned(track) { return !!(state.cloaks && state.cloaks.owned && state.cloaks.owned[track]); }
function cloakLegendary(track) { return !!(state.cloaks && state.cloaks.legendary && state.cloaks.legendary[track]); }   // t33: maxTrackLv>=99(=cloakOwned)&&masteryPct>=100
// 만능 망토(전 6트랙 전설): all_skill 그룹에만 +0.15. 소비처(gatherSkillBonus·brewSpeedBonus·combatAtkMult)에서 all_skill 합산 시 호출.
function cloakOmniBonus(group) { return (state.cloaks && state.cloaks.omni && group === "all_skill") ? 0.15 : 0; }

// 그룹 가산(전투력 combat_atk / 원정보상 discovery) — 소유 망토만(전설 승급 시 강화값). 캡은 각 소비처에서 적용.
function cloakBonus(group) {
  const ow = state.cloaks && state.cloaks.owned; if (!ow) return 0;
  let s = 0; for (const c of CLOAKS.list) if (c.group === group && ow[c.track]) s += cloakLegendary(c.track) ? c.legendary.value : c.value; return s;
}
// 특수 훅(전설 승급 시 legendary.value로 교체)
function cloakBrewDoubleChance() { return cloakOwned("양조") ? (cloakLegendary("양조") ? CLOAK_BY_TRACK["양조"].legendary.value : CLOAK_BY_TRACK["양조"].value) : 0; }
function cloakGatherMult() { return 1 + (cloakOwned("조달") ? (cloakLegendary("조달") ? CLOAK_BY_TRACK["조달"].legendary.value : CLOAK_BY_TRACK["조달"].value) : 0); }
function cloakSnackAdd() { return cloakOwned("요리") ? (cloakLegendary("요리") ? CLOAK_BY_TRACK["요리"].legendary.value : CLOAK_BY_TRACK["요리"].value) : 0; }
function cloakSmithGuaranteed() { return cloakOwned("대장일"); }                                     // 품질 보장(기본 +1등급)
function cloakSmithLegendary() { return cloakLegendary("대장일"); }                                  // 전설 +2등급 보장(tickSmith에서 처리)

// 트랙 Lv.99 폴링 → 망토 자동 획득(계정 영구). checkCardPetUnlocks 동형.
// + 전설 승급(마스터리 100%) + 만능 망토(전 6트랙 전설) 폴링(t33).
function checkCloakUnlocks() {
  if (!state.cloaks) state.cloaks = { owned: {}, legendary: {}, omni: false };
  if (!state.cloaks.legendary) state.cloaks.legendary = {};
  for (const c of CLOAKS.list) {
    if (state.cloaks.owned[c.track]) continue;
    const got = Object.keys(CHARACTERS).some(id => isRecruited(id) && skillLv(id, c.track) >= CLOAKS.unlock_skill_level);
    if (got) {
      state.cloaks.owned[c.track] = true;
      if (!settling) log(`🎖️ ${c.name} 획득! (${c.track} Lv.99) — ${c.effect} 영구 적용.`);
      needsFullRender = true;
    }
  }
  for (const c of CLOAKS.list) {
    if (!state.cloaks.owned[c.track] || state.cloaks.legendary[c.track]) continue;
    if (typeof masteryPct === "function" && masteryPct(c.track) >= 100) {   // maxTrackLv>=99는 cloakOwned가 이미 보증
      state.cloaks.legendary[c.track] = true;
      if (!settling) log(`🌟 ${c.legendary.name} 승급! (${c.track} 마스터리 100%) — ${c.legendary.effect} 영구 적용.`);
      needsFullRender = true;
    }
  }
  if (!state.cloaks.omni && CLOAKS.list.every(c => state.cloaks.legendary[c.track])) {
    state.cloaks.omni = true;
    if (state.events && state.events.titles) state.events.titles["살아있는 전설"] = true;
    if (!settling) log(`👑 만능 망토 획득! 전 6트랙 전설 달성 — 전 스킬 +15% + 칭호 '살아있는 전설'.`);
    needsFullRender = true;
  }
}
