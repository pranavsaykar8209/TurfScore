# Scoring Engine

This document defines the rules and logic for the scoring engine, match flow, and state management in TurfScore. The scoring engine automatically enforces these rules without manual intervention.

## Innings End Rules

An innings automatically ends when ANY ONE of the following conditions becomes true:

### Rule 1 — All Batters Out
When the batting team has no remaining batters available (i.e., Total Wickets >= Team Size - 1).

**Effects:**
- Lock current innings.
- Save innings statistics.
- Disable scoring.
- If First Innings:
  - Show "Innings Complete".
  - Display target = First Innings Score + 1.
  - Allow user to start Second Innings.
- If Second Innings:
  - Finish the match automatically.

### Rule 2 — Overs Completed
When the configured number of overs has been completed (e.g., after 10.0 overs in a 10 Over Match).

**Effects:**
- Lock current innings.
- Save innings statistics.
- Disable scoring.
- If First Innings:
  - Show target.
  - Allow starting Second Innings.
- If Second Innings:
  - Finish match automatically.

---

## Second Innings Rules

When the second innings starts:
- Reset score to 0/0.
- Reset overs.
- Reset current over.
- Select opening batters.
- Select opening bowler.
- Display target from first innings.

---

## Winning Conditions

During the Second Innings, the match status is continuously checked after every scoring event.

### Batting Team Wins
**Condition:** If Current Score >= Target.
**Effects:**
- Match ends immediately.
- Winner = Batting Team.
- Remaining balls do not need to be played.
- Disable scoring.
- Generate final scorecard.

### Bowling Team Wins
**Condition:** If all batters are out before reaching the target OR overs are completed before reaching the target.
**Effects:**
- Winner = Bowling Team.
- Match ends.
- Disable scoring.
- Generate final scorecard.

### Tie Match
**Condition:** If Second innings score == Target - 1 AND (overs completed OR all batters out).
**Effects:**
- Result = Tie.
- Finish match.
- Generate scorecard.

---

## Match Finish

When the match finishes:
- Lock the match.
- Disable all scoring buttons.
- Save all match statistics.
- Save player statistics.
- Save team statistics.
- Generate match summary.
- Generate batting scorecard.
- Generate bowling scorecard.
- Generate winner information.

---

## State Management

The scoring engine automatically evaluates the following after every completed delivery:
1. Is innings complete?
2. Should second innings start?
3. Has batting team reached target?
4. Are overs complete?
5. Are all batters out?
6. Is the match finished?

These checks happen automatically inside the state hook (`useMatchState`), guaranteeing the correct transition of states without external triggers.

---

## UI Behaviour

**When an innings ends:**
Display an "Innings Complete" dialog with:
- Final Score
- Overs
- Wickets
- Target (if first innings)
- Button:
  - Start Second Innings
  - OR View Match Result

**When the match ends:**
Display a "Match Complete" dialog with:
- Winner
- Win Margin (Runs/Wickets)
- Final Scores
- Match Summary
- Buttons:
  - View Scorecard
  - View Statistics
  - Back to Session Dashboard
