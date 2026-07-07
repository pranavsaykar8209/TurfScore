# Teams API Specification

> **Module:** Teams
>
> **Status:** Approved (Phase 1)
>
> This document is the source of truth for all Team-related backend APIs
> in TurfScore.

------------------------------------------------------------------------

# 1. Overview

The Teams module manages cricket teams within a session.

A team always belongs to one session and is created before players and
matches.

------------------------------------------------------------------------

# 2. User Flow

``` text
Session Dashboard
    ↓
Add Team
    ↓
View Teams
    ↓
Update Team
    ↓
Delete Team
```

------------------------------------------------------------------------

# 3. Business Rules

-   Every team belongs to one session.
-   Team names must be unique within a session.
-   Same team names are allowed in different sessions.
-   A team cannot be created for a non-existing session.
-   A team cannot be deleted if players exist.
-   A team cannot be deleted if it has participated in a match.
-   Only the team name is editable.

------------------------------------------------------------------------

# 4. API Endpoints

## Create Team

POST `/api/sessions/:sessionCode/teams`

Creates a new team.

## Get Teams

GET `/api/sessions/:sessionCode/teams`

Returns all teams in a session.

## Get Team

GET `/api/teams/:teamId`

Returns details of one team.

## Update Team

PATCH `/api/teams/:teamId`

Updates team name.

## Delete Team

DELETE `/api/teams/:teamId`

Deletes a team if allowed.

------------------------------------------------------------------------

# 5. Request & Response Models

Each endpoint must define: - Request - Response - Error Response

------------------------------------------------------------------------

# 6. Validation Rules

Create - Session must exist. - Team name required. - Team name unique
within session.

Update - Team must exist. - Team name must remain unique.

Delete - Team must exist. - No players assigned. - Not used in any
match.

------------------------------------------------------------------------

# 7. Database Operations

Primary Table - teams

Reference Tables - sessions - players - matches

------------------------------------------------------------------------

# 8. Transaction Flow

Create 1. Validate session. 2. Check duplicate. 3. Insert team. 4.
Return created team.

Update 1. Validate. 2. Update. 3. Return updated team.

Delete 1. Validate. 2. Check references. 3. Delete. 4. Return success.

------------------------------------------------------------------------

# 9. Error Handling

-   200 OK
-   201 Created
-   400 Bad Request
-   404 Not Found
-   409 Conflict
-   500 Internal Server Error

------------------------------------------------------------------------

# 10. Realtime Events

-   team.created
-   team.updated
-   team.deleted

------------------------------------------------------------------------

# 11. Testing Checklist

-   Create team
-   Get teams
-   Get team
-   Update team
-   Delete unused team
-   Prevent duplicate names
-   Prevent delete when players exist
-   Prevent delete when team is used in a match

------------------------------------------------------------------------

# 12. Cursor Implementation Notes

-   Do not modify database schema.
-   Use existing Drizzle schema.
-   Controllers → Services → Repositories.
-   Validate requests.
-   Integrate only with existing frontend.
-   Do not create new UI.
-   Do not implement Players, Matches or other modules.
-   Stop after Teams feature is complete.
