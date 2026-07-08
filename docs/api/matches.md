# Matches API Specification

> **Module:** Matches
>
> **Status:** Approved (Phase 1)
>
> This document is the source of truth for all Match-related backend APIs
> in TurfScore.

------------------------------------------------------------------------

# 1. Overview

The Matches module manages the creation and tracking of matches between teams within a session.

Matches are the core entity where live scoring and game tracking happen.

------------------------------------------------------------------------

# 2. User Flow

``` text
Session Dashboard
    ↓
Create Match
    ↓
Select Teams & Settings
    ↓
Match Created
    ↓
Live Scoring (Separate Module/Phase)
```

------------------------------------------------------------------------

# 3. Business Rules

- Every match belongs to one session.
- A match involves exactly two distinct teams from the same session.
- A match requires configuring match settings (like total overs).
- Match status tracks the lifecycle (e.g., Scheduled, In Progress, Completed).
- A match cannot be deleted once scoring has started.

------------------------------------------------------------------------

# 4. API Endpoints

## Create Match

POST `/api/sessions/:sessionCode/matches`

Creates a new match between two teams in a session.

## Get Matches

GET `/api/sessions/:sessionCode/matches`

Returns all matches in a session.

## Get Match

GET `/api/matches/:matchId`

Returns details of a specific match.

## Update Match

PATCH `/api/matches/:matchId`

Updates match details (e.g., status, settings).

## Delete Match

DELETE `/api/matches/:matchId`

Deletes a scheduled match if allowed.

------------------------------------------------------------------------

# 5. Request & Response Models

Each endpoint must define: 
- Request 
- Response 
- Error Response

------------------------------------------------------------------------

# 6. Validation Rules

Create 
- Session must exist. 
- Both teams must belong to the session.
- Team 1 and Team 2 must be different.
- Number of overs must be provided and valid (e.g., > 0).

Update 
- Match must exist. 
- Valid state transitions only.

Delete 
- Match must exist. 
- Match status must not be 'In Progress' or 'Completed' (scoring hasn't started).

------------------------------------------------------------------------

# 7. Database Operations

Primary Table 
- matches

Reference Tables 
- sessions 
- teams 
- innings (Future)
- balls (Future)

------------------------------------------------------------------------

# 8. Transaction Flow

Create 
1. Validate session and both teams. 
2. Insert match. 
3. Return created match.

Update 
1. Validate match and new data. 
2. Update match. 
3. Return updated match.

Delete 
1. Validate match status. 
2. Delete match. 
3. Return success.

------------------------------------------------------------------------

# 9. Error Handling

- 200 OK
- 201 Created
- 400 Bad Request (Invalid teams or settings)
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

------------------------------------------------------------------------

# 10. Realtime Events

- match.created
- match.updated
- match.deleted

------------------------------------------------------------------------

# 11. Testing Checklist

- Create match successfully
- Reject match creation with invalid teams (e.g., same team or teams not in session)
- Get all matches for a session
- Get match by ID
- Update match status
- Prevent deletion of in-progress matches
- Delete scheduled match successfully

------------------------------------------------------------------------

# 12. Cursor Implementation Notes

- Do not modify database schema.
- Use existing Drizzle schema.
- Controllers → Services → Repositories.
- Validate requests.
- Integrate only with existing frontend.
- Do not create new UI if it doesn't exist.
- Do not implement live scoring (innings, balls) yet.
- Stop after Matches feature is complete.
