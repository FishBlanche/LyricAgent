from pydantic import BaseModel, Field


class GenerateLyricsRequest(BaseModel):
    theme: str = Field(..., min_length=1, max_length=120)
    emotion: str = Field(..., min_length=1, max_length=80)
    perspective: str = Field(..., min_length=1, max_length=80)
    keywords: str = Field(..., min_length=1, max_length=240)


class GenerateLyricsResponse(BaseModel):
    concept: str
    hooks: list[str]
    lyrics: str
