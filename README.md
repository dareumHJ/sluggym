# SlugGym

SlugGym is a crowdsourced gym availability app for planning workouts around live gym traffic and equipment availability. The mobile app shows live East Gym headcount, weekly congestion patterns, equipment zone availability, workout history, routines, and routine-specific recommendation surfaces.

## Repository Structure

```text
sluggym/
├── README.md
├── backend/
│   ├── README.md
│   ├── app/
│   │   ├── config.py              # Backend environment loading and upstream API config
│   │   └── main.py                # FastAPI app and /occupancy endpoint
│   ├── db/
│   │   ├── img/                   # Exercise image assets grouped by exercise
│   │   ├── *.csv                  # Exercise and equipment seed data
│   │   └── *.sql                  # Database schema, policies, and seed helpers
│   ├── supabase/
│   │   ├── config.toml            # Local Supabase configuration
│   │   ├── functions/             # Supabase Edge Functions
│   │   └── migrations/            # Profiles, routines, headcount, and equipment history migrations
│   ├── package.json               # Node-based integration test dependencies
│   └── requirements.txt           # Python backend dependencies
├── docs/
│   ├── RELEASE_docs/              # Release summaries and test reports
│   └── SCRUM_docs/                # Sprint notes and team process docs
├── frontend/
│   ├── app/                       # Expo Router screens and tab routes
│   ├── src/
│   │   ├── components/            # Shared React Native UI components
│   │   ├── constants/             # Theme and shared UI constants
│   │   ├── contexts/              # App context providers
│   │   ├── data/                  # Static map/equipment data
│   │   ├── hooks/                 # Supabase/API data hooks
│   │   ├── lib/                   # Data aggregation, recommendation, and API helpers
│   │   └── types/                 # Shared TypeScript types
│   ├── __tests__/                 # Jest unit and integration tests
│   ├── android/                   # Generated native Android project
│   ├── ios/                       # Generated native iOS project
│   ├── assets/                    # App icon, splash, and adaptive icon assets
│   ├── app.json                   # Expo application config
│   ├── eas.json                   # EAS build profiles
│   └── package.json               # Mobile app dependencies and scripts
└── scripts/                       # Utility scripts for data and automation
```

## Dependencies

### Frontend

The mobile app is built with Expo, React Native, and Expo Router.

Runtime dependencies:

- Expo SDK 54
- React 19.1
- React Native 0.81
- Expo Router
- React Navigation bottom tabs, native, and native stack
- Supabase JavaScript client
- React Native Async Storage
- React Native Gesture Handler
- React Native Reanimated
- React Native Safe Area Context
- React Native Screens
- React Native SVG
- React Native URL Polyfill
- Lucide React Native icons
- Expo Auth Session, Constants, Crypto, Dev Client, Font, Linking, Status Bar, and Web Browser

Development and test dependencies:

- TypeScript
- Jest and Jest Expo
- React Test Renderer
- Testing Library for React Native
- Expo ESLint config
- Babel preset for Expo

### Backend

The backend exposes the live occupancy proxy and stores project data in Supabase.

Python dependencies:

- FastAPI
- httpx
- Uvicorn
- python-dotenv
- supabase-py

Node dependency:

- `@supabase/supabase-js` for integration tests and utility scripts

External services:

- Supabase Auth and Postgres
- Supabase Edge Functions
- SlugRush occupancy API
- Render-hosted backend endpoint for production live occupancy

### Local Tooling

Recommended local tools:

- Node.js 20 or newer
- npm
- Python 3.11 or newer
- Expo CLI through `npx expo`
- Android Studio or Android command line tools for Android builds
- Xcode and CocoaPods for iOS builds
- Supabase CLI for local database and Edge Function workflows

## Installation

Clone the repository and check out `dev`:

```bash
git clone https://github.com/dareumHJ/sluggym.git
cd sluggym
git checkout dev
```

### Frontend Setup

Install mobile app dependencies:

```bash
cd frontend
npm install
```

Create `frontend/.env` with the public Expo environment variables used by the app:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

`EXPO_PUBLIC_API_BASE_URL` is optional for production-like testing because the app has a Render backend fallback, but set it for local backend development.

Start the Expo development server:

```bash
npm run start
```

Run iOS or Android development builds:

```bash
npm run ios
npm run android
```

Run frontend tests and lint:

```bash
npm test -- --runInBand --timeout=15000
npm run lint
```

### Backend Setup

Install Python dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```bash
SLUGRUSH_API_KEY=your_slugrush_api_key
```

Start the FastAPI backend:

```bash
uvicorn app.main:app --reload
```

The live occupancy endpoint is:

```text
GET http://localhost:8000/occupancy
```

Optional backend Node dependency setup for integration tests:

```bash
npm install
```

Integration tests use Supabase credentials from environment variables:

```bash
SUPABASE_URL=your_supabase_url SUPABASE_ANON_KEY=your_supabase_anon_key node --test occupancy-integration.test.js
```

### Supabase Setup

The project keeps Supabase migrations and Edge Functions under `backend/supabase`.

Typical local workflow:

```bash
cd backend
supabase start
supabase db reset
```

Deploy Edge Functions from `backend/supabase/functions` when needed:

```bash
supabase functions deploy poll-occupancy
```

The `poll-occupancy` Edge Function expects these secrets in Supabase:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Build

Android APK:

```bash
cd frontend/android
./gradlew assembleRelease
```

The release APK is generated at:

```text
frontend/android/app/build/outputs/apk/release/app-release.apk
```

Expo/EAS builds can also use the profiles in `frontend/eas.json`.

## Notes

- Do not commit local `.env` files or private keys.
- Exercise database images under `backend/db/img` are referenced from the free exercise database project listed in `backend/README.md`.
- The mobile app expects UI copy to stay in English.
