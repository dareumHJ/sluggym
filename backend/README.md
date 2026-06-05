# SlugGym Backend

The backend contains the FastAPI occupancy proxy, Supabase database assets, migrations, Edge Functions, and exercise/equipment seed data.

## Structure

```text
backend/
├── app/
│   ├── config.py       # Loads SLUGRUSH_API_KEY and upstream count URL
│   └── main.py         # FastAPI app with GET /occupancy
├── db/
│   ├── img/            # Exercise image folders
│   ├── *.csv           # Exercise and equipment datasets
│   └── *.sql           # Schema, policies, and mapping helpers
├── supabase/
│   ├── config.toml
│   ├── functions/
│   └── migrations/
├── requirements.txt
└── package.json
```

## Dependencies

Python:

- FastAPI
- httpx
- Uvicorn
- python-dotenv
- supabase-py

Node:

- `@supabase/supabase-js`

External services:

- SlugRush occupancy API
- Supabase Auth, Postgres, and Edge Functions

## Installation

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

Run the API locally:

```bash
uvicorn app.main:app --reload
```

Endpoint:

```text
GET http://localhost:8000/occupancy
```

For Node-based integration tests:

```bash
npm install
SUPABASE_URL=your_supabase_url SUPABASE_ANON_KEY=your_supabase_anon_key node --test occupancy-integration.test.js
```

## Supabase

Run local Supabase migrations from this directory:

```bash
supabase start
supabase db reset
```

Deploy the occupancy polling Edge Function:

```bash
supabase functions deploy poll-occupancy
```

The Edge Function expects:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## License Notes

The exercise database and images are referenced from `https://github.com/yuhonas/free-exercise-db`.
