# TurfScore Database Structure

> This document defines the database schema used by TurfScore.
>
> It describes the purpose of each table, its fields, and their relationships.
>
> This document serves as the single source of truth for the database design.

## 1. sessions

### Purpose

Stores the root session (turf booking). Every team, player, match, and score belongs to a single session.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| session_id | integer | Primary Key |
| session_code | string | Unique session join code |
| session_name | string | Session name |
| status | enum | Session status (active / completed) |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Last updated time |

### Relationships

- One Session → Many Teams
- One Session → Many Matches

---

## 2. teams

### Purpose

Stores all teams created inside a session.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| team_id | integer | Primary Key |
| session_id | integer | References sessions.session_id |
| team_name | string | Team name |
| created_at | timestamp | Record creation time |

### Relationships

- Belongs to one Session
- One Team → Many Players
- One Team → Many Matches

---

## 3. players

### Purpose

Stores all players belonging to a team. Players can be added, edited, or removed between matches.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| player_id | integer | Primary Key |
| team_id | integer | References teams.team_id |
| player_name | string | Player name |
| created_at | timestamp | Record creation time |

### Relationships

- Belongs to one Team
- Used in Balls
- Used in Player Stats

---

## 4. matches

### Purpose

Stores match-level information including participating teams, toss details, match status, and final result.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| match_id | integer | Primary Key |
| session_id | integer | References sessions.session_id |
| team_a_id | integer | References teams.team_id |
| team_b_id | integer | References teams.team_id |
| overs_per_innings | integer | Number of overs per innings |
| toss_winner_team_id | integer | References teams.team_id |
| toss_decision | enum | Bat / Bowl |
| current_inning | integer | Current innings number |
| status | enum | Scheduled / Live / Completed |
| winner_team_id | integer | References teams.team_id |
| win_type | string | Won by Runs / Wickets / Tie |
| win_margin | integer | Winning margin |
| started_at | timestamp | Match start time |
| completed_at | timestamp | Match completion time |

### Relationships

- Belongs to one Session
- Has many Innings
- Has many Player Stats

---

## 5. innings

### Purpose

Stores the summary of each innings during a match.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| inning_id | integer | Primary Key |
| match_id | integer | References matches.match_id |
| inning_number | integer | Innings number (1 or 2) |
| batting_team_id | integer | References teams.team_id |
| bowling_team_id | integer | References teams.team_id |
| total_runs | integer | Total runs scored |
| total_wickets | integer | Total wickets lost |
| total_extras | integer | Total extras |
| legal_balls | integer | Total legal balls bowled |

### Relationships

- Belongs to one Match
- Has many Balls
- Has many Player Stats

---

## 6. balls

### Purpose

Stores every ball bowled during the match. This is the primary source of truth for the scoring engine.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| ball_id | integer | Primary Key |
| inning_id | integer | References innings.inning_id |
| over_number | integer | Over number |
| ball_number | integer | Ball number within the over |
| striker_id | integer | References players.player_id |
| non_striker_id | integer | References players.player_id |
| bowler_id | integer | References players.player_id |
| runs_off_bat | integer | Runs scored from the bat |
| extra_type | enum | Wide / No Ball / Bye / Leg Bye |
| extra_runs | integer | Extra runs awarded |
| is_legal_ball | boolean | Counts towards the over |
| is_wicket | boolean | Indicates if a wicket fell |
| dismissed_player_id | integer | References players.player_id (nullable) |

### Relationships

- Belongs to one Innings
- References Batter(s)
- References Bowler
- Drives all score calculations

---

## 7. player_stats

### Purpose

Stores live batting and bowling statistics for each player in a specific match and innings. Updated after every ball for fast scorecard rendering.

### Fields

| Field | Type | Description |
|--------|------|-------------|
| player_stats_id | integer | Primary Key |
| player_id | integer | References players.player_id |
| match_id | integer | References matches.match_id |
| inning_id | integer | References innings.inning_id |
| team_id | integer | References teams.team_id |
| runs | integer | Total batting runs |
| balls_faced | integer | Balls faced |
| fours | integer | Total fours |
| sixes | integer | Total sixes |
| balls_bowled | integer | Legal balls bowled |
| maidens | integer | Maiden overs |
| runs_conceded | integer | Runs conceded while bowling |
| wickets | integer | Wickets taken |
| wides | integer | Wides bowled |
| no_balls | integer | No balls bowled |

### Relationships

- Belongs to one Player
- Belongs to one Match
- Belongs to one Innings
- Used for live scorecards and session statistics