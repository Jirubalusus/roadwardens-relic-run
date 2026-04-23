# Runtime Sprite Drop Folder

Generated GPT Image sprites go here when they are ready for runtime use.

The current build loads `hero-mira/mira-state-sheet.webp` as the generated full-body hero animation sheet in `src/characters.ts`. The hero is selected from explicit `idle`, `walk`, `attack`, and `hit` clips, so movement and attacks swap complete character poses instead of holding one fixed body sprite.

`gpt-character-atlas-v2.png` is still used by the enemy rigs. Enemy animation continues through the shared state-machine update path, with procedural limb motion retained until matching enemy state sheets are produced.

Source PNGs for generated sheets live outside the public runtime payload under `assets/gpt-image-2/generated/`.

Preferred production naming for layered characters:

- `hero-mira/body.png`, `head.png`, `arm-front.png`, `arm-back.png`, `leg-front.png`, `leg-back.png`, `weapon.png`, `glow.png`
- `enemy-skulk/...`
- `enemy-brute/...`
- `enemy-wisp/...`

Each layer should be transparent PNG/WebP, centered on the same 256x256 canvas, with the feet on the same baseline. Keep pivots stable: legs pivot at hip, arms at shoulder, weapon at hand, glow at hand/caster focus.

Keep generated PNG/WebP files in this folder only after they have been checked for:

- transparent or clean opaque background as intended
- bold silhouette at phone size
- no text, watermark, or franchise resemblance
- compressed size appropriate for mobile
