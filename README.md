# Game Arcade

브라우저에서 즐기는 클래식 게임 아케이드 웹사이트입니다. **테트리스**, **스네이크**, **브레이크아웃**, **2048**을 플레이할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

## 빌드

```bash
npm run build
npm run preview
```

## Cloudflare Pages 배포

### Git 연동 (권장)

1. GitHub에 저장소를 만들고 push합니다.
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 저장소 선택 후 빌드 설정:

| 항목 | 값 |
|------|-----|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` (Environment variables → `NODE_VERSION` = `20`) |

4. **Save and Deploy** → `*.pages.dev` URL에서 확인

`public/_redirects`가 SPA fallback을 처리하므로 `/games/tetris` 등 직접 URL 접속·새로고침이 동작합니다.

### Wrangler CLI (Git 없이 직접 배포)

```bash
npm run build
npx wrangler pages deploy dist --project-name=game-arcade
```

최초 실행 시 Cloudflare 로그인이 필요합니다.

### 이후 게임 추가

`main` 브랜치에 push하면 Cloudflare Pages가 자동으로 재빌드·배포합니다.

## 게임 목록

### 테트리스

| 키 | 동작 |
|----|------|
| ← → | 좌우 이동 |
| ↑ | 회전 |
| ↓ | 소프트 드롭 (+1점/칸) |
| Space | 하드 드롭 |
| P / Esc | 일시정지 |

### 스네이크

| 키 | 동작 |
|----|------|
| ↑↓←→ / WASD | 방향 전환 |
| P / Esc | 일시정지 |

- 사과를 먹으면 길이+1, 점수 +10
- 벽 또는 자기 몸에 닿으면 게임 오버
- 최고 점수는 `localStorage`에 저장됩니다
- 모바일: 스와이프 또는 하단 D-pad 버튼

### 브레이크아웃

| 키 | 동작 |
|----|------|
| ← → / A D | 패들 이동 |
| Space | 공 발사 (대기 상태) |
| P / Esc | 일시정지 |

- 벽돌 1개: 10 × 레벨 점수
- 레벨 클리어 보너스: 100 × 레벨
- 생명 3개, 공을 놓치면 생명 -1
- 모바일: 드래그로 패들 이동, 탭으로 발사

### 2048

| 키 | 동작 |
|----|------|
| ↑↓←→ / WASD | 타일 이동 |
| 모바일 스와이프 | 타일 이동 |

- 같은 숫자 타일이 충돌하면 합쳐짐
- 2048 타일 생성 시 승리 (계속하기 가능)
- 더 이상 이동 불가 시 게임 오버
- 최고 점수는 `localStorage`에 저장됩니다

## 게임 추가 방법

1. `src/games/<game-id>/` 폴더에 게임 컴포넌트와 엔진을 작성합니다.
2. `src/games/registry.ts`에 게임 항목을 추가합니다.

라우팅과 로비 UI는 자동으로 새 게임을 표시합니다.

## 기술 스택

- React 19 + TypeScript
- Vite
- React Router
- HTML Canvas (게임 렌더링)

## 프로젝트 구조

```
src/
├── components/     # 공통 UI (Layout, GameCard)
├── pages/          # HomePage, GamePage
├── games/
│   ├── registry.ts # 게임 목록
│   ├── tetris/
│   ├── snake/
│   ├── breakout/
│   └── game2048/
└── styles/
```
