---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Whisker Dash: cart sprites, secret cats in the secret lobby, 70 worlds on the site

## What and why
The designer asked for the moving platforms that looked like shopping carts to be fixed, and for secret cats to live in the
secret lobby (not with the regular lobby friends), each with its own lines. The GitHub Pages copy was also behind the
claude.ai version, so it was brought up to date.

## Details
- Commit 918339f on main. Luggage carts in the hotel lobbies, a hay wagon in Câmpeni, a mine cart in the Copper Mine; The Store keeps its shopping carts.
- Every found secret cat (64 in all) relaxes in the secret lobby's VIP Lounge with its own lines; none appear with the regular friends.
- Game now has 70 worlds and 341 levels; the earlier phone fixes (no pinch zoom, no long-press select, menus fit) are kept.
- Tested: `tests/smoke.js` (341 levels, 0 errors), `tests/mechanics.js` (all OK), plus screenshots of the lounge and carts.

## Done when
Nothing needed. The designer may want to check the Home Screen app on their phone.
