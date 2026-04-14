from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import GenerateLyricsRequest, GenerateLyricsResponse
from .services import generate_lyrics

app = FastAPI(title="LyricAgent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate", response_model=GenerateLyricsResponse)
def generate(payload: GenerateLyricsRequest) -> GenerateLyricsResponse:
    return generate_lyrics(payload)
