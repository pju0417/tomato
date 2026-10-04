# 교실 토마토 연구소 · 2.5D 에셋 v1
내장 image_gen 도구로 생성한 디자인 에셋입니다.

- classroom-map-v1.png: 햇빛이 드는 창가, 사물함, 넓은 이동 공간이 있는 교실 배경.
- characters-plants-rewards-v1.png: 학생 방향 시안 4개, 성장 단계 4개, 화분 4개, 장식 4개를 담은 투명 배경 시트.
- preview.html: 두 이미지를 확인하는 미리보기.

## 디자인 방향
둥근 점토 질감, 크림과 원목 배경, 세이지 그린 의상, 토마토 레드 포인트.
학생 눈높이에 맞춘 따뜻하고 편안한 교실 분위기.

## 보상 연결 제안
| 행동 | 보상 예시 |
| --- | --- |
| 흙 상태를 확인하고 필요한 때 물주기 | 별 화분 |
| 관찰 기록 3회 작성 | 개구리 화분 |
| 창가와 사물함의 빛 차이 관찰 | 밀짚모자 |
| 첫 꽃 관찰 | 리본 |
| 첫 토마토 수확 | 왕관 |
| 성장 기록 완성 | 무지개 화분 |

물주기 횟수 자체보다 적절한 돌봄과 관찰에 보상하도록 설계합니다.

## 적용 범위와 후속 작업
이번 결과는 디자인 에셋 제작 단계입니다. 기존 index.html의 게임 동작은 수정하지 않았습니다.
교실 배경의 가구는 이미지에 포함되어 있습니다. 이동 가능한 화분은 별도 레이어로 배치해야 합니다.
시트는 디자인 원본이며 정확한 균등 격자나 애니메이션 프레임을 보장하지 않습니다. 실제 적용 전 개별 오브젝트 영역 분리, 가장자리 확인, 크기 및 발밑 기준점 통일이 필요합니다.
학생 후면 방향 두 개는 유사하므로 실제 4방향 이동용으로는 방향 보정 및 걷기 프레임 추가가 필요합니다.
장식 화분과 식물의 결합용 레이어, 맵 충돌 영역 및 배치 좌표는 후속 구현 범위입니다.

## 최종 생성 프롬프트
### 교실 맵
Use case: stylized-concept. Asset type: classroom map background for a Korean elementary-school cherry tomato growing simulation game. Create a polished cute 2.5D orthographic isometric dollhouse classroom, wide landscape composition. Soft rounded clay-like forms, subtle paper grain, warm cream and pale natural wood, sage green, peach, tomato-red accents, gentle ambient occlusion, light from upper left. Two cutaway walls, large sunny windows on left wall with a deep EMPTY continuous plant shelf, low mint and cream student lockers against right wall with EMPTY accessible flat tops where movable plant pots can later be placed, small chalkboard with simple leaf doodles without text, a few rounded wooden student desks near back and sides. Most of the central floor must remain EMPTY and spacious, clear walkable connected floor from windows to lockers; pale warm wooden floor, small subtle square floor divisions. Entire room floor and furniture fit inside image with generous margin, no cropped objects. No characters, no tomato plants, no UI, no letters, no watermark. Production-quality inviting cozy game environment with clear object silhouettes and consistent isometric projection, not photorealistic. Background outside the room solid warm ivory. This is the actual map art, not a presentation board.

### 캐릭터·식물·보상 시트
Use case: stylized-concept. Asset type: transparent game sprite asset sheet for a cute elementary school cherry-tomato gardening game. Exactly 16 isolated objects in a precisely spaced 4 column by 4 row grid, each object entirely inside its own equal square cell, ample transparent padding, no overlap, no text or labels or grid lines. Consistent cute 2.5D orthographic view slightly from above, rounded clay toy aesthetic, warm cream sage green peach tomato red palette, soft upper-left lighting, subtle shading, clean readable silhouettes. Row 1: the SAME adorable gender-neutral elementary student with short dark brown bowl-cut hair, sage green dungarees and cream shirt, peach shoes: front-left three-quarter standing; back-left three-quarter standing; back-right three-quarter standing; front-right three-quarter standing. Same proportions and clothing in all four. Row 2: four successive tomato growth stages all in identical small plain terracotta pots: soil with tiny sprout; leafy young tomato seedling; taller tomato plant with yellow flowers and support stake; mature tomato plant with several small red cherry tomatoes and support stake. Row 3: four empty cosmetic flower pots with visible soil: cream bunny-ear pot; mint frog-face pot; peach pot with tiny yellow stars; pale yellow scalloped pot with rainbow motif. Row 4: four isolated wearable decorations for tomato fruits as reward inventory icons: tiny straw sunhat; round gold eyeglasses; pink ribbon bow; small gold star crown. Glasses and hat should be standalone accessories without a tomato underneath. All sixteen assets evenly centered and individually readable, each isolated against genuinely transparent background, no checkerboard drawn, no platform bases. Student sprites have neutral arms suitable for later game animation. Friendly premium cozy game art.

