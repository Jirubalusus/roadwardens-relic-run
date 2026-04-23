# Roadwardens: Relic Run Asset Prompts

Use these prompts with ChatGPT image generation or the checked-in GPT Image pipeline to create a consistent production placeholder art pass. The runnable batch spec is in `assets/gpt-image-2/prompts.json`; run it with `npm run assets:gpt-image` after setting `OPENAI_API_KEY`. Export transparent PNG sprites at 1024px source size unless noted, then downscale and atlas for runtime.

## Art Direction

Mobile-readable stylized fantasy, warm lantern light against cool twilight shadows, chunky silhouettes, clean value grouping, no existing franchise symbols, no copyrighted races or named visual motifs. Isometric game asset view, readable from a small phone screen, slightly painterly but with crisp edges.

## Runtime Character Rig

Runtime convention: characters are 2D-in-3D billboard rigs. Generate one full-body reference layer plus separate transparent layers for body, head, front/back arms, front/back legs, hand weapon or casting focus, and optional glow. All layers for a character must use the same square canvas, baseline, scale, and camera angle so `src/characters.ts` can animate them by rotating/translating layers around stable pivots.

Prompt template for part sets: "Original fantasy mobile game character part sheet for a 2D-in-3D isometric billboard rig. Character: [hero/enemy description]. Produce separate transparent PNG layers on a shared 256x256 canvas: full body reference, torso/body, head, front arm, back arm, front leg, back leg, hand weapon or casting focus, magic glow. Same pose scale and baseline across every layer, crisp alpha edges, chunky mobile-readable silhouette, three-quarter isometric view, no text, no labels, no watermark."

Pivot requirements: arms pivot at shoulder, legs pivot at hip, weapon pivots at hand, glow is centered on the casting hand. Avoid cloth/hair shapes that hide the feet during the walk cycle.

## Hero

Prompt: "Original fantasy roadwarden heroine named Mira, compact mobile game character, blue travel cloak, brass road lantern, short ashwood sling staff, determined expression, warm gold accents, stylized isometric 3D-to-2D game sprite, transparent background, strong silhouette, readable at 64px, no text, no logo. Also generate matching separated rig layers: body, head, front arm, back arm, front leg, back leg, sling staff hand, lantern magic glow."

Specs: generate idle, run, hurt, cast, and victory poses. Keep cloak and lantern as identity anchors. Avoid resemblance to any existing fantasy film characters.

## Enemies

Prompt: "Set of original twilight road-haunt enemies for a mobile action survivor: thorn skulk, oathless stone brute, marsh candle wisp, cinder pass shardling, stylized isometric game sprites, chunky readable silhouettes, warm rim light, transparent background, no text. Also generate matching separated rig layers for each enemy: body, head if applicable, front arm, back arm, front leg, back leg or floating tendrils, attack hand/club/glow."

Specs: each enemy needs idle, move, hit, and dissolve frames. Use distinct shapes: low triangular skulk, square brute, floating wisp, jagged shardling.

## Pickups

Prompt: "Mobile fantasy game pickups on transparent background: teal relic shard XP, gold milestone coin, red waybread heart, blue ward charge, small isometric icons, crisp outline, readable at 32px, warm lantern highlights, no text."

Specs: keep icons high contrast with simple shapes. Avoid overly detailed jewelry.

## UI Motifs

Prompt: "Original fantasy road journey UI kit motifs, mobile game HUD, brass-and-ink buttons, route marker icons, lantern cooldown icon, health and XP bar frames, clean readable shapes, transparent background, no text, no copyrighted symbols."

Specs: export button rings, small stage badges, boon-card borders, and status icons separately.

## Environment Props

Prompt: "Stylized isometric fantasy road props for mobile game: mossy waystones, broken ancient road slabs, twisted moonlit trees, marsh lantern reeds, cinder pass cairns, ruined arch fragments, transparent background, consistent scale, chunky silhouettes."

Specs: generate prop sheets per biome. Target low visual noise so combat remains readable.

## Map Backdrops

Prompt: "Wide isometric mobile game map backdrop, original magical road journey, twilight enchanted forest leading into ancient ruins, misty but readable ground plane, clear combat space in center, warm lantern accents, no characters, no text, not a movie scene, 2048x2048."

Prompt variants:
- Whisperbough Verge: singing forest edge, emerald moss, old road stones.
- Moonfallen Causeway: broken grey causeway, pale moon crystals, ruined watch stones.
- Mire of Lanterns: teal marsh water, reed lanterns, silver road planks.
- Cinderpass Ascent: volcanic mountain road, ember cairns, dawn glow at horizon.

Runtime notes: compress final backdrops to WebP or AVIF, keep under 512 KB each, and load per stage. Use sprite atlases for characters/enemies to minimize draw calls.
