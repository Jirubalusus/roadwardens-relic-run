# GPT Image 2 Asset Pipeline

This folder defines the production art pass for Roadwardens: Relic Run. The runtime is now prepared for GPT Image character art: `src/characters.ts` renders each hero/enemy as a layered billboard rig, loads the generated full-body atlas from `public/assets/sprites/gpt-character-atlas.png`, and animates separate arms/legs/weapon/glow layers for walk and attack motion.

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

- `gpt-character-atlas.png` for a quick 2x2 full-body atlas: top-left hero, top-right skulk, bottom-left brute, bottom-right wisp
- `hero-mira-<state>.png`
- `hero-mira/<part>.png` for layered rig imports: `body`, `head`, `arm-front`, `arm-back`, `leg-front`, `leg-back`, `weapon`, `glow`
- `enemy-<archetype>.png`
- `enemy-<archetype>/<part>.png` with the same layer names when possible
- `pickup-<item>.png`
- `prop-<biome-or-object>.png`
- `backdrop-<stage>.webp`

Keep raw generated sources in `public/assets/sprites/` only when they are runtime-ready. Larger PSDs, variants, or rejected generations should live outside the production tree.

## Import Notes

- Transparent PNG sprites should be downscaled to a maximum display source of `256x256` before atlas packing.
- Keep silhouettes bold enough to read at `32px` for pickups, `48px` for enemies, and `64px` for the hero.
- Preserve the in-game color roles: Mira uses blue cloak and gold lantern, XP is teal, health is red, ward magic is gold-teal, enemies are warm hostile silhouettes.
- Avoid detailed facial rendering and thin ornament lines; they shimmer on mobile and add no gameplay clarity.
- A future import can replace the generated full-body atlas and procedural interim limb layers in `src/characters.ts` with final GPT Image part textures without touching gameplay logic.

Official OpenAI image docs used for the script parameters:

- https://platform.openai.com/docs/guides/image-generation
- https://platform.openai.com/docs/api-reference/images/createimage_api_params
