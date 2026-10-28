# Made with ZPUNK — gallery setup

This site stays a single-page ZPUNK manual. `videos/demo.mp4` remains the separate demonstration video and **is always excluded** from the music gallery.

## Add a new song video

1. Put a compressed portrait MP4 in `videos/`, for example `session-001.mp4`, `session-002.mp4`, or `late-night-house.mp4`.
2. Commit and push the site to the Git repository connected to Vercel, or deploy the full site with Vercel using its build command.
3. Vercel runs `npm run build` via `vercel.json`, scans `videos/` and generates the gallery automatically. No HTML updates or video list editing.

Files sort by **filename descending**, so names like `session-001.mp4` / `session-002.mp4` show newer, higher numbers first. Upload timestamps are not reliable after Git deployment.

Optionally add a poster image with the **same basename** alongside the video, e.g. `session-002.jpg` for `session-002.mp4`; otherwise the page attempts to show a still frame from the video on demand.

Use H.264 MP4 with AAC audio, ideally vertical (9:16) and compressed for fast web loading. Original video names become the displayed titles (`session-002.mp4` => `Session 002`).

## Existing site / initial installation

- Replace your current site contents with these files while preserving any personal videos you already have. The existing images and `demo.mp4` are included in this package.
- Keep `index.html`, `package.json`, `vercel.json`, `scripts/`, `videos/`, and `images/` at your Vercel **project root**.
- Vercel should use **Other** as its framework preset. The included `vercel.json` sets the build command and `dist` output directory. Existing Vercel build setting overrides may need to be turned off.
- To test locally, run `npm run build`, then serve the `dist/` folder with a local HTTP server (for example `python3 -m http.server 8080 --directory dist`). Opening `index.html` as `file://` may prevent `fetch()` from reading the JSON file.
- This archive intentionally contains **no song video** yet, so the new gallery displays a clean empty state until you add one. The only existing video is `demo.mp4` and it stays in its own section.

No external libraries or service subscriptions required. A browser cannot enumerate an arbitrary folder on a static site; the included build step generates the tiny JSON video list.
