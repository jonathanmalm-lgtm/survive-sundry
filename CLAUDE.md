# Survive Sunday — Claude Context

## Project Overview
**Survive Sunday** is a browser-based choose-your-own-adventure game set at a fictional church called Execution Church ("Make Disciples or Else"). Players choose a church staff role and navigate a single Sunday morning through 12 scenes of escalating chaos.

- **Tagline:** "This Sunday could make or break everything."
- **Tone:** The Office meets church work. Warm but sharp. Insider humor. Never cynical toward the church — always "this is so church."
- **Target audience:** Church staff and volunteers
- **Primary use case:** Staff play it and share results with their team

## Tech Stack
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- No backend — fully client-side, static site deployed to Vercel
- `localStorage` for save state
- HTML Canvas API for shareable image generation (client-side, no server needed)
- PostHog for analytics (script tag, no backend required)

## Core Gameplay Loop
1. Player enters name
2. Selects role (7 options)
3. Selects gender (Male / Female / Prefer not to say → they/them) and marital status (Married / Single / It's complicated → single track + dry acknowledgment)
4. Plays through 12 scenes — each has narrative text, a situation, character/situation image placeholder, and 4 choices
5. Choices affect 3 hidden score meters + optional flags
6. A **progress tracker** is always visible, showing current scene position (e.g. Scene 4 of 12)
7. After Scene 12: The Month-Later Meeting resolves into 1 of 8 endings (+ special variants)
8. Player receives a shareable 1080×1080px result image

## The 7 Roles
| Code | Role | Default Gender | Default Marital Status | Script Status |
|------|------|----------------|----------------------|---------------|
| WL | Worship Leader | Male | Single | ✅ Fully scripted (v1.1) |
| TL | Tech Leader | Female | Married | ✅ Fully scripted (v1.1) |
| KM | Kids Ministry Leader | Female | Single | ⚠️ Original draft (needs editing) |
| FI | First Impressions Leader | Male | Married | ⚠️ Original draft (needs editing) |
| AD | Administrator | Female | Married | ⚠️ Original draft (needs editing) |
| CP | Campus Pastor | Male | Married | ⚠️ Original draft (needs editing) |
| SM | Social Media & Photography Lead | Female | Single | ⚠️ Original draft (needs editing) |

The player's own name/gender/marital status overrides the defaults. Pronouns and spouse/single references adapt throughout.

## The 12 Scenes (same structure for all roles, role-specific content)
| # | Scene | Time |
|---|-------|------|
| 1 | Arrival | ~7:00 AM |
| 2 | Volunteer Call Time | 7:30 AM |
| 3 | Setup | 8:00 AM |
| 4 | Huddle (all 47 staff + volunteers) | 9:00 AM |
| 5 | First 10 Minutes | ~9:50 AM |
| 6 | Service 1 · Obstacle 1 | ~10:20 AM |
| 7 | Service 1 · Obstacle 2 | ~10:50 AM |
| 8 | Turnover Between Services | ~11:30 AM |
| 9 | Service 2 · Obstacle 1 | ~12:10 PM |
| 10 | Service 2 · Obstacle 2 | ~12:40 PM |
| 11 | Post-Service Talking | ~1:15 PM |
| 12 | Hits & Misses Meeting | 20 min after last service |

Catastrophic choices can skip scenes — a shorter playthrough is part of the storytelling.

## Choice Mechanics
Each scene has **4 choices**, unlabeled and **randomized in order every playthrough** (player cannot memorize Nuclear position).

| Internal Type | Description |
|---------------|-------------|
| Compassionate | Empathetic, people-first. Safe relationally, may cost ministry health. |
| Cowardly | Avoidant. Kicks problem down the road. Always comes back. |
| Bold | Direct, confident. Higher risk, higher reward. |
| Nuclear | Unhinged but understandable temptation. 60/40 or 50/50 split determined randomly at moment of choice. Player sees one outcome. |

Nuclear options must read like a **real temptation** — never labeled as Nuclear to the player.

## Scoring System (Never shown during gameplay)
| Meter | Emoji | What it measures |
|-------|-------|-----------------|
| Ministry Health | 🔥 | Craft, execution, production quality |
| Relational Capital | 🤝 | Trust with team, pastor, congregation, volunteers |
| Self-Awareness | 🫞 | Owning mistakes, reading the room, good calls under pressure |

Score movements: ±10 or ±20 per choice. Flags can apply conditional bonuses/penalties at the month-later meeting.

## The 8 Endings (resolved at Month-Later Meeting with Pastor Dave)
| # | Condition | Title |
|---|-----------|-------|
| 1 | All meters < 40 | Fired. You are now a realtor. |
| 2 | Ministry < 40, Relational < 40, Self-Aware > 60 | Reassigned. Worship Scheduling and Compliance Coordinator. |
| 3 | Ministry > 60, Relational < 40, Self-Aware < 40 | Tanner is your new boss. He has thoughts about frequency. |
| 4 | Ministry > 60, Relational < 40, Self-Aware > 60 | They called. Redemption City Church. Full benefits. Relocation package. |
| 5 | All meters > 70 | Well done, good and faithful servant. Let's plan next Sunday. |
| 6 | Ministry < 60, Relational > 60, Self-Aware > 60 | We'll do better next time. |
| 7 | Ministry < 40, Relational > 60, Self-Aware < 40 | Pay raise. You can now afford brand name Ramen noodles. |
| 8 | Ministry > 70, Relational > 70, Self-Aware < 40 | Promoted. Better title. Real authority. Absolutely no pay raise. |

**Special variants:**
- BlippiCoin paid off ($124,000) → special variant of Ending 4 regardless of scores
- BlippiCoin lost ($0) → narrative footnote added to whatever ending is reached
- Anonymous meme account discovered (WL only) → extended eye contact + "process frustrations internally"

## Shareable Result Image
- **Format:** 1080×1080px PNG, optimized for Instagram/Facebook/iMessage
- **Layout:** Execution Church branding top / ending-specific text large in middle / "Can you survive Sunday? + [URL]" bottom
- **Variants:** 2-3 copy variants per ending so the social feed isn't identical
- **Optional:** Player name as subtitle (opt-in during result screen)
- **Share options:** Download PNG, Instagram Stories, Facebook, copy link

## Recurring Characters (must be consistent across all 7 roles)
- **Greg** — Former worship pastor from a well-known church that imploded (pastor moral failure). Very good jacket. Lighting budget > staff salaries. Uses past tense about former church without noticing. Appears in Scene 4 (Huddle) for all roles.
- **Ron** — 11 years at Execution Church. Tithes each role's full salary per month and tells them. Wants real hymns. Has a printed list. Appears in Scene 7 for all roles.
- **Chad** — Bartender at Chili's who says he works in "finance and also some tech stuff." Pitches **BlippiCoin** (crypto backed by Blippi the children's entertainer) during Scene 10 of every role. Has a deck. Follows up twice on everything.
- **Dave** — Parking lot team. Laminated maps. Thumbs up. Recruits his own volunteers. Always knows things he shouldn't. Always updates the laminated map.
- **Gary** — Head usher. Always says "I just want to be honest" before saying something unhelpful. Can be gaslit about the chairs. CCs himself on emails. Always moves first after "same time next week."
- **Pastor Dave** — Campus pastor's pastor. Office smells like coffee and old books. Door note: "It's show business, not show friends." Uses emojis — absence of emoji is a tell. Runs the month-later meeting.
- **Tanner** — Pastor Dave's son, 24. 340 podcast subscribers. Spent six months at Bethel. Vocabulary is mostly "activation." Leather journal labeled "VISION DOWNLOAD." Only appears in Ending 3. First directive: remove the subwoofer ("sonically prideful"). Second: bring in an oboe.

## Recurring Situations & Rules
**Volunteer Huddle (Scene 4 — all roles):**
- 9:00 AM sharp, lobby, standing, 47 people
- A rotating staff member gives the "we get to do this" speech
- Cites 1 Corinthians 10:13 ("God won't give you more than you can handle") about being short-staffed — confidently and incorrectly (it's about resisting temptation). Nobody corrects it. Everyone nods.
- Campus pastor awards $5 Chick-fil-A gift card to the volunteer most visibly on the edge (decided at staff meeting, always a consensus)
- Greg is introduced

**Hits & Misses Meeting (Scene 12 — all roles):**
- 20 min after last service, lobby/side room, standing, no food, hard stop
- Campus pastor goes first (one win, one miss), then around the room
- Nobody claims the lobby when it comes up
- Nobody claims the haze when it comes up
- Gary always says something unhelpful
- Ends: "Same time next week." → four seconds → Gary moves first → everyone moves at once

**The $5 Chick-fil-A Gift Card:** Decided at staff meeting. Always a consensus. Recipient always receives it with the expression of someone who didn't know they were being watched but is very glad they were.

**BlippiCoin:** $200 investment. 50/50 outcome determined at month-later meeting (not at time of investment). Worth $124,000 or $0.

**The worship team:** Uses **in-ears — not monitor wedges**. Elevation Worship songs exclusively.

**Pastor Dave's office door:** Always has a paper taped to it: "It's show business, not show friends."

## Technical Requirements
- Browser-based, **mobile-first**, functional on desktop
- No app download, no login, fully anonymous play
- `localStorage` / `sessionStorage` save state: role, name, gender, marital status, scene progress, choices, flags, scores
- All story content **pre-loaded** — no API calls during gameplay
- Choice order randomized every scene
- Nuclear outcome: 60/40 or 50/50 determined randomly at moment of choice — **not pre-seeded**
- BlippiCoin result: 50/50 at month-later meeting resolution — **not at time of investment**
- Target load time: under 3 seconds on mobile
- Image generation: within 2 seconds of ending resolution
- Native share sheet on mobile (iOS + Android)

## Content Principles
1. Never mean toward the church — insider humor, not cynical
2. Specific beats general ("Marcus's lighting involves a lot of deep red" > "the lighting looked bad")
3. No mirrored sentences — avoid "X happened. X always happens." Cut the second sentence.
4. Passive aggression is a tool — use what isn't said
5. The emoji does a lot of work (especially 🙂 on a corrective text; absence of emoji is always a tell)
6. Nuclear options must feel like a real temptation
7. Consequences should be earned — good outcomes from good choices, chaos from chaos
8. Short sentences land harder — if it can be cut, cut it
9. The four-second pause after "same time next week" is sacred — never rushed or skipped
10. Gary always moves first — non-negotiable

## Story Tree Status
The story tree document (v1.1) contains:
- **WL and TL scripts:** Fully written and edited — all 12 scenes, all choices, all endings
- **KM, FI, AD, CP, SM scripts:** Original draft versions (v1.0) — queued for editing

Key v1.1 consistency updates to apply when editing remaining roles:
1. Greg = former worship pastor from an imploded church (moral failure). Past tense. Good jacket.
2. Ron = tithes the role's full salary and tells them. 11 years at the church.
3. Chad = bartender at Chili's, pitches BlippiCoin in Scene 10.
4. H&M meeting = no food, standing, Gary unhelpful, Gary moves first.
5. Huddle = 1 Corinthians 10:13 used confidently and incorrectly about staffing.
6. Worship team = in-ears, not monitor wedges.
7. Pastor Dave's door = "It's show business, not show friends."
8. Nuclear options not labeled Nuclear to the player. Choices randomized in order.

## Finalized Decisions
1. **All 7 roles at launch** — KM/FI/AD/CP/SM are draft-level but playable
2. **Client-side HTML Canvas** for image generation — static site on Vercel, zero backend, zero cost
3. **Hard scene skip** on catastrophic choices — shorter playthrough is intentional storytelling
4. **Markdown files** for all story content — editable without touching code
5. **PostHog** analytics — one script tag
6. **No sound design** — text-based, image placeholders for characters/situations, no audio
7. **Scores never shown** to player — only revealed through the month-later meeting narrative
8. **Progress tracker** — visual bar broken into 14 segments: Intro · Scene 1–12 · Final (Month-Later Meeting). Active segment is highlighted. On a hard skip, the bar jumps forward visually — the skip is visible.
9. **Self-paced** — no timer
10. **BlippiCoin** resolved at month-later meeting, not at Scene 10
11. **Player name** in shareable image is opt-in
12. **Replay prompt** shown after ending — encourages trying a different role

## Remaining Open Question
- ~~Domain?~~ **execution.jonathanmalm.com**

## Commands
```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Future Content (post-launch)
- Remaining role scripts: KM, FI, AD, CP, SM
- Seasonal variants: Christmas Eve, Easter, Church Anniversary
- "The Conference" expansion
- Multiplayer mode (same Sunday, different roles)
- Leaderboard for most catastrophic Sunday
- "Staff Meeting" mini-game (shorter format, set during the week)
