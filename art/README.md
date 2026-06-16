# Last Call — 캐릭터 초상화 에셋 (1단계 온보딩 캐스트)

> 아트 방향 기준: `LastCall_GDD/03_support_systems/t23_tech_art_direction.md`
> ("쯔쿠르급 이상 · 정적 이미지 · 애니메이션 최소 · 캐릭터만 공들이기")
> 캐릭터 설정: t13(스토리) · t15(대사 풀) / 등장 맥락: t24(온보딩)

## 1. 에셋 목록 (파일명 · 용도 · 크기)

| 파일 | 인물 | 용도(등장) | 크기 | 포맷 |
|------|------|-----------|------|------|
| `art/grandma.png` | 할머니 (NPC) | 온보딩 스텝1(인트로)·스텝6 직전 | 512×512 | PNG / RGBA 투명 |
| `art/player.png`  | 플레이어(용병) | 온보딩 전 스텝 + 로스터 | 512×512 | PNG / RGBA 투명 |
| `art/jin.png`     | 진 | 온보딩 스텝2·4·5 + 로스터(slot 2) | 512×512 | PNG / RGBA 투명 |
| `art/bori.png`    | 보리 | 온보딩 스텝6(졸업 컷) + 로스터(slot 3, 2단계 해금) | 512×512 | PNG / RGBA 투명 |

- **공통 규격**: 512×512 정사각 / 배경 투명(RGBA) / 4종 동일 화풍.
- **출처**: 외주 일러스트(2×2 그리드 원본) → `art/_source/portraits_grid.png`.
  4분할 크롭 후 테두리 연결 배경(구워진 흰/연회색 체커)을 flood-fill로 투명화.
  재가공 도구: `_art_crop.html`(크롭/키잉) + `_serve.ps1`(저장). 표정/교체 시 동일 파이프라인 재사용.
  ※ 원본 배경은 실제 투명이 아니라 체커가 픽셀로 구워져 있어 키잉 필요했음.
- 기타 외주물: `_source/stickers.png`(말풍선 스티커 2×2), `_source/comic.png`(4컷) — 초상화 외 용도(이모티콘·연출)로 보관.
- **미제작(의도적 제외)**: 마라·도리·셀라·콩이 — 3~4단계 해금, 온보딩 등장 금지(스포일러 가드).

## 2. 권장 표시 크기

| 위치 | 권장 표기 크기 | 비고 |
|------|--------------|------|
| 온보딩 대사 배너(`.ob-banner`, max 480px) | 56–64px 원형 | 화자명 옆 인라인 아바타 |
| 인트로/졸업 모달(`.ob-modal`) | 96–120px | 더 시네마틱하게 |
| 로스터 카드 썸네일 | 48–56px | (선택) |

> 소스가 512px라 위 크기에서 2x 이상 선명. `image-rendering` 별도 설정 불필요.

## 3. 화자 → 초상화 매핑 (코드 연결용)

온보딩 대사의 **화자 문자열**과 `CHARACTERS` 키가 일부 다름에 주의:
온보딩은 플레이어를 **"용병"**으로 표기, 로스터 키는 **"플레이어"**.

```js
// 온보딩 화자 라벨 + 캐릭터 키 양쪽을 모두 커버
const PORTRAIT = {
  "할머니":   "art/grandma.png",
  "용병":     "art/player.png",   // 온보딩 화자 라벨
  "플레이어": "art/player.png",   // CHARACTERS 키
  "진":       "art/jin.png",
  "보리":     "art/bori.png",
};
```

### 온보딩 대사 배너 적용 예 (index.html `renderOnboarding` 내 `linesHtml`)

```js
const linesHtml = def.lines.map(([who, txt]) =>
  who
    ? `<div class="ob-line">
         ${PORTRAIT[who] ? `<img class="ob-face" src="${PORTRAIT[who]}" alt="${who}">` : ""}
         <span class="ob-speaker">${who}</span>: ${txt}
       </div>`
    : `<div class="ob-line ob-narr">${txt}</div>`).join("");
```

```css
.ob-face {
  width: 56px; height: 56px; border-radius: 50%;
  vertical-align: middle; margin-right: 6px;
}
```

- 나레이션(화자 `""`) 줄은 초상화 없음(기존 `.ob-narr` 유지).
- 모달(스텝1·6)에서 더 크게 쓰려면 같은 `PORTRAIT[who]`로 96–120px 적용.

> ✅ **구현 완료**: 위 매핑·CSS가 `index.html`에 실제 반영됨(`OB_PORTRAIT`/`obFace()`,
> `.ob-face` 배너 44px·모달 56px). 인트로·튜토리얼·졸업 전 스텝에서 화자별 초상화 표시.

## 4. 스티커 (이벤트 리액션 이모티콘)

원본: 외주 스티커 시트 `art/_source/stickers.png`(1024×1024, 투명, 2×2) → 4분할.

| 파일 | 인물 | 베이크된 대사 | 연결 이벤트 |
|------|------|--------------|------------|
| `art/stickers/grandma.png` | 할머니 | "앉아서 해라~" | (예비) |
| `art/stickers/player.png`  | 플레이어 | "힐, 잠깐만요!!?" | **습격 패배** |
| `art/stickers/jin.png`     | 진 | "심쿵♥" | **습격 격퇴** |
| `art/stickers/bori.png`    | 보리 | "뽀글뽀글!" | **주점 승급** |

- 규격: 512×512 / 투명 PNG.
- 표시: 우하단 팝업 토스트(`.sticker-toast`, 132px), 팝 인 → 약 2.4초 후 페이드.
- 호출: `showSticker(key, hold)`. **온보딩 중엔 자동 억제**, 연속 발동 3.5초 쿨다운(연속 습격 스팸 방지).
- 연결 지점(구현됨): `promote()`→`bori`, `resolveRaid()` 격퇴→`jin` / 패배→`player`.
  새 이벤트에 붙이려면 해당 함수에서 `showSticker("키")` 한 줄 추가.

## 5. 4컷 프롤로그 만화

- `art/comic_prologue.png`(1024×1536, 배경 포함 완성본. 원본 사본 = `_source/comic.png`).
- 용도: 온보딩 **스텝1 인트로 모달** 상단에 `.ob-comic`으로 표시(모달 `max-height:88vh; overflow:auto`로 스크롤).
- 구현됨: `renderOnboarding()` 모달 분기에서 `ob.step===1`일 때만 삽입.
