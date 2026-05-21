#!/usr/bin/env python3
"""
Polls SlugRush occupancy API and persists headcount sample to Supabase.
Triggered by GitHub Actions on a 30-min schedule.
"""
import os
import sys
import httpx
from datetime import datetime, timezone
from supabase import create_client

COUNT_URL = "https://slugrush-backend.onrender.com/get/count"
GYM_ID = "cd748d81-b9b3-4c0e-82ae-664265448ea7"


def main():
    api_key = os.environ.get("SLUGRUSH_API_KEY")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not all([api_key, supabase_url, supabase_key]):
        print("ERROR: Missing required environment variables")
        sys.exit(1)

    # Fetch SlugRush API
    try:
        response = httpx.get(
            COUNT_URL,
            headers={"slugrush-api-key": api_key},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"SlugRush API call failed: {e}")
        # Don't fail the workflow — just skip this round
        sys.exit(0)

    count = data.get("crowd_count")
    if count is None:
        print("No crowd_count in response (gym likely closed), skipping insert")
        sys.exit(0)

    # Persist to Supabase
    try:
        supabase = create_client(supabase_url, supabase_key)
        sampled_at = data.get("timestamp") or datetime.now(timezone.utc).isoformat()

        supabase.table("gym_headcount_history").insert({
            "gym_id": GYM_ID,
            "count": count,
            "capacity": None,
            "source": "slugrush_api",
            "sampled_at": sampled_at,
        }).execute()

        print(f"Persisted: count={count}, sampled_at={sampled_at}")
    except Exception as e:
        print(f"Supabase insert failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()