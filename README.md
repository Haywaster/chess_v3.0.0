# Chess v3.0.0

Chess v3.0.0 — браузерная multiplayer-игра на TypeScript, построенная как npm workspaces-монорепозиторий. Сейчас проект содержит клиентскую часть, серверную часть и отдельные shared-пакеты для общей логики и типов.

## Возможности

- регистрация и авторизация пользователей;
- хранение refresh token в cookie;
- создание игровой комнаты;
- подключение игроков к игре через WebSocket;
- синхронизация ходов между игроками в реальном времени;
- игровая логика шашек вынесена в отдельный workspace-пакет;
- хранение состояния игры в SQLite через Prisma;
- общие типы и enum'ы вынесены в shared-пакет;
- линтинг, форматирование и pre-commit hooks.

## Стек

### Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand
- Styled Components
- SCSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- WebSocket `ws`
- JWT
- bcrypt

### Tooling

- npm workspaces
- ESLint
- Stylelint
- Prettier
- Husky
- lint-staged

## Структура проекта

```text
chess_v3.0.0/
├── client/                 # Frontend-приложение на React + Vite
├── server/                 # Backend на Express + Prisma + WebSocket
├── packages/
│   ├── checkers/           # Логика шашек, типы и действия для игры
│   └── shared/             # Общие типы, enum'ы и shared-код
├── .env.example            # Пример переменных окружения
├── package.json            # Root scripts и npm workspaces
├── eslint.config.ts        # ESLint config
├── stylelint.config.mjs    # Stylelint config
└── tsconfig.json           # Root TypeScript config
```

## Установка

Склонируйте репозиторий:

```bash
git clone https://github.com/Haywaster/chess_v3.0.0.git
cd chess_v3.0.0
```

Установите зависимости:

```bash
npm install
```

## Настройка переменных окружения

Создайте `.env` в корне проекта:

```bash
cp .env.example .env
```

Пример содержимого `.env`:

```env
JWT_ACCESS_SECRET_KEY=ACCESS
JWT_REFRESH_SECRET_KEY=REFRESH
DATABASE_URL="file:./dev.db"

VITE_CLIENT_PORT=3000
CLIENT_URL=http://localhost:3000

SERVER_PORT=5000
VITE_SERVER_URL=http://localhost:5000
VITE_WS_SERVER_URL=ws://localhost:5000
```

> Важно: `.env` должен лежать в корне монорепозитория, потому что серверные Prisma-скрипты читают его через `../.env` из workspace `server`.

## Подготовка shared-пакетов

Перед запуском проекта нужно собрать workspace-пакеты, которые используются клиентом и сервером:

```bash
npm run build:shared
npm run build:checkers
```

Если после изменения кода в `packages/shared` или `packages/checkers` появляются ошибки вида `does not provide an export named ...`, пересоберите нужный пакет.

## Prisma и база данных

Сгенерируйте Prisma Client:

```bash
npm run prisma:generate
```

Создайте и примените миграции:

```bash
npm run migrate:create
```

Проверить статус миграций:

```bash
npm run migrate:status
```

Открыть Prisma Studio:

```bash
npm run prisma:studio
```

Сбросить базу данных:

```bash
npm run migrate:reset
```

## Запуск проекта

Запустить клиент и сервер одновременно:

```bash
npm start
```

После запуска:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
WebSocket: ws://localhost:5000
```

## Доступные scripts

### Root scripts

```bash
npm start
```

Запускает frontend и backend одновременно через `concurrently`.

```bash
npm run dev:client
```

Запускает только клиент.

```bash
npm run dev:server
```

Запускает только сервер.

```bash
npm run build:shared
```

Собирает пакет `@game-workspace/shared`.

```bash
npm run build:checkers
```

Собирает пакет `@game-workspace/checkers`.

```bash
npm run lint
npm run lint:fix
```

Запускает ESLint.

```bash
npm run style
npm run style:fix
```

Запускает Stylelint для SCSS-файлов.

```bash
npm run format
```

Форматирует проект через Prettier.

## API

Базовый префикс backend API:

```text
/api
```

Основные маршруты:

```text
POST /api/registration
POST /api/login
GET  /api/refresh
POST /api/logout
GET  /api/users
POST /api/game
```

Часть маршрутов защищена auth middleware и требует авторизации.

## WebSocket

WebSocket-сервер поднимается на том же HTTP-сервере, что и Express.

Основные игровые события:

- подключение к игре;
- перемещение фигуры;
- взятие фигуры;
- отправка ошибок;
- broadcast состояния комнаты всем подключённым игрокам.

Состояние игровой комнаты хранится на сервере и синхронизируется между клиентами через WebSocket-сообщения.

## Модель данных

Проект использует SQLite и Prisma.

Основные сущности:

- `User` — пользователь;
- `RefreshToken` — refresh token пользователя;
- `GameType` — тип игры;
- `Game` — общая игровая сущность;
- `GameParticipant` — участник игры;
- `GameWithColorParticipant` — цвет игрока в партии;
- `CheckersGame` — состояние партии в шашки;
- `ChessGame` — сущность для шахматной игры.

## Разработка

Рекомендуемый порядок работы после изменения shared-пакетов:

```bash
npm run build:shared
npm run build:checkers
npm start
```

Если менялась Prisma-схема:

```bash
npm run migrate:create
npm run prisma:generate
```

Если менялись только frontend-файлы, достаточно перезапуска клиента:

```bash
npm run dev:client
```

## Линтинг и форматирование

Перед коммитом можно запустить:

```bash
npm run lint
npm run style
npm run format
```

В проекте также настроены `husky` и `lint-staged`, поэтому часть проверок и автоисправлений выполняется перед коммитом.

## Возможные проблемы

### Ошибка `does not provide an export named ...`

Скорее всего, пакет в `packages/*` не был пересобран после изменения export'ов.

Решение:

```bash
npm run build:shared
npm run build:checkers
```

### Ошибка Prisma с `.env`

Проверьте, что `.env` находится в корне проекта, а не внутри `server`.

### Ошибка подключения к WebSocket

Проверьте переменную:

```env
VITE_WS_SERVER_URL=ws://localhost:5000
```

Также убедитесь, что backend запущен.

## License

ISC
