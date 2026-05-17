# Movie Search — React Native

A cross-platform (iOS / Android) movie search app built with Expo and the [OMDB API](http://www.omdbapi.com/). Search for any movie, browse results in a poster grid, view full details, and save favourites that persist across sessions.

---






## Screenshots

| Home - Empty state | Home results | Favs |
|:---:|:---:|:---:|
| <img width="300"  alt="Home - Light - Empty state" src="https://github.com/user-attachments/assets/07bcf1d0-ad51-4fa2-81fb-e0d9b597c8ea" /> | <img width="300"  alt="Home - Light - Movies" src="https://github.com/user-attachments/assets/df23ec39-6809-4a89-bc11-99a1efda4965" /> | <img width="300" alt="Favs - Light" src="https://github.com/user-attachments/assets/8603ac03-bb0d-4e39-b666-57e5c796c565" /> |
| Home | Favs | Settings|
| <img width="300"  alt="Home - Dark" src="https://github.com/user-attachments/assets/7fd9c0b3-b6c3-4da6-861d-7d3f02881ba9" /> | <img width="300"  alt="Favs - Dark" src="https://github.com/user-attachments/assets/3b89d7ab-a939-4be6-8517-536861dde686" /> | <img width="300"  alt="Settings" src="https://github.com/user-attachments/assets/c01d8eff-69f8-46e5-be91-175724808f7e" /> |
| Details - Light | Details - Dark | Settings - Light |
| <img width="300"  alt="Details - Light" src="https://github.com/user-attachments/assets/082399b1-0bc6-45f1-86bc-8a93fac9bab7" /> | <img width="300"  alt="Details - Dark" src="https://github.com/user-attachments/assets/da783e48-c41f-41e8-ab56-771a74d52e16" /> | <img width="300"  alt="Settings" src="https://github.com/user-attachments/assets/388023fb-fd21-482d-ac41-376a38d49244" /> | 

---

## Features

- Debounced live search — results update as you type (400 ms debounce)
- Poster grid with favourite toggle (★ / ☆) on every card
- Full movie detail screen — rating, plot, cast, director, awards, box office
- Favourites tab — persisted to device storage, stays in sync across tabs
- Settings screen — dark mode toggle and accent colour picker, persisted to device storage
- Light / dark mode — override system preference or let the app follow it automatically

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
| Navigation | Expo Router Stack + custom `FloatingTabBar` (pill overlay with blur) |
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
│   ├── _layout.tsx             # Root Stack navigator (ThemeProvider + fonts + splash)
│   ├── settings.tsx            # Settings screen (Stack push from Favs)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # FloatingTabBar — Home + Favs tabs
│   │   ├── _layout.web.tsx     # Web tab bar variant
│   │   ├── index.tsx           # Home screen (search)
│   │   ├── favs.tsx            # Favourites screen
│   │   └── settings.tsx        # Settings tab route (href: null — hidden from bar)
│   └── movie/
│       └── [id].tsx            # Movie detail screen (Stack push)
│
├── constants/
│   └── theme.ts                # Design tokens: colours, fonts, spacing, accent palette
│
├── context/
│   └── ThemeContext.tsx        # React context — distributes ThemeSettings to the tree
│
├── domain/
│   └── movie.ts                # MovieSummary + Movie interfaces (pure TS, no RN)
│
├── services/
│   └── omdb.ts                 # OMDB HTTP calls → domain types
│
├── storage/
│   ├── favorites.ts            # AsyncStorage read / write for favourites → domain types
│   └── settings.ts             # AsyncStorage read / write for dark mode + accent
│
├── hooks/
│   ├── use-color-scheme.ts     # System colour scheme (native)
│   ├── use-color-scheme.web.ts # System colour scheme (web)
│   ├── use-movie-search.ts     # Debounced search → { movies, loading, error }
│   ├── use-movie-details.ts    # Fetch by imdbID → { movie, loading, error }
│   ├── use-favorites.ts        # Favourites state + persistence → { favorites, isFavorite, toggle, refresh }
│   ├── use-theme-settings.ts   # Loads/saves dark + accent → { dark, accent, setDark, setAccent, loaded }
│   └── use-theme.ts            # Resolves active theme object from context
│
└── components/
    ├── AccentSwatch.tsx         # Tappable colour swatch for the accent picker
    ├── animated-icon.tsx        # Animated tab icon (native)
    ├── animated-icon.web.tsx    # Animated tab icon (web)
    ├── FavCard.tsx              # Row card for the Favourites list
    ├── FloatingTabBar.tsx       # Custom floating pill tab bar (blur + dot badge)
    ├── MovieCard.tsx            # Poster + title + ★ toggle, navigates to detail
    ├── MovieGrid.tsx            # FlatList numColumns=2, loading/error/empty states
    ├── PosterCard.tsx           # Reusable poster image card
    ├── SearchInput.tsx          # Controlled text input (themed)
    ├── StarButton.tsx           # Animated ★/☆ toggle button
    ├── themed-text.tsx          # Text with theme colours and type scale
    ├── themed-view.tsx          # View with themed background colour
    └── Toggle.tsx               # iOS-style toggle switch
```

### Layer rules

| Layer | May import | Must not import |
|---|---|---|
| `domain/` | Nothing | Everything |
| `services/` | `domain/` | RN, storage, hooks, components |
| `storage/` | `domain/`, `constants/` | services, hooks, components |
| `constants/` | Nothing | Everything |
| `hooks/` | `services/`, `storage/`, `domain/`, `constants/` | components, navigation |
| `context/` | `hooks/`, `constants/` | components, navigation |
| `components/` | `domain/` types, `hooks/`, `context/` | services, storage directly |
| `app/` screens | hooks, components, context | services, storage directly |

### Navigation structure

```
Stack (root _layout.tsx)
├── (tabs)              ← FloatingTabBar, headerShown: false
│   ├── index           ← Home / Search
│   └── favs            ← Favourites (gear icon → /settings)
├── settings            ← Settings screen (Stack push, no tab bar)
└── movie/[id]          ← Detail screen (Stack push, no tab bar)
```

The Settings and movie detail screens sit in the root Stack rather than inside the tab group, so they push full-screen without the tab bar. Settings is reached via the gear icon on the Favs screen header.

### Favourites sync

Both tabs use independent `useFavorites()` instances backed by AsyncStorage. The Favourites tab calls `refresh()` inside `useFocusEffect` so it reloads from storage whenever it gains focus — no shared state manager needed.

### Theme system

`useThemeSettings` loads `dark` and `accent` from AsyncStorage on mount and exposes `setDark` / `setAccent` mutators that write-through immediately. The root `_layout.tsx` passes the result into `ThemeProvider`, making both values available anywhere via `useTheme()` / `useAccent()`. This means theme changes are instant and persist across cold starts.

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
├── services/omdb.test.ts               # 9 tests
├── storage/
│   ├── favorites.test.ts               # 7 tests
│   └── settings.test.ts               # 5 tests
└── hooks/
    ├── use-movie-search.test.ts        # 11 tests
    ├── use-movie-details.test.ts       # 6 tests
    ├── use-favorites.test.ts           # 12 tests
    └── use-theme-settings.test.ts     # 8 tests
```

**58 tests total.** Coverage on the testable layers (services, storage, hooks):

| File | Statements | Branches | Functions |
|---|---|---|---|
| `services/omdb.ts` | 100% | 100% | 100% |
| `storage/favorites.ts` | 100% | 100% | 100% |
| `storage/settings.ts` | 100% | 100% | 100% |
| `hooks/use-favorites.ts` | 100% | 100% | 100% |
| `hooks/use-theme-settings.ts` | 100% | 100% | 100% |
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
