# Kickoff prompt: Bank Game with the lead designer

Paste the prompt below into a new **Claude Code** session opened in the `k12 sd fun` folder. Claude Code is needed (not chat) because Bank Game is Python: Claude has to run it, edit it, rebuild the web version and push.

**Using it for a new systems-thinking game:** keep the "How to work with me" section as it is; it describes how the lead designer works (drawn from the Whisker Dash session in `docs/provenance/transcripts/05_claude_2026-10_whisker-dash.md`). Change the game name and file, the "What's important about this game" section (which stocks, flows and loops the game teaches), the device notes, and the first steps.

```text
Hi Claude! I'm the lead game designer for K12 SD Fun. I'm 11. I made Whisker Dash (check docs/provenance/transcripts/05_claude_2026-10_whisker-dash.md to see how I like to work). Now I want to make Bank Game more fun AND make sure it really teaches systems thinking.

How to work with me:
- Keep replies short and simple. No big words without explaining them.
- Ask me one question at a time, and give me 2-4 choices I can pick from (I can always say my own idea).
- I go back and forth between ideas and playing. I'll often send lots of ideas at once. Make a quick list of them, ask which to do first, then build a little at a time so I can play it fast.
- After every change, tell me exactly how to play it and what to look for. I test by playing and I'll tell you what's broken.
- Never lose my progress or save. Make a backup before big changes.
- Only change bank_game.py (the Current version). Leave the old copies alone.
- You can commit and push to GitHub when we finish something that works. Just tell me when you do.

What's important about this game:
- Bank Game teaches stocks (your balance), flows (money in and out), and feedback loops (interest makes more interest). The money math is the lesson, so don't break it. New fun stuff (skins, characters, worlds, dialogue, rewards) should sit on top of the money model or connect to it, like a character who explains interest, or a reward for reaching the "interest pays for everything" balance.
- Each time we add something, tell me in one sentence which systems thinking idea it shows (or say "this one is just for fun").
- Sometimes test me: ask me what will happen to my balance before I play, then we'll check if I was right. If a lot of kids would guess wrong, that's a good spot to teach something.

iPad: I want Bank Game to work with touch on the iPad too (roadmap item 2). Right now Save (S), Pause (P) and Sell (V) need a keyboard. Add on-screen buttons for everything that needs a key, and make sure tapping works for Work. Keep the keyboard working too. When you change the game, rebuild the web version (tools/build_web_games.ps1) and start the server (tools/serve_dashboard.ps1) so I can test it on the iPad from the dashboard.

Start like this:
1. Read studio/STATUS.md and studio/ROADMAP.md, and look at bank_game.py so you know how it works now.
2. Explain to me in 5 short bullet points how the game works and what it's trying to teach.
3. Help me run the game so I can play it for a few minutes.
4. Ask me: "What was boring, what was confusing, and what would make it awesome?" Then we keep going: build a bit, I play, I give more ideas.

When we finish a work session:
- Write what we changed and what I found in testing into the studio files (STATUS.md, plus a note in TESTER_FEEDBACK.md where I'm "Lead designer, age 11", no real names). Mark roadmap item 2 as done when the iPad controls work.
- Commit and push.
```

## How the lead designer works (summary for adapting)

From the Whisker Dash session and the game archive (`docs/games/README.md`):

- Many ideas in short bursts; iterates between playing and new ideas rather than writing specs.
- Themes from real places and animals; knows animal breeds well.
- Loves collecting and unlocking: skins, accessories earned by beating a world, secret characters, rewards that match the skin.
- Story and characters: funny dialogue with answer choices, a party lobby, rideable rides, mini-games with characters, story arcs.
- Mechanics with a twist: noise meters and guards, multi-damage hazards, shields, parkour.
- Tests by playing and reports bugs in plain words; losing a save is the worst bug.
