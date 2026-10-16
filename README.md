# hennashakil.github.io

[![Tests](https://github.com/Hennashakil/Hennashakil.github.io/actions/workflows/test.yml/badge.svg)](https://github.com/Hennashakil/Hennashakil.github.io/actions/workflows/test.yml)

My portfolio: **[hennashakil.github.io](https://hennashakil.github.io/)**

I'm Henna Shakil, a Computer Science graduate (2026) learning cybersecurity by building tools. This site shows my projects, with two live parts:

- **whycant's latest release**, read from the GitHub API (cached for 10 minutes in the browser)
- **the chmod calculator**, answered live by my Flask API on Render, with a second server as a fallback

## How it is built

Plain HTML, CSS and JavaScript: no framework, no build step, no trackers.

| File | What it holds |
|---|---|
| `index.html` | The page |
| `style.css` | Layout, light and dark mode |
| `app.js` | The two live parts |
| `fonts/` | IBM Plex, self-hosted (SIL Open Font License), so the page makes no requests to Google |

Lighthouse (October 2026): **100** for Performance, Accessibility, Best Practices and SEO, on mobile and desktop.

## Tests

Every push runs browser tests on GitHub Actions with Playwright, on desktop, phone and dark mode: the page loads without JavaScript errors or sideways scrolling, the live parts work (and fail gracefully when GitHub or the API is down), bad input never reaches the API, and [axe](https://github.com/dequelabs/axe-core) finds zero accessibility violations.

```bash
cd tests && npm ci && npx playwright install chromium
npx playwright test
```
