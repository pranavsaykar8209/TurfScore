# Innings API Specification

> **Module:** Innings
>
> **Status:** Approved (Phase 1)
>
> This document defines the complete innings lifecycle. The innings
> module manages innings state and summary only. Ball-by-ball scoring is
> handled by the Live Scoring module.

------------------------------------------------------------------------

# 1. Overview

The Innings module is responsible for:

-   Starting an innings
-   Maintaining innings state
-   Calculating innings-level totals
-   Ending an innings
-   Starting the second innings
-   Setting the chase target

The `innings` table stores only innings summary data.

------------------------------------------------------------------------

# 2. User Flow

Start Match → Start First Innings → Live Scoring → End First Innings →
Set Target → Start Second Innings → Live Scoring → End Second Innings →
Match Complete

------------------------------------------------------------------------

# 3. Business Rules

-   A match can have a maximum of two innings.
-   Only one innings can be active at a time.
-   First innings must finish before the second innings starts.
-   Target is automatically calculated after the first innings.
-   Innings status can be `pending`, `live`, or `completed`.
-   Match is completed after the second innings ends.

------------------------------------------------------------------------

# 4. APIs

## Start First Innings

POST `/api/matches/:matchId/innings`

## Get Current Innings

GET `/api/matches/:matchId/innings/current`

## Get Innings Details

GET `/api/innings/:inningsId`

## End Current Innings

POST `/api/innings/:inningsId/end`

## Start Second Innings

POST `/api/matches/:matchId/innings/second`

------------------------------------------------------------------------

# 5. Innings Calculations

Maintain the following values:

-   Total Runs
-   Total Wickets
-   Total Balls
-   Overs
-   Extras
-   Run Rate
-   Target (Second Innings)
-   Batting Team
-   Bowling Team
-   Status

These values are updated automatically by the Live Scoring module.

------------------------------------------------------------------------

# 6. Validation Rules

-   Match must exist.
-   Match must be LIVE.
-   Active innings must exist.
-   Second innings cannot start before first innings completes.
-   Completed innings cannot be modified.

------------------------------------------------------------------------

# 7. Database Operations

Writes: - innings - matches (target/current innings)

Reads: - matches - teams

All operations must run inside a transaction.

------------------------------------------------------------------------

# 8. Realtime Events

-   innings.started
-   innings.updated
-   innings.completed
-   target.set

------------------------------------------------------------------------

# 9. Testing Checklist

-   Start first innings.
-   Prevent duplicate active innings.
-   End first innings.
-   Verify target calculation.
-   Start second innings.
-   End second innings.
-   Verify match completion.

------------------------------------------------------------------------

# 10. Cursor Implementation Notes

-   Implement only innings lifecycle.
-   Do not record ball events here.
-   Do not calculate player statistics here.
-   Live Scoring module will update innings totals.
-   Stop after the Innings feature is complete.
