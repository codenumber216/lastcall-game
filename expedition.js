/* ============================================================================
   Last Call — 원정(파견) 데이터 (index.html에서 <script>로 로드)
   원본(SSOT): lastcall_balance_data.json 의 expedition / 설계서 t30_expedition.md
   ※ 시간 기반 파견(전투 없음). 용병 배치 작업(1명=1작업). 복귀 시 보상(자금·유물·전설재료).
   ※ 유물=신규 산출물(state.materials.유물). 모험의 술통 기부재.
   ※ 값 전부 SSOT. 원정 군마 '원정 시간 -20%'는 코드 특수 연결.
   ============================================================================ */
const EXPEDITION = {
  skill: "원정",
  speed_per_level: 0.005,   // (Lv-1)×0.5%p 시간 단축
  speed_cap: 1.20,          // 생산 +120% 캡(양조·채집·대장일 동형)
  garma_time_reduction: 0.20,   // 원정 군마 펫 장착 시 시간 -20%
  garma_pet: "원정 군마",
  garma_count: 30,          // 원정 30회 완료 → 원정 군마
  dispatches: [
    { name: "옆 마을 심부름", reqLv: 1,  duration_h: 0.5, reward: { funds: 50 }, xp: 20 },
    { name: "던전 탐사",     reqLv: 25, duration_h: 2,   reward: { funds: 300, 유물: 1 }, xp: 80 },
    { name: "미지의 영토",   reqLv: 50, duration_h: 12,  reward: { funds: 2000, 유물: 3, legendary_mat: { pool: ["전설홉", "슬라임정수", "거인고기"], amount: 2 }, 매의깃털: 2 }, xp: 200 },
    { name: "마왕성 정찰",   reqLv: 70, duration_h: 24,  reward: { funds: 5000, 유물: 5, story: "마왕 정보", 매의깃털: 3 }, xp: 400 }
  ]
};
const DISPATCH_BY_NAME = {}; EXPEDITION.dispatches.forEach(d => DISPATCH_BY_NAME[d.name] = d);
