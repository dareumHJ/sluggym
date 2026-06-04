#!/usr/bin/env python3
"""
Polls our SlugGym backend for occupancy data and persists headcount sample to Supabase.
Triggered by GitHub Actions on a 30-min schedule.
"""
import os
import sys
import httpx
from datetime import datetime, timezone
from supabase import create_client

OCCUPANCY_URL = "https://sluggym-backend.onrender.com/occupancy"
GYM_ID = "cd748d81-b9b3-4c0e-82ae-664265448ea7"


def main():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not all([supabase_url, supabase_key]):
        print("ERROR: Missing Supabase environment variables")
        sys.exit(1)

    # fetch occupancy data from our backend
    try:
        response = httpx.get(OCCUPANCY_URL, timeout=120)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Backend call failed: {e}")
        sys.exit(0)

    # if backend returns fallback data, skip insert and exit gracefully
    if data.get("source") != "api":
        print(f"Backend returned fallback data, skipping insert: {data.get('message')}")
        sys.exit(0)

    count = data.get("count")
    if count is None:
        print("No count in response, skipping insert")
        sys.exit(0)

    # save into supabase
    try:
        supabase = create_client(supabase_url, supabase_key)
        sampled_at = data.get("timestamp") or datetime.now(timezone.utc).isoformat()

        supabase.table("gym_headcount_history").insert({
            "gym_id": GYM_ID,
            "count": count,
            "source": "sluggym_backend",
            "sampled_at": sampled_at,
        }).execute()

        print(f"Persisted: count={count}, sampled_at={sampled_at}")
    except Exception as e:
        print(f"Supabase insert failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()