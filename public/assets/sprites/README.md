# Runtime Sprite Drop Folder

Generated GPT Image sprites go here when they are ready for runtime use.

The current build loads `gpt-character-atlas-v2.png` as the generated full-body source layer for the character rigs in `src/characters.ts`. The rigs also use animated limb layers so the game remains visibly animated even while production-quality per-part GPT Image files are being refined.

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
