# Movie Search — React Native

A cross-platform (iOS / Android) movie search app built with Expo and the [OMDB API](http://www.omdbapi.com/). Search for any movie, browse results in a poster grid, view full details, and save favourites that persist across sessions.

---

## Features

- Debounced live search — results update as you type (400 ms debounce)
- Poster grid with favourite toggle (★ / ☆) on every card
- Full movie detail screen — rating, plot, cast, director, awards, box office
- Favourites tab — persisted to device storage, stays in sync across tabs
- Light / dark mode — follows system preference automatically

---

## Getting started

**Prerequisites:** Node 18+, Xcode (iOS) or Android Studio (Android).

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your OMDB API key (free at http://www.omdbapi.com/apikey.aspx)

# 3. Start the dev server
npx expo start

npx expo start --ios      # open directly in iOS simulator
npx expo start --android  # open directly in Android emulator
```

### Run the test suite

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Expo 55 (SDK) + Expo Router 55 (file-based routing) |
| Language | TypeScript 5.9 (strict mode) |
| React / RN | React 19, React Native 0.83 |
| Navigation | Expo Router Stack + NativeTabs (native system tab bar) |
| Persistence | `@react-native-async-storage/async-storage` |
| Images | `expo-image` (fast, cached) |
| Animations | `react-native-reanimated` 4 (splash overlay) |
| Testing | Jest 29 + `jest-expo` preset + `@testing-library/react-native` |

---

## Architecture

The project follows a layered architecture with strict one-way dependencies. Each layer only knows about the layer directly below it.

```
screens  →  hooks  →  services / storage  →  domain
```

### Directory structure

```
src/
├── app/                        # Expo Router screens (file-based routes)
│   ├── _layout.tsx             # Root Stack navigator (ThemeProvider + splash)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # NativeTabs — Home + Favourites triggers
│   │   ├── _layout.web.tsx     # Web tab bar variant
│   │   ├── index.tsx           # Home screen (search)
│   │   └── favs.tsx            # Favourites screen
│   └── movie/
│       └── [id].tsx            # Movie detail screen (Stack push)
│
├── domain/
│   └── movie.ts                # MovieSummary + Movie interfaces (pure TS, no RN)
│
├── services/
│   └── omdb.ts                 # OMDB HTTP calls → domain types
│
├── storage/
│   └── favorites.ts            # AsyncStorage read / write → domain types
│
├── hooks/
│   ├── use-movie-search.ts     # Debounced search → { movies, loading, error }
│   ├── use-movie-details.ts    # Fetch by imdbID → { movie, loading, error }
│   └── use-favorites.ts        # Favourites state + persistence → { favorites, isFavorite, toggle, refresh }
│
└── components/
    ├── SearchInput.tsx          # Controlled text input (themed)
    ├── MovieCard.tsx            # Poster + title + ★ toggle, navigates to detail
    ├── MovieGrid.tsx            # FlatList numColumns=2, loading/error/empty states
    ├── themed-text.tsx          # Text with theme colours and type scale
    └── themed-view.tsx          # View with themed background colour
```

### Layer rules

| Layer | May import | Must not import |
|---|---|---|
| `domain/` | Nothing | Everything |
| `services/` | `domain/` | RN, storage, hooks, components |
| `storage/` | `domain/` | services, hooks, components |
| `hooks/` | `services/`, `storage/`, `domain/` | components, navigation |
| `components/` | `domain/` types, hooks | services, storage directly |
| `app/` screens | hooks, components | services, storage directly |

### Navigation structure

```
Stack (root _layout.tsx)
├── (tabs)              ← NativeTabs, headerShown: false
│   ├── index           ← Home / Search
│   └── favs            ← Favourites
└── movie/[id]          ← Detail screen, headerShown: true
```

The movie detail sits in the root Stack rather than inside the tab group, so it pushes full-screen without the tab bar.

### Favourites sync

Both tabs use independent `useFavorites()` instances backed by AsyncStorage. The Favourites tab calls `refresh()` inside `useFocusEffect` so it reloads from storage whenever it gains focus — no shared state manager needed.

---

## Key design decisions

**No global state manager.** The app scope is small enough that hook-level state + `useFocusEffect` refresh is sufficient. Adding Redux/Zustand would be premature.

**Hooks own all business logic.** Screens are thin — they compose hooks and pass props to components. This keeps hooks unit-testable without a component renderer.

**Services and storage are pure async functions.** No classes, no singletons. Easy to mock in tests with a single `jest.MockedFunction`.

**Debounce lives in the hook, not the component.** `useMovieSearch` owns the 400 ms debounce timer. Components stay stateless about timing.

**Cancellation flag instead of AbortController.** `useMovieDetails` sets `cancelled = true` on cleanup. Simple, readable, and avoids the `AbortController` browser/RN compatibility surface.

---

## Testing

Tests live in `__tests__/` mirroring the `src/` structure.

```
__tests__/
├── services/omdb.test.ts           # 9 tests
├── storage/favorites.test.ts       # 8 tests
└── hooks/
    ├── use-movie-search.test.ts    # 12 tests
    ├── use-movie-details.test.ts   # 8 tests
    └── use-favorites.test.ts       # 8 tests
```

**45 tests total.** Coverage on the testable layers (services, storage, hooks):

| File | Statements | Branches | Functions |
|---|---|---|---|
| `services/omdb.ts` | 100% | 100% | 100% |
| `storage/favorites.ts` | 100% | 100% | 100% |
| `hooks/use-favorites.ts` | 100% | 100% | 100% |
| `hooks/use-movie-details.ts` | 100% | 50%* | 100% |
| `hooks/use-movie-search.ts` | 100% | 83%* | 100% |

*Uncovered branches are defensive null-checks on cleanup refs and the cancellation flag — they cannot be triggered in normal execution.

**Mocking strategy:**
- `services/omdb` is mocked at the hook-test level (`jest.mock('@/services/omdb')`)
- `storage/favorites` is mocked at the hook-test level (`jest.mock('@/storage/favorites')`)
- `AsyncStorage` is redirected globally via `moduleNameMapper` to the official jest mock
- `global.fetch` is assigned a `jest.fn()` in the service tests

---

## OMDB API

The app uses the [OMDB API](http://www.omdbapi.com/).

| Endpoint | Usage |
|---|---|
| `?s={query}&apikey=` | Search — returns `MovieSummary[]` |
| `?i={imdbID}&apikey=&plot=full` | Detail — returns full `Movie` |

Both calls are encapsulated in `src/services/omdb.ts`. The API key is read from `process.env.EXPO_PUBLIC_OMDB_API_KEY`, which Expo inlines from your local `.env` file at build time. The `.env` file is gitignored — see `.env.example` for the required variable.

---

## Path aliases

`@/*` maps to `src/*` (configured in `tsconfig.json` and Jest `moduleNameMapper`).

```ts
import { useFavorites } from '@/hooks/use-favorites';
import { Movie } from '@/domain/movie';
```
