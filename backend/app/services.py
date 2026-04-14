from __future__ import annotations

from random import Random

from .models import GenerateLyricsRequest, GenerateLyricsResponse


def _clean_keywords(raw_keywords: str) -> list[str]:
    keywords = [item.strip() for item in raw_keywords.split(",")]
    return [item for item in keywords if item]


def _pick_or_default(items: list[str], fallback: str) -> str:
    return items[0] if items else fallback


def generate_lyrics(payload: GenerateLyricsRequest) -> GenerateLyricsResponse:
    keywords = _clean_keywords(payload.keywords)
    anchor = _pick_or_default(keywords, "midnight streetlights")
    detail = _pick_or_default(keywords[1:], "a half-finished confession")
    image = _pick_or_default(keywords[2:], "a window full of rain")

    seed_value = "|".join(
        [payload.theme, payload.emotion, payload.perspective, payload.keywords]
    )
    rng = Random(seed_value)

    scenes = [
        "summer traffic glowing red at every light",
        "a phone screen lighting up the dark bedroom",
        "cheap glitter on the collar of a denim jacket",
        "city air sticking to the edges of a long goodbye",
        "dusty speakers shaking in the backseat",
        "street signs blurring after midnight",
    ]
    turns = [
        "I swore I was over it",
        "I keep replaying the first crack in the story",
        "I wore my bravest face like it could save me",
        "I keep folding the truth into smaller pieces",
        "I let the silence say what I could not",
    ]
    refrains = [
        f"we were {payload.emotion.lower()} in a way that looked like gold",
        f"every {anchor} still sounds like your name",
        f"I turned {detail} into something I could sing",
        f"there is a whole sky hiding inside {image}",
    ]

    scene_line = rng.choice(scenes)
    turn_line = rng.choice(turns)
    refrain_line = rng.choice(refrains)

    concept = (
        f"A {payload.emotion.lower()} pop story about {payload.theme.lower()} told from "
        f"the {payload.perspective.lower()} perspective, using details like {anchor}, "
        f"{detail}, and {image} to turn a personal memory into a big sing-along moment."
    )

    hooks = [
        f"You left your echo in the {anchor}",
        f"{payload.theme.title()} looks different in the rearview",
        f"I made a chorus out of {detail}",
    ]

    lyrics = "\n".join(
        [
            "[Verse 1]",
            f"From the {payload.perspective.lower()} side, it started with {scene_line},",
            f"{turn_line}, with {anchor} hanging in the air.",
            f"You said forever soft, I heard a warning underneath,",
            f"And I kept {detail} like a secret no one else could wear.",
            "",
            "[Pre-Chorus]",
            f"Now the room goes quiet when I think about {payload.theme.lower()},",
            f"And the mirror throws back every shade of {payload.emotion.lower()}.",
            "",
            "[Chorus]",
            f"{refrain_line},",
            f"You left your echo in the {anchor}, in the corners of the night.",
            f"I made a chorus out of {detail}, turned the ache into a light.",
            f"If this is {payload.theme.lower()}, then it burns clean and bright,",
            "And I still hear us every time the city blinks to life.",
            "",
            "[Verse 2]",
            f"There was {image}, there was truth we could not hold for long,",
            "There were promises dressed up like something we could keep.",
            f"I wrote the hard part down, then sang it back a little stronger,",
            f"So even when it hurts, it hurts in rhythm and repeats.",
            "",
            "[Bridge]",
            f"Maybe I was trying to outrun {payload.emotion.lower()},",
            f"Maybe I just needed one more night to call it what it was.",
            f"But the story keeps its color in the shadow of {anchor},",
            "And the hook keeps finding me before the morning does.",
            "",
            "[Final Chorus]",
            f"{refrain_line},",
            f"You left your echo in the {anchor}, now I wear it like a spark.",
            f"I made a chorus out of {detail}, and it follows through the dark.",
            f"If this is {payload.theme.lower()}, then I know my part by heart,",
            "I turn the memory up loud and let it bloom into the stars.",
        ]
    )

    return GenerateLyricsResponse(concept=concept, hooks=hooks, lyrics=lyrics)
