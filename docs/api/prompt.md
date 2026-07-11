You are a Senior Product Designer and Senior React Frontend Engineer.

Your task is to redesign the Live Scorecard page for TurfScore.

This page is for VIEWERS, not scorers.

The objective is to make the page extremely easy to scan in less than 3 seconds while keeping a premium SaaS design consistent with the TurfScore landing page.

====================================================
IMPORTANT
====================================================

Before making any changes:

- Read the entire project.
- Understand the existing design system.
- Reuse existing components.
- Do NOT redesign the entire application.
- Only redesign the Live Scorecard page.
- Follow existing color palette.
- Support both Dark and Light themes.
- Desktop first.
- Fully responsive.
- No horizontal scrolling.

====================================================
PAGE PURPOSE
====================================================

This page opens after the user enters a Session Code.

This page is READ ONLY.

There is NO scoring functionality.

There are NO editing controls.

Everything shown is fetched from the backend.

====================================================
DESIGN GOAL
====================================================

The page should immediately answer these questions:

• What's the current score?
• Who is batting?
• Who is bowling?
• What happened in the current over?
• What is the match situation?
• Full batting scorecard.
• Full bowling scorecard.

The design should feel similar to Cricbuzz / ESPN Cricinfo but with the TurfScore premium UI.

====================================================
LAYOUT
====================================================

────────────────────────────────

HEADER

────────────────────────────────

Session Name

Team A vs Team B

Large Live Badge

Current Score

Example

145 / 4

18.3 Overs

Current Run Rate

If Second Innings

Need 32 Runs from 18 Balls

Required Run Rate

Winning probability is NOT required.

Use premium typography.

Score should be the largest element.

====================================================
CURRENT MATCH STATUS CARD
====================================================

Below the score create one premium glass card.

For First Innings show

Current Score

Overs

Run Rate

Wickets

For Second Innings additionally show

Runs Required

Balls Remaining

Required Run Rate

This card should be visually highlighted.

====================================================
CURRENT BATTERS
====================================================

Create a premium card.

Title

Current Batters

Display only two players.

For each player

Name

Runs

Balls

Strike icon for striker

Example

🏏 Rohit Sharma

48 (27)

-------------------------

Virat Kohli

23 (18)

Current striker should have

Green accent

Glow

Small "STRIKER" badge

Non-striker should have

Small "NON STRIKER" badge

====================================================
CURRENT BOWLER
====================================================

Premium card

Show

Bowler Name

Overs

Runs

Wickets

Economy

Example

J Bumrah

3.2 Overs

18 Runs

2 Wickets

Economy 5.40

Highlight with bowling icon.

====================================================
CURRENT OVER
====================================================

Premium horizontal card.

Display each ball as a circular chip.

Example

1

4

.

Wd

W

6

Each chip should have different colors.

Dot

Neutral

Boundary

Green

Six

Primary accent

Wicket

Red

Wide

Orange

No Ball

Purple

This section should stand out.

====================================================
PARTNERSHIP
====================================================

Small premium card.

Current Partnership

52 Runs

31 Balls

Only display if two batters are active.

====================================================
INNINGS TABS
====================================================

Tabs

[ First Innings ]

[ Second Innings ]

If second innings has not started

Hide second tab.

Switching tabs updates only the scorecard.

No page reload.

====================================================
BATTING SCORECARD
====================================================

Title

Batting

Columns

Player

Runs

Balls

4s

6s

Dismissal

Current batters should be highlighted.

Rows should have hover effect.

Do NOT show players without batting records.

====================================================
YET TO BAT
====================================================

Below batting table.

Title

Yet to Bat

Display remaining players as rounded chips.

Example

Pant

Jadeja

Hardik

Siraj

No table.

Only chips.

====================================================
BOWLING SCORECARD
====================================================

Title

Bowling

Columns

Bowler

Overs

Runs

Wickets

Economy

Highlight current bowler.

====================================================
YET TO BOWL
====================================================

Below bowling table.

Display bowlers who have not bowled.

Rounded chips.

====================================================
RECENT OVERS
====================================================

Create a compact section.

Display last 5 overs.

Example

Over 18

1 4 W 2 . 6

Over 17

. 1 1 4 . 2

Newest over first.

====================================================
EMPTY STATES
====================================================

If match has not started

Show

"Waiting for Toss"

If innings has not started

Show

"Innings Yet to Start"

If no batting data

Show

"No Batting Data Available"

If no bowling data

Show

"No Bowling Data Available"

====================================================
RESPONSIVE DESIGN
====================================================

Desktop

Top cards in one row.

Current Batters

Current Bowler

Current Over

Partnership

Below

Tabs

Batting Table

Yet to Bat

Bowling Table

Yet to Bowl

Recent Overs

Tablet

Two-column layout.

Mobile

Everything becomes one column.

Current Score

Current Batters

Current Bowler

Current Over

Tabs

Batting

Yet to Bat

Bowling

Yet to Bowl

Recent Overs

No horizontal scrolling.

====================================================
DESIGN STYLE
====================================================

Match the TurfScore landing page exactly.

Glassmorphism

Large rounded corners

Premium spacing

Soft borders

Soft shadows

Smooth hover animations

Subtle gradients

Consistent typography

Green accent for live elements

Modern iconography

Premium empty states

====================================================
TECHNICAL REQUIREMENTS
====================================================

- Reuse existing components.
- Do not create duplicate UI components.
- Keep code modular.
- Create reusable ScoreCard components if needed.
- Maintain TypeScript strict mode.
- No lint errors.
- No unused code.
- No backend changes.
- Consume existing APIs only.

====================================================
DELIVERABLE
====================================================

When complete provide:

1. List of modified files.
2. New reusable components created.
3. Short summary of UI improvements.
4. Confirm responsive layout works on Desktop, Tablet and Mobile.