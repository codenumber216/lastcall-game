/* ============================================================================
   Last Call — 채집(재료 생산) 데이터 (index.html에서 <script>로 불러옴)
   원본: LastCall_GDD/lastcall_balance_data.json 의 material_production.activities

   모델: AFK 시간당 산출(rate_per_h). 해금 시점 기본값(마스터리·버프술·날씨·펫 미적용).
   각 활동:
     buff_drink : 이 활동을 강화하는 생산 버프 술(정합성용, 현재 게임 로직엔 미반영)
     yields     : { 재료이름: { rate_per_h, unlock_lv } }  ← 시간당 산출량

   ※ 재료명은 balance JSON·drinks.js와 정확히 일치(NFC).
   ※ unlock_lv은 원본 그대로 보존하되, 현재 게임엔 레벨 시스템이 없어 게이팅하지
     않습니다(모든 산출을 기본 rate로 생산). 레벨 도입 시 이 값으로 잠그면 됩니다.
   ============================================================================ */
const GATHERING = {
  "농사": {
    name: "농사", buff_drink: "농부의 막걸리", weather_affected: true, plots_max: 10,
    yields: {
      홉:     { rate_per_h: 30,  unlock_lv: 1 },
      보리:   { rate_per_h: 20,  unlock_lv: 15 },
      쌀:     { rate_per_h: 20,  unlock_lv: 10 },
      작물:   { rate_per_h: 25,  unlock_lv: 5 },
      포도:   { rate_per_h: 18,  unlock_lv: 5 },
      전설홉: { rate_per_h: 1.5, unlock_lv: 35 }
    }
  },
  "채집": {
    name: "채집", buff_drink: "보리 맥주",
    yields: {
      약초:   { rate_per_h: 25, unlock_lv: 1 },
      꿀:     { rate_per_h: 12, unlock_lv: 10 },
      약수:   { rate_per_h: 15, unlock_lv: 5 },
      독버섯: { rate_per_h: 6,  unlock_lv: 35 },
      산삼:   { rate_per_h: 1,  unlock_lv: 50 }
    }
  },
  "낚시": {
    name: "낚시", buff_drink: "어부의 탁배기",
    yields: {
      생선: { rate_per_h: 20, unlock_lv: 1 }
    }
  },
  "벌목": {
    name: "벌목", buff_drink: "나무꾼의 송진주",
    yields: {
      나무껍질: { rate_per_h: 22, unlock_lv: 1 },
      목재:     { rate_per_h: 18, unlock_lv: 1 }
    }
  },
  "채광": {
    name: "채광", buff_drink: "광부의 철맥주",
    yields: {
      광석:     { rate_per_h: 18, unlock_lv: 1 },
      마석가루: { rate_per_h: 3,  unlock_lv: 40 }
    }
  },
  "사냥": {
    name: "사냥", buff_drink: null,
    yields: {
      몬스터고기:   { rate_per_h: 15,  unlock_lv: 1 },
      슬라임정수:   { rate_per_h: 0.8, unlock_lv: 30 },
      거인고기:     { rate_per_h: 0.5, unlock_lv: 70 }
    }
  }
};
