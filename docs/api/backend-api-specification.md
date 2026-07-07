# TurfScore Backend API Specification

> **Status:** Draft (Source of Truth)
>
> This document defines the backend API contract for TurfScore. APIs
> will be finalized and implemented feature-by-feature. Do not invent
> endpoints or business rules outside this document.

------------------------------------------------------------------------

# Development Order

1.  Sessions
2.  Teams
3.  Players
4.  Matches
5.  Innings
6.  Overs
7.  Ball-by-ball Scoring
8.  Match Reports
9.  Session Reports

Each feature will be completed before moving to the next.

------------------------------------------------------------------------

# API Documentation Template

For every endpoint, document the following:

## Endpoint

-   HTTP Method
-   URL
-   Purpose

## Request

-   Path Parameters
-   Query Parameters
-   Request Body

## Validation

-   Required fields
-   Business validations
-   Invalid scenarios

## Response

-   Success response
-   Error responses

## Database

-   Tables affected
-   Transaction requirements

## Business Rules

-   Preconditions
-   Postconditions
-   Side effects

## Realtime

-   Events emitted
-   Clients affected

------------------------------------------------------------------------

# Feature 1 --- Sessions

## APIs to Define

-   Create Session
-   Join Session
-   Get Session Dashboard
-   Update Session
-   End Session

------------------------------------------------------------------------

# Feature 2 --- Teams

## APIs to Define

-   Add Team
-   Get Teams
-   Update Team
-   Delete Team

------------------------------------------------------------------------

# Feature 3 --- Players

## APIs to Define

-   Add Player
-   Get Players
-   Update Player
-   Remove Player

------------------------------------------------------------------------

# Feature 4 --- Matches

## APIs to Define

-   Create Match
-   Get Match
-   Start Match
-   Complete Match
-   List Session Matches

------------------------------------------------------------------------

# Feature 5 --- Innings

## APIs to Define

-   Start Innings
-   End Innings
-   Get Innings Summary

------------------------------------------------------------------------

# Feature 6 --- Overs

## APIs to Define

-   Start Over
-   End Over
-   Get Over Details

------------------------------------------------------------------------

# Feature 7 --- Ball-by-Ball Scoring

## APIs to Define

-   Record Ball
-   Undo Last Ball
-   Change Strike
-   Declare Innings
-   Match State

------------------------------------------------------------------------

# Feature 8 --- Match Reports

## APIs to Define

-   Match Summary
-   Batting Scorecard
-   Bowling Scorecard
-   Fall of Wickets
-   Ball Timeline

------------------------------------------------------------------------

# Feature 9 --- Session Reports

## APIs to Define

-   Session Summary
-   Match History
-   Team Statistics
-   Player Statistics
-   Leaderboards

------------------------------------------------------------------------

# Notes

-   Finalize one feature completely before designing the next.
-   Do not implement endpoints until they are documented here.
-   Keep this document as the single source of truth for backend
    implementation.
