# TurfScore Scoring Engine Rules

> This document is the single source of truth for all cricket scoring
> logic used in TurfScore.

------------------------------------------------------------------------

# Core Principles

-   Every completed scoring action represents **one delivery**.
-   Every delivery must be stored in the ball history.
-   The complete match state must always be derived from ball history.
-   Undo must completely restore the previous delivery.
-   The scoring engine should be implemented as a pure function whenever
    possible.

Example:

``` ts
applyBallEvent(currentMatchState, ballEvent)
```

------------------------------------------------------------------------

# Ball Types

Supported scoring actions:

-   Run (0,1,2,3,4,6)
-   Wide (WD)
-   No Ball (NB)
-   Bye (BYE)
-   Leg Bye (LB)
-   Wicket (W)

------------------------------------------------------------------------

# Runs

Available run buttons:

-   0
-   1
-   2
-   3
-   4
-   6

Rules:

-   Each run button directly creates a delivery.
-   Selected runs are added to team score.
-   Selected runs are added to batter score.
-   Selected runs are added to bowler conceded runs.
-   Batter balls +1
-   Bowler balls +1
-   Over legal ball +1

Strike:

-   Odd runs → Change Strike
-   Even runs → Keep Strike

------------------------------------------------------------------------

# Legal Ball Rules

## Legal Deliveries

These count as legal balls:

-   Run
-   Dot Ball
-   Bye
-   Leg Bye
-   Wicket

Effects:

-   Batter Ball +1
-   Bowler Ball +1
-   Over Ball +1

------------------------------------------------------------------------

## Illegal Deliveries

These do NOT count as legal balls:

-   Wide
-   No Ball

Wide Effects:

-   Batter Ball +0
-   Bowler Ball +0
-   Over Ball +0

No Ball Effects:

-   Batter Ball +1
-   Bowler Ball +0
-   Over Ball +0

------------------------------------------------------------------------

# Wide Rules

Effects:

-   Team Runs += 1
-   Batter Runs += 0
-   Batter Balls += 0
-   Bowler Runs += 1
-   Bowler Balls += 0
-   Over Ball += 0

Current Over Display:

``` text
WD
```

------------------------------------------------------------------------

# No Ball Rules

Effects:

-   Team Runs += 1 + Runs Scored
-   Batter Runs += Runs Scored
-   Batter Balls += 1
-   Bowler Runs += 1 + Runs Scored
-   Bowler Balls += 0
-   Over Ball += 0

Current Over Display:

``` text
NB
```

------------------------------------------------------------------------

# Bye Rules

Effects:

-   Team Runs += 1
-   Batter Runs += 0
-   Batter Balls += 1
-   Bowler Runs += 0
-   Bowler Balls += 1
-   Over Ball += 1

Current Over Display:

``` text
B
```

Strike:

-   Odd runs → Change Strike
-   Even runs → Keep Strike

------------------------------------------------------------------------

# Leg Bye Rules

Effects:

-   Team Runs += 1
-   Batter Runs += 0
-   Batter Balls += 1
-   Bowler Runs += 0
-   Bowler Balls += 1
-   Over Ball += 1

Current Over Display:

``` text
LB
```

Strike:

-   Odd runs → Change Strike
-   Even runs → Keep Strike

------------------------------------------------------------------------

# Wicket Rules

When wicket is recorded:

-   Team Wickets += 1
-   Batter Balls += 1
-   Bowler Balls += 1
-   Over Ball += 1

After wicket:

-   Select New Batter

Current Over Display:

``` text
W
```

------------------------------------------------------------------------

# Strike Rules

Automatic strike changes:

Normal Runs:

-   1 → Change
-   3 → Change

End of Over:

-   First, apply normal strike change based on runs scored.
-   Then, apply end of over strike change.
-   Example: On the last ball, if the batter takes 3 runs, the strike changes twice (once for the odd runs, and once for the end of the over).

Manual:

-   User may click Change Strike

Extras:

-   Wide → No auto-change
-   No Ball → No auto-change
-   Bye → No auto-change
-   Leg Bye → No auto-change

------------------------------------------------------------------------

# Over Rules

One over contains:

``` text
6 Legal Deliveries
```

Only legal deliveries count.

Example:

``` text
1
2
WD
NB
3
4
BYE
LB
```

Legal Ball Count:

``` text
1
2
2
2
3
4
5
6
```

After 6 legal balls:

-   Over ends
-   User selects next bowler
-   Strike changes automatically

------------------------------------------------------------------------

# Undo Rules

Undo must completely restore:

-   Team Score
-   Batter Runs
-   Batter Balls
-   Bowler Runs
-   Bowler Balls
-   Wickets
-   Strike
-   Current Over
-   Required Run Rate
-   Current Run Rate

Undo removes the last ball from history.

------------------------------------------------------------------------

# Change Strike

Manual action.

Effects:

-   Swap Striker
-   Swap Non-Striker

No statistics change.

------------------------------------------------------------------------

# End Over

Allowed only after:

``` text
6 Legal Deliveries
```

Effects:

-   Swap Strike
-   Select New Bowler
-   Reset Current Over display

------------------------------------------------------------------------

# Current Over Display

Store every delivery in order.

Examples:

``` text
1 1 1 W 2 4
```

or

``` text
WD NB 1 0 W 6
```

Rules:

-   Highlight latest delivery
-   Show all deliveries including extras

------------------------------------------------------------------------

# Current Run Rate

Formula:

``` text
Current Run Rate = Total Runs / Overs Completed
```

------------------------------------------------------------------------

# Required Run Rate

Second innings only.

Formula:

``` text
Runs Required / Overs Remaining
```

------------------------------------------------------------------------

# Ball History

Every delivery should store:

-   Ball Number
-   Over Number
-   Event Type
-   Runs
-   Wicket
-   Batter
-   Bowler
-   Legal Ball
-   Timestamp

This history is the single source of truth.

------------------------------------------------------------------------

# General Rules

-   Never modify previous deliveries directly.
-   Every action creates a new ball event.
-   Match state must always be reproducible from ball history.
-   All calculations must remain deterministic.
-   Do not implement scoring logic outside the scoring engine.
-   If any cricket rule is not defined here, request clarification
    before implementation.
