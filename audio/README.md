# Last Call — 오디오 파일 배치 안내

스펙: `LastCall_GDD/03_support_systems/t34_sound_direction.md` §3

이 폴더는 엔진(코드)이 이미 이 경로/파일명으로 재생을 시도하도록 구현돼 있습니다.
아래 파일명 그대로 넣기만 하면 **코드 수정 없이** 바로 재생됩니다. 파일이 없는 동안은
재생 시도가 조용히 무시됩니다(에러 없음, 무음).

## bgm/ (6개, MP3, 128kbps 스테레오, 60~120초, 심리스 루프)
- bgm_tavern.mp3 — 주점 평시(기본값)
- bgm_night.mp3 — 야간
- bgm_festival.mp3 — 축제 진행 중
- bgm_raid.mp3 — 습격 스팅어(5~8초, 루프 아님)
- bgm_dungeon.mp3 — 던전 원정 진행 중
- bgm_story.mp3 — 서사·엔딩 모달

## sfx/ (13개, MP3, 0.15~2초)
- sfx_brew_done.mp3 ★쓰인 쓰로틀 400ms
- sfx_material_get.mp3 ★쓰인 쓰로틀 400ms
- sfx_drink_pour.mp3
- sfx_brew_explosion.mp3
- sfx_customer_serve.mp3
- sfx_raid_start.mp3
- sfx_raid_win.mp3
- sfx_raid_lose.mp3
- sfx_promotion.mp3
- sfx_levelup.mp3
- sfx_collection_get.mp3
- sfx_dialogue_show.mp3
- sfx_ui_click.mp3 ★쓰인 쓰로틀 0ms(제한 없음)

★ = 방치 중 매우 자주 반복되는 SFX(쓰로틀 적용됨).
