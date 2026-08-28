# Image assets needed

The site is fully built and works right now with colored placeholder cards. Drop in your real Canva exports using these exact filenames and they'll appear automatically — no code changes needed.

## Profile photo
- `profile.png` — your headshot (used in the hero, bleeding off the right edge). A cutout with a transparent background (like the one already in place) works best; a plain rectangular photo works too.

## Industry work videos — Instagram Reel links (edit one JSON file, no HTML needed)
Categories and their Reels are no longer hardcoded in the page — they're all managed from **[data/work.json](../../data/work.json)**. The homepage "High-Impact Projects" section just shows a grid of category tiles (icon + name + Reel count); clicking one opens `category.html?cat=<id>`, which reads this same JSON file and renders that category's Reels using Instagram's official embed widget.

Open `data/work.json`. Each category looks like this:

```json
{
  "id": "automobile",
  "name": "Automobile",
  "icon": "fa-solid fa-car",
  "reels": [
    "https://www.instagram.com/reel/REPLACE_WITH_AUTOMOBILE_REEL_1/",
    "https://www.instagram.com/reel/REPLACE_WITH_AUTOMOBILE_REEL_2/",
    "https://www.instagram.com/reel/REPLACE_WITH_AUTOMOBILE_REEL_3/"
  ]
}
```

To wire in real content:
- Replace each `REPLACE_WITH_..._REEL_#` placeholder inside `"reels"` with a real Reel's public URL. Get it from the Instagram app: open the Reel → tap **⋯** (or the paper-plane icon) → **Copy Link**.
- **Add more Reels** to a category: just add another string to its `"reels"` array — no limit, the page adjusts automatically.
- **Remove Reels**: delete the string from the array. An empty `"reels": []` shows a friendly "no Reels yet" message on that category's page instead of breaking.
- **Add a whole new category**: copy one `{ "id": ..., "name": ..., "icon": ..., "reels": [...] }` block, give it a unique `id` (used in the URL, so keep it lowercase-with-dashes) and pick any [Font Awesome](https://fontawesome.com/search?ic=free) icon class for `"icon"`.
- **Rename or reorder categories**: change `"name"` freely, or reorder the blocks — the homepage grid follows the JSON order.

⚠️ It's a strict JSON file — every entry needs a comma except the last one in a list, and all quotes must be double quotes. If the page shows "Couldn't load categories," you likely have a syntax typo in this file (a trailing comma is the most common one).

How it behaves:
- Each Reel card shows a shimmering loading placeholder with a play icon until Instagram's real embed finishes loading — no raw/static-looking links.
- The Reel/post must be **public** — private accounts or posts won't embed.
- If a link is left as a placeholder (or a real link fails to load) for more than ~8 seconds, the card automatically switches to a small "Reel link needed" state instead of spinning forever.
- Cards are sized at 326px wide — that's Instagram's own hard-coded minimum width for their official embed widget, it cannot go smaller. On the category page they wrap onto multiple rows on wide screens and stack on mobile. If you'd rather have genuinely smaller custom-sized preview tiles, that means switching away from Instagram's official widget to custom thumbnail cards instead — let me know if you want that.
- **This needs to be served over http(s), not opened as a `file://` path** — browsers block a page from fetching a local JSON file directly off disk. Use the local server you've already got running for testing, and once you deploy the whole `vraj` folder to any static host (Netlify, Vercel, GitHub Pages, standard web hosting), it'll work the same way for visitors.

## Brand/client logos (`brands/`) — fully dynamic, no HTML editing
The "Brands I've Built Content For" logo cluster reads **[data/brands.json](../../data/brands.json)**, which just lists whatever image files are in this `brands/` folder. There's no fixed slot count — add or remove files and the homepage grid follows.

**To add/remove logos:**
1. Drop the image file(s) into `assets/img/brands/` (any name works, but the pattern already in use is `brand-34.png`, `brand-35.jpg`, etc. — pick whatever extension the file already has: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, or `.gif`).
2. Regenerate the manifest by running this from the project root:
   ```
   node scripts/generate-brands-json.js
   ```
   That rewrites `data/brands.json` to match exactly what's in the folder — no manual JSON editing needed. It'll print how many logos it found.
3. Refresh the page.

To remove a logo, delete its file from the folder and re-run the same command.

Logos display on a white circle, so square logos with transparent backgrounds look best (they'll be centered and scaled to fit).

(Don't have Node installed? You can still edit `data/brands.json` by hand — it's just `{ "logos": ["brand-01.png", "brand-02.png", ...] }`, one filename per entry, matching what's actually in the `brands/` folder.)

## Tip
Export straight from Canva: select an element/frame → Share → Download → PNG (transparent background for logos) or JPG (for photos). Then just copy the files into these folders with the filenames above.
