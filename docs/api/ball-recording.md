# 06-ball-recording.md

> **TurfScore - Ball Recording Specification**
>
> **Purpose**
>
> This document is the single source of truth for implementing ball
> recording in TurfScore. Every recorded ball MUST be processed using
> one database transaction. This specification defines validations,
> database updates, strike rotation, over progression, innings
> completion, undo behavior, and API contracts.

------------------------------------------------------------------------

# 1. Scope

This document covers:

-   Record Ball API
-   Undo Ball API
-   Validation Rules
-   Transaction Rules
-   Database Updates
-   Strike Rotation
-   Over Progression
-   Innings Completion
-   Match Completion
-   Error Handling

Tables affected:

-   balls
-   player_stats
-   innings
-   matches

------------------------------------------------------------------------

# 2. Transaction Rule

Every ball MUST execute in a single database transaction.

Flow:

1.  Validate request
2.  Load current match state
3.  Insert row into `balls`
4.  Update batter statistics
5.  Update bowler statistics
6.  Update innings totals
7.  Update match state
8.  Rotate strike if required
9.  Complete over if required
10. Complete innings if required
11. Commit

If any step fails: - Rollback transaction. - Return error. - No partial
updates.

------------------------------------------------------------------------

# 3. Record Ball API

Endpoint

POST /matches/:matchId/ball

Example Request

``` json
{
  "strikerId":12,
  "nonStrikerId":18,
  "bowlerId":6,
  "runsOffBat":4,
  "extraType":null,
  "extraRuns":0,
  "isLegalBall":true,
  "isWicket":false,
  "dismissedPlayerId":null
}
```

Success Response

``` json
{
  "success":true,
  "message":"Ball recorded successfully"
}
```

------------------------------------------------------------------------

# 4. Validation Rules

Before recording a ball:

-   Match must exist
-   Match status must be LIVE
-   Current innings must exist
-   Striker must exist
-   Non-striker must exist
-   Bowler must exist
-   Bowler cannot equal striker
-   Bowler cannot equal non-striker
-   Batter must belong to batting team
-   Bowler must belong to bowling team
-   Over must not be completed
-   Innings must not be completed

------------------------------------------------------------------------

# 5. Ball Numbering

Legal Ball

-   increments ball_number

Illegal Ball

-   Wide
-   No Ball

do NOT increment ball_number.

Every delivery inserts one row into balls.

------------------------------------------------------------------------

# 6. Legal Ball Scenarios

## Dot Ball

Insert

runs_off_bat = 0 extra_runs = 0 is_legal_ball = true

Updates

player_stats

Batter

-   balls_faced +1

Bowler

-   balls_bowled +1

innings

-   no run

No strike change.

------------------------------------------------------------------------

## Single

Insert

runs_off_bat=1

Updates

Batter

runs +1

balls +1

Bowler

runs_conceded +1

balls_bowled +1

innings

total_runs +1

Strike changes.

------------------------------------------------------------------------

## Two

runs +2

balls +1

bowler runs +2

legal ball

No strike change.

------------------------------------------------------------------------

## Three

runs +3

balls +1

bowler +3

Strike changes.

------------------------------------------------------------------------

## Four

runs +4

balls +1

fours +1

bowler +4

Strike unchanged.

------------------------------------------------------------------------

## Five

runs +5

balls +1

bowler +5

Strike changes.

------------------------------------------------------------------------

## Six

runs +6

balls +1

sixes +1

bowler +6

Strike unchanged.

------------------------------------------------------------------------

# 7. Wide

Insert

extra_type=WIDE

extra_runs\>=1

is_legal_ball=false

Updates

innings

extras += extra_runs

total_runs += extra_runs

Bowler

runs_conceded += extra_runs

No batter ball faced.

No ball count.

If completed runs are odd

swap strike.

------------------------------------------------------------------------

# 8. No Ball

Insert

extra_type=NO_BALL

is_legal_ball=false

Updates

innings

extras +=1+bat runs

Bowler

runs_conceded +=1+bat runs

Batter

runs += runs_off_bat

balls faced unchanged

No legal ball.

------------------------------------------------------------------------

# 9. Bye

extra_type=BYE

legal delivery

runs added to extras

batter balls +1

bowler ball +1

bowler NOT charged

strike changes if odd.

------------------------------------------------------------------------

# 10. Leg Bye

Same as Bye except

extra_type=LEG_BYE

legal delivery

------------------------------------------------------------------------

# 11. Wickets

Supported

-   Bowled
-   Run Out
-   Retired Out

Bowled

legal delivery

bowler wickets +1

batter out

balls faced +1

innings wickets +1

------------------------------------------------------------------------

Run Out

innings wickets +1

No bowler wicket.

If striker dismissed

new batter takes striker position unless over ended.

If non-striker dismissed

new batter takes non-striker position.

------------------------------------------------------------------------

Retired Out

innings wickets +1

No bowler wicket.

batter out

balls faced +1

------------------------------------------------------------------------

# 12. Strike Rotation

Odd completed runs

swap striker

Even completed runs

retain striker

End of over

swap striker

------------------------------------------------------------------------

# 13. Over Completion

After six legal balls

over_number++

ball_number=1

swap strike

change bowler

------------------------------------------------------------------------

# 14. Innings Completion

Complete innings when

-   all wickets lost
-   target achieved
-   overs exhausted

Update matches.current_inning

or

matches.status=COMPLETED

------------------------------------------------------------------------

# 15. Undo Ball API

DELETE /matches/:matchId/ball/last

Rules

Reverse last recorded delivery only.

Reverse

balls

player_stats

innings

matches

Restore striker

Restore non-striker

Restore bowler state

Restore over count

Everything inside one transaction.

------------------------------------------------------------------------

# 16. Error Responses

400 Invalid request

404 Match not found

409 Match already completed

409 Innings completed

409 Invalid striker

409 Invalid bowler

500 Transaction failed

------------------------------------------------------------------------

# 17. Edge Cases

-   Wide boundary
-   No Ball + Six
-   Wide + Run Out
-   No Ball + Run Out
-   Bye + Run Out
-   Leg Bye + Run Out
-   Final ball wicket
-   Winning runs with boundary
-   Winning runs with wicket
-   Tie
-   Last wicket

Each follows the same transaction rule: Insert ball -\> Update
player_stats -\> Update innings -\> Update match -\> Commit.

------------------------------------------------------------------------

END OF SPECIFICATION
