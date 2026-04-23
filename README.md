# Roadwardens: Relic Run

Mobile-first 3D isometric action survivor built with Three.js, TypeScript, and Vite. It is a new original fantasy road-journey IP about carrying a fellowship beacon across cursed route stages.

## Gameplay

- Survive four timed stages: enchanted forest, ruined causeway, lantern marsh, and mountain pass.
- Move with the left touch joystick while the hero auto-fires at the nearest enemy.
- Use the `WARD` button for an area burst and knockback panic tool.
- Collect relic shards for XP, level up, and choose one of three build upgrades.
- Complete the full route or restart with a different build path.

## Local Development

```bash
npm install
npm run dev
```

Open the printed local URL on a phone or mobile emulator. The app is touch-first and also supports basic keyboard movement for desktop testing.

## Production Build

```bash
npm run build
npm run preview
```

The static production output is written to `dist/` and is suitable for GitHub Pages.

## GitHub Pages Deployment

If using `gh` with an authenticated account:

```bash
gh repo create roadwardens-relic-run --public --source=. --remote=origin --push
npm run build
gh workflow run deploy.yml
```

This repo includes a GitHub Actions workflow that publishes `dist/` to Pages on every push to `master` or `main`.

If Pages is not enabled yet, run:

```bash
gh api -X POST repos/:owner/:repo/pages -f source.branch=gh-pages -f source.path=/
```

or enable Pages in GitHub repository settings with GitHub Actions as the source.

## Character Art Pipeline

The runtime uses a mobile-friendly 2D-in-3D character rig: each actor is a billboard group with a generated-art body layer plus separately animated arms, legs, weapon/casting glow, and shadow. Movement drives visible walk cycles; attacks use windup, strike, and recovery poses for clearer timing.

This repo includes GPT Image generated source atlases at `assets/gpt-image-2/generated/character-atlas-source.png` and `assets/gpt-image-2/generated/character-atlas-source-v2.png`. The current transparent runtime import is `public/assets/sprites/gpt-character-atlas-v2.png`. Future production passes should replace or extend those with the layered parts described in `ASSET_PROMPTS.md`.

See `assets/gpt-image-2/` for the ready-to-run GPT Image asset pipeline and `ASSET_PROMPTS.md` for broader art direction notes.

```bash
npm run assets:gpt-image
```

Set `OPENAI_API_KEY` first when using the API script. The pipeline writes generated sprites to `public/assets/sprites/`.
