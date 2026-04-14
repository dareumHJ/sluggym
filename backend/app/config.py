import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

SLUGRUSH_API_KEY = os.getenv("SLUGRUSH_API_KEY")
COUNT_URL = "https://slugrush-backend.onrender.com/get/count"
