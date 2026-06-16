/* ============================================================================
   Last Call — 술 데이터 (index.html에서 <script>로 불러옴)
   원본: LastCall_GDD/lastcall_balance_data.json 의 tavern_bar.drinks (17종)

   각 항목 형식:
     키            : 공백 없는 식별자 (예: "보리맥주")
     name          : 표시 이름 (원본 그대로, 예: "보리 맥주")
     effect        : 원본 효과 설명
     series        : 원본 분류(생산/접객/공격…) — 버프 슬롯 same_series_block 판정에 사용
     mat           : { 재료이름: 필요수량 }  ← 1병 만드는 데 드는 재료
     brewSeconds   : duration_h × 3600  ← ① 1병 양조 시간 ② 버프 지속(둘 다 duration_h에서 옴)
     duration_type : (있으면) 조건부 지속 방식. "raid"=습격 1회 지속, 시간 카운트다운 없음
     buff          : 마실 때 발동하는 효과의 구조화 데이터
        kind:"gather" → targets(채집 활동 id 배열)의 산출 속도를 pct만큼 곱연산 증가
        kind:"raid"   → 습격 중 발동(전투 시스템 대기) — 슬롯 점유, 카운트다운 없음
        kind:"other"  → 효과는 있으나 해당 게임 시스템(전투·접객 등) 미구현 → 현재 수치 무효과

   ※ 이 파일을 수정하면 index.html 새로고침 시 바로 반영됩니다.
   ============================================================================ */
const DRINKS = {
  "보리맥주":    { name: "보리 맥주",     effect: "채집 속도 +15%",            series: "생산", mat: { 홉: 3 },                    brewSeconds: 1  * 3600, buff: { kind: "gather", targets: ["채집"], pct: 0.15 } },
  "어부의탁배기":{ name: "어부의 탁배기", effect: "낚시 속도 +15%",            series: "생산", mat: { 홉: 3, 생선: 3 },           brewSeconds: 1  * 3600, buff: { kind: "gather", targets: ["낚시"], pct: 0.15 } },
  "농부의막걸리":{ name: "농부의 막걸리", effect: "농사 수확량 +15%",          series: "생산", mat: { 홉: 3, 작물: 5 },           brewSeconds: 1  * 3600, buff: { kind: "gather", targets: ["농사"], pct: 0.15 } },
  "나무꾼의송진주":{ name: "나무꾼의 송진주", effect: "벌목 속도 +15%",        series: "생산", mat: { 홉: 3, 나무껍질: 5 },       brewSeconds: 1  * 3600, buff: { kind: "gather", targets: ["벌목"], pct: 0.15 } },
  "광부의철맥주":{ name: "광부의 철맥주", effect: "채광 속도 +15%",            series: "생산", mat: { 홉: 3, 광석: 3 },           brewSeconds: 1  * 3600, buff: { kind: "gather", targets: ["채광"], pct: 0.15 } },
  "싸구려와인":  { name: "싸구려 와인",   effect: "손님 만족 +5%",             series: "접객", mat: { 포도: 5 },                  brewSeconds: 1  * 3600, buff: { kind: "other" } },
  "화끈한증류주":{ name: "화끈한 증류주", effect: "공격 속도 +15%",            series: "공격", mat: { 홉: 3, 약초: 5 },           brewSeconds: 2  * 3600, buff: { kind: "other" }, brewReqLv: 10 }, // 양조 요구 Lv 10(확정, 15→10) — 보리 시작 Lv10으로 첫 습격 전투술 제작 가능
  "용기의에일":  { name: "용기의 에일",   effect: "받는 피해 -20%",            series: "방어", mat: { 보리: 5, 몬스터고기: 3 },   brewSeconds: 3  * 3600, buff: { kind: "other" } },
  "함정꾼의독주":{ name: "함정꾼의 독주", effect: "함정 효과 +30%",            series: "함정", mat: { 약초: 8, 독버섯: 2 },       brewSeconds: 4  * 3600, buff: { kind: "other" } },
  "수련자의청주":{ name: "수련자의 청주", effect: "전 스킬 XP +20%",           series: "성장", mat: { 쌀: 10, 약수: 3 },          brewSeconds: 3  * 3600, buff: { kind: "other" } },
  "도사의곡차":  { name: "도사의 곡차",   effect: "마법 위력 +25%",            series: "마법", mat: { 약초: 10, 산삼: 1 },        brewSeconds: 3  * 3600, buff: { kind: "other" } },
  "풍요의탁주":  { name: "풍요의 탁주",   effect: "채집·벌목·채광 속도 +10%",  series: "생산", mat: { 쌀: 8, 꿀: 3 },            brewSeconds: 3  * 3600, buff: { kind: "gather", targets: ["채집", "벌목", "채광"], pct: 0.10 } },
  "영웅의폭탄주":{ name: "영웅의 폭탄주", effect: "전 전투력 +20%",            series: "공격", mat: { 증류주: 3, 마석가루: 2 },   brewSeconds: 3  * 3600, buff: { kind: "other" } },
  // duration_type "raid": 효과는 "습격 1회 동안 지속"(시간 카운트다운 없음). 양조 시간만 게임상 3h로 확정.
  "회복의약주":  { name: "회복의 약주",   effect: "전투 중 HP 회복",           series: "회복", mat: { 약초: 10, 꿀: 5 },          brewSeconds: 3  * 3600, duration_type: "raid", buff: { kind: "raid" } },
  "거인의흑맥주":{ name: "거인의 흑맥주", effect: "HP 최대치 +15%",            series: "강화", mat: { 보리: 15, 거인고기: 1 },    brewSeconds: 24 * 3600, buff: { kind: "other" } },
  "보리의정수":  { name: "보리의 정수",   effect: "전 스킬 +25% + 전투력 +30%", series: "전설", mat: { 슬라임정수: 1, 전설홉: 5 }, brewSeconds: 2  * 3600, buff: { kind: "other" } },
  "왕국의축배":  { name: "왕국의 축배",   effect: "왕국 명성 획득 x2",         series: "전설", mat: { 전설홉: 10, 슬라임정수: 3, 거인고기: 2 }, brewSeconds: 6  * 3600, buff: { kind: "other" } }
};
