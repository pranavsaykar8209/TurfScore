# Player Statistics API Specification

> **Module:** Player Statistics **Status:** Approved (Phase 1)

## 1. Overview

The `player_stats` table stores **one record per Player + Match +
Innings**.

It is a **live statistics cache**, while the `balls` table remains the
source of truth.

------------------------------------------------------------------------

## 2. Business Rules

-   One row per Player + Match + Innings.
-   Create the row when the player first bats or bowls.
-   Update after every recorded ball.
-   Batting and bowling statistics are stored together.
-   Statistics must always match the ball history.

------------------------------------------------------------------------

## 3. Statistics Maintained

### Batting

-   Runs
-   Balls Faced
-   Fours
-   Sixes

### Bowling

-   Balls Bowled
-   Maidens
-   Runs Conceded
-   Wickets
-   Wides
-   No Balls

------------------------------------------------------------------------

## 4. Update Flow

For every recorded ball:

1.  Insert into `balls`
2.  Update `overs`
3.  Update `innings`
4.  Update striker's `player_stats` (Handle Runs, Balls Faced, Extras)
5.  Update non-striker's `player_stats` (If dismissed via run out)
6.  Update bowler's `player_stats` (Handle Balls Bowled, Runs Conceded, Wickets, Extras)
7.  Commit transaction

**Special Scenarios**:
- **Dismissals**: If `isWicket` is true, the dismissed player's `player_stats` must have `isOut` updated to true and dismissal info recorded. This could be the striker or non-striker (e.g., run out).
- **Byes / Leg Byes**: These extras do *not* add to the striker's `runs` and do *not* add to the bowler's `runsConceded`.
- **Wides / No Balls**: These add to the bowler's `runsConceded` and `wides`/`noBalls` count, but do *not* add to the striker's `ballsFaced` (for wides) or `runs` (unless runs are run).

------------------------------------------------------------------------

## 5. Database Rules

Primary Key - player_stats_id

Unique Constraint - player_id + match_id + inning_id

Foreign Keys - player_id - match_id - inning_id - team_id

------------------------------------------------------------------------

## 6. Read Operations

-   Match Scorecard
-   Player Match Statistics
-   Session Player Statistics
-   Leaderboards

All reports should read from this table instead of recalculating from
balls.

------------------------------------------------------------------------

## 7. Validation

-   Player exists.
-   Match exists.
-   Innings exists.
-   Team is valid.
-   Duplicate records are not allowed.

------------------------------------------------------------------------

## 8. Error Handling

-   400 Bad Request
-   404 Not Found
-   409 Conflict
-   500 Internal Server Error

------------------------------------------------------------------------

## 9. Testing Checklist

-   Create row automatically.
-   Update batting stats.
-   Update bowling stats.
-   Validate unique constraint.
-   Generate scorecards.
-   Generate player reports.
-   Generate leaderboards.

------------------------------------------------------------------------

## 10. Cursor Notes

-   Treat this as a cache table.
-   Never use it as the source of truth.
-   Always update it in the same transaction as:
    -   balls
    -   overs
    -   innings
-   Rollback the entire transaction if any update fails.
