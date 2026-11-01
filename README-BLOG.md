# ZPUNK blog (static, no accounts)

The blog is in `blog/index.html`, and individual article pages live in `blog/`. There are no comments, likes, logins, analytics trackers, or databases.

## Publishing another post
1. Create `blog/my-new-post.html`, using the first post HTML as a template and retaining its `<head>`, header, footer and `blog.css` link.
2. Add the new post's image(s) to `blog/images/` and link to them with relative paths.
3. Add a card for the new post at the top of `blog/index.html`. Use a permanent readable filename so existing links keep working.
4. Add the new permalink as a `<url>` entry in `sitemap.xml`, optionally with a `<lastmod>` date.
5. Deploy the entire project to Vercel normally. `npm run build` copies `blog/`, `sitemap.xml`, and `robots.txt` to `dist/`, in addition to the existing gallery workflow.

The main manual has a Blog link immediately before the Sections button, both on desktop and mobile. The blog pages have the same navigation and an accessible Sections menu linking back to manual sections.

## Important
Keep `videos/demo.mp4` in place; the existing gallery build continues excluding it from the song gallery. Use real screenshots when referring to the ZPUNK interface; the waveforms in the blog are illustrative graphics rather than screenshots of app controls.
