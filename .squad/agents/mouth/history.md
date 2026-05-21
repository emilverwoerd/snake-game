# Mouth — History

## Project Context

- **Project:** snake-game — Browser-based canvas snake game
- **Stack:** HTML, CSS, JavaScript, Canvas API, Playwright
- **User:** Emil Verwoerd
- **Team:** Mikey (Lead), Data (Game Dev), Chunk (Tester), Emil (Product Owner/Reviewer)

## Learnings

### Canvas Game E2E Testing Patterns (2026-05-21)

- **DOM overlays are your friend:** Canvas games can't be tested with DOM selectors for in-game elements, but overlays (#start-screen, #game-over, #score-display) are regular DOM — test those normally.
- **Screenshot comparison for canvas:** Use `locator.screenshot()` and Buffer equality checks to verify canvas content changes between frames. This confirms animation/movement without needing to parse pixel data.
- **Pixel sampling for render verification:** Use `page.evaluate()` to read `getImageData()` from the canvas context — check that pixel values are non-uniform to confirm rendering.
- **Wall collision for game-over:** Send a consistent directional key and wait with generous timeout (~15s). The snake will eventually hit the wall. No need to compute exact timing.
- **Avoid tight timing assertions:** Canvas games have variable frame rates. Use `toPass()` with timeouts for retrying assertions, and `waitForTimeout()` only as frame-gap buffers, not as precise timing.
- **Playwright `webServer` config** is ideal for static game files — just point it at `npx serve .` and it auto-starts/stops the server for test runs.
