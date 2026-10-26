---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Bank Game versions compared, and decisions waiting

## What and why
A first report so Claude Desktop knows where the project stands. It compares the six Bank Game versions and lists decisions the teacher still needs to make. Current status is in `STATUS.md`; ideas are in `ROADMAP.md`.

## Details

| Version | Main differences from the one before | Features | Fun | Systems-thinking lessons |
|---|---|---|---|---|
| Copy (same code as Copy 2) | The starting version. | Click to work (up to $100/month, plus $2 per click). S halves spending for 12 months. I adds +0.6%/month interest for 24 months. 4 cars ($1k to $20k), 6-slot garage, sell at 80% of value, $20k garage upgrade. Win by filling the garage. | Click-to-earn, a growing balance bubble, interest coins, cars driving into the garage. Slow start. | A stock (balance) with inflows and outflows. A reinforcing loop drawn as arrows that thicken. A diagram puzzle after the first car. Cars depreciate while the Lamborghini appreciates. |
| Copy 2 | Same code as Copy. | Same. | Same. | Same. |
| Copy 3 | Large rework. | $8 per click, up to $250/month. 2x earnings for the first 30 seconds. P pause and help screen. Tiered bank deals at $3k, $5k, $10k (+0.4/+0.8/+1.2%/month), cancelled if the balance drops below the tier. Liquidity split into work and interest. Monthly Cash Flow panel. Sustain target. Diagram puzzle removed. | Faster start, a risk-and-reward choice, the interest share of the bar growing. | Loop gain and multiplier as numbers. The sustain balance (spending / rate) as a tipping point. Minimum-balance deals as a trade-off. |
| Copy 4 | Small cleanup. | Pause screen trimmed (loop gain, multiplier and the "what if" rate examples removed). | Cleaner pause screen. | Slightly less explicit than Copy 3. |
| Copy 5 | Bank and shop redesign. | Interest shown as APY, starting at 2.0%. Bank offers by balance: Starter 2.0%, Growth 2.6% at $5k+, Premium about 3.04% at $20k+. Bank and Dealership moved into the pause screen. | Feels like visiting real shops; upgrading the bank offer is an achievement. | Real-world rates. Premium is set so $20k exactly covers $50/month spending: equilibrium as a visible goal. |
| Current (`bank_game.py`) | Mostly layout. | Everything in Copy 5 plus clickable buttons in the pause screen. | Easiest to play; most likely to work by tapping on an iPad. | Same model as Copy 5; best fit for Levels 2 to 4. |

## Done when
The teacher has decided:
1. How the Break Time games should work (ROADMAP item 1).
2. Whether Bank Game should get touch controls (item 2).
3. Whether to bring back the diagram puzzle and the "what if" table (items 3 and 4).

Send the decisions to `to-code/` and Claude Code will pick them up.
