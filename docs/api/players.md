# Players API Specification

> **Module:** Players
>
> **Status:** Approved (Phase 1)
>
> This document is the source of truth for all Player-related backend APIs
> in TurfScore.

------------------------------------------------------------------------

# 1. Overview

The Players module manages players within a session.

A player always belongs to one session. Players can optionally be assigned to a specific team within that session, or remain unassigned.

------------------------------------------------------------------------

# 2. User Flow

``` text
Session Dashboard
    ↓
Add Player
    ↓
View Players
    ↓
Update Player
    ↓
Delete Player
```

------------------------------------------------------------------------

# 3. Business Rules

-   Every player belongs to one session.
-   A player may be assigned to a team, but the team must belong to the same session.
-   A player cannot be created for a non-existing session.
-   A player cannot be deleted if they have participated in a match or have recorded statistics.
-   Player names and details are editable.

------------------------------------------------------------------------

# 4. API Endpoints

## Create Player

POST `/api/sessions/:sessionCode/players`

Creates a new player in the given session.

## Get Players

GET `/api/sessions/:sessionCode/players`

Returns all players in a session. Can include query parameters (e.g., `?teamId=`) to filter players by team.

## Get Player

GET `/api/players/:playerId`

Returns details of one player.

## Update Player

PATCH `/api/players/:playerId`

Updates player details (e.g., name, role, assigned team).

## Delete Player

DELETE `/api/players/:playerId`

Deletes a player if allowed.

------------------------------------------------------------------------

# 5. Request & Response Models

Each endpoint must define: - Request - Response - Error Response

------------------------------------------------------------------------

# 6. Validation Rules

Create - Session must exist. - Player name required. - If team ID is provided, the team must exist and belong to the same session.

Update - Player must exist. - If team ID is updated, the new team must exist and belong to the same session.

Delete - Player must exist. - Player must not be used in any match or have statistics.

------------------------------------------------------------------------

# 7. Database Operations

Primary Table - players

Reference Tables - sessions - teams - matches - player_stats

------------------------------------------------------------------------

# 8. Transaction Flow

Create 1. Validate session. 2. Validate team (if provided). 3. Insert player. 4. Return created player.

Update 1. Validate player. 2. Validate new team (if provided). 3. Update player. 4. Return updated player.

Delete 1. Validate player. 2. Check references (matches, stats). 3. Delete player. 4. Return success.

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

-   player.created
-   player.updated
-   player.deleted

------------------------------------------------------------------------

# 11. Testing Checklist

-   Create player
-   Get players (with and without team filter)
-   Get player
-   Update player (name, team assignment)
-   Delete unused player
-   Prevent team assignment to a team from a different session
-   Prevent delete when player is used in a match or has stats

------------------------------------------------------------------------

# 12. Cursor Implementation Notes

-   Do not modify database schema.
-   Use existing Drizzle schema.
-   Controllers → Services → Repositories.
-   Validate requests.
-   Integrate only with existing frontend.
-   Do not create new UI.
-   Do not implement Matches or other modules.
-   Stop after Players feature is complete.
