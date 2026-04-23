# GPT Image 2 Asset Pipeline

This folder defines the production art pass for Roadwardens: Relic Run. The runtime currently ships with deterministic canvas sprites so the game is playable without generated files, but these prompts are ready to generate transparent source sprites and drop them into `public/assets/sprites/`.

## Run

```bash
$env:OPENAI_API_KEY="..."
npm run assets:gpt-image
```

The script reads `assets/gpt-image-2/prompts.json`, calls the Images API, and writes each response to the configured `output` path.

Defaults:

- `GPT_IMAGE_MODEL=gpt-image-2`
- `size=1024x1024` for sprites
- `quality=high` for character/enemy/pickup sprites
- `background=transparent` for sprites
- `output_format=png` unless an item overrides it

If the API account exposes a different current GPT Image model name, set it explicitly:

```bash
$env:GPT_IMAGE_MODEL="gpt-image-1.5"
npm run assets:gpt-image
```

## Naming

- `hero-mira-<state>.png`
- `enemy-<archetype>.png`
- `pickup-<item>.png`
- `prop-<biome-or-object>.png`
- `backdrop-<stage>.webp`

Keep raw generated sources in `public/assets/sprites/` only when they are runtime-ready. Larger PSDs, variants, or rejected generations should live outside the production tree.

## Import Notes

- Transparent PNG sprites should be downscaled to a maximum display source of `256x256` before atlas packing.
- Keep silhouettes bold enough to read at `32px` for pickups, `48px` for enemies, and `64px` for the hero.
- Preserve the in-game color roles: Mira uses blue cloak and gold lantern, XP is teal, health is red, ward magic is gold-teal, enemies are warm hostile silhouettes.
- Avoid detailed facial rendering and thin ornament lines; they shimmer on mobile and add no gameplay clarity.
- A future import can replace the canvas textures in `src/art.ts` with loaded atlas regions without touching gameplay logic.

Official OpenAI image docs used for the script parameters:

- https://platform.openai.com/docs/guides/image-generation
- https://platform.openai.com/docs/api-reference/images/createimage_api_params
