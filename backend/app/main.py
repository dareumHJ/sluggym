from fastapi import FastAPI
import httpx

from .config import COUNT_URL, SLUGRUSH_API_KEY

app = FastAPI()

LOCATION_NAME = "East Gym"
LIVE_SOURCE = "api"
FALLBACK_SOURCE = "fallback"


def unavailable_payload(message: str):
    return {
        "location": LOCATION_NAME,
        "count": None,
        "hour": None,
        "minute": None,
        "timestamp": None,
        "source": FALLBACK_SOURCE,
        "status": "unavailable",
        "is_live": False,
        "is_stale": True,
        "message": message,
    }


@app.get("/occupancy")
async def get_occupancy():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                COUNT_URL,
                headers={"slugrush-api-key": SLUGRUSH_API_KEY},
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
            crowd_count = data.get("crowd_count")
            if crowd_count is None:
                return unavailable_payload("Live occupancy count unavailable")
            return {
                "location": LOCATION_NAME,
                "count": crowd_count,
                "hour": data.get("hour"),
                "minute": data.get("minute"),
                "timestamp": data.get("timestamp"),
                "source": LIVE_SOURCE,
                "status": "live",
                "is_live": True,
                "is_stale": False,
            }
    except Exception as e:
        print(f"Occupancy fetch failed: {e}")
        return unavailable_payload("Live occupancy unavailable")
