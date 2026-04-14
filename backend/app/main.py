from fastapi import FastAPI
import httpx
from .config import SLUGRUSH_API_KEY, COUNT_URL

app = FastAPI()

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
            return {
                "location": "East Gym",
                "count": data.get("crowd_count"),
                "hour": data.get("hour"),
                "minute": data.get("minute"),
                "timestamp": data.get("timestamp"),
                "source": "api",
            }
    except Exception as e:
        print(f"Occupancy fetch failed: {e}")
        return {
            "location": "East Gym",
            "count": 0,
            "timestamp": None,
            "source": "fallback",
            "message": "Live occupancy unavailable",
        }
