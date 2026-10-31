# Endless Crucible

- **Genre:** crafting / discovery sandbox (combine two things to make a new one)
- **File:** `endless-crucible/index.html` (~31 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/endless-crucible/`
- **Save key:** `endless-crucible-v1` (discoveries and learned reactions)
- **Brief:** derived from the code.

## Concept and feel
A dot-grid workbench plus a tray of everything you have found. Drag two items together to react them. Start with Water, Fire, Earth and Wind and discover your way up to Human, City, and beyond. Unlike a fixed recipe game, unknown combinations are *invented on the spot by Claude* when the page is running in claude.ai.

## Controls
Drag items from the tray to the board; drop one onto another to combine; search box filters the tray; tray moves to the bottom on phones.

## Rules and numbers
- Start items: Water 💧, Fire 🔥, Earth 🌍, Wind 🌬️.
- Reaction lookup order: (1) built-in recipe book (`BOOK_TEXT`, ~300 lines of `A + B = Result | emoji`), (2) `state.learned` (cached results), (3) Claude via `window.claude.use("sample")`; with a quick model tier and a 24-hour cache.
- If Claude is unavailable (for example on GitHub Pages) the status badge reads "Recipe book only" and unknown combinations simply fail.
- Invented names are sanitized: letters/digits/space/&/-/. only, ≤32 chars, Title Case; the emoji is limited to 4 characters; duplicates map to the existing item.
- Order does not matter (`key(a,b)` is symmetric).

## Content (sample of the recipe book)
Water+Fire=Steam · Water+Earth=Plant · Fire+Earth=Lava · Water+Water=Lake · Lava+Water=Stone · Stone+Fire=Metal · Plant+Water=Tree · Steam+Wind=Cloud · Cloud+Fire=Lightning · Lightning+Mud=Life · Life+Earth=Human · Human+Metal=Tool · Wood+Human=House · House+House=Village · Village+Village=City.

## LLM prompt used for new reactions
> You are the reaction engine of a crafting game. Players start with Water, Fire, Earth and Wind and combine any two things to discover a new thing. Combine "{a}" + "{b}". Rules: the result is one noun or well-known concept (an object, creature, place, idea, person type, food, invention, etc.), 1 to 3 words, Title Case. Make it logical and a little playful. It should usually be different from both inputs. No sentences. Reply with only JSON like {"name": "Steam", "emoji": "💨"} using exactly one emoji.

## Architecture (code map)
`START` → `BOOK_TEXT` parsed into a map → `state` + localStorage → `react(a,b)` (async) → inventory render/search → node creation, drag/drop and collision → discovery toast.

## Accessibility and touch
Atkinson Hyperlegible body font; light/dark theme via `prefers-color-scheme`; pointer events for touch.

## Known limits
Needs claude.ai to be "endless"; on Pages it is a finite recipe book. Discoveries are per-browser.

## Re-prompt spec
"A drag-and-combine crafting game with four starting elements and a recipe book; unknown pairs are resolved by an LLM call returning {name, emoji}; cache results; persistent discoveries; searchable tray; dot-grid board; graceful fallback when no LLM is available."

## Verification checklist
- [ ] Water + Fire gives Steam
- [ ] Same pair in reverse order gives the same result
- [ ] Reload keeps discoveries
- [ ] Badge shows "Recipe book only" when no LLM is present
