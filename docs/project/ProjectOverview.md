# 🏏 TurfScore - Complete Project Specification

## 📌 Project Overview

TurfScore is a **real-time cricket live scoring platform** designed for turf matches. It enables a single scorer (umpire/controller) to update every ball in under 2–3 seconds while other users view live match updates on their devices.

The system is **session-based**, meaning everything revolves around a cricket session (a turf booking time slot).

---

## 🧭 Core Concept

### Session First Architecture

- A **Session** represents a turf booking.
- All teams, players, and matches exist inside a session.
- No authentication in Phase 1.
- Access is controlled using a **session code**.

---

## 🔄 Complete User Flow

```text
Home
  ↓
Create Session / Join Session
  ↓
Session Dashboard
  ↓
Add Teams
  ↓
Add Players
  ↓
Create Match
  ↓
Match Setup (Toss + Playing XI)
  ↓
Live Match Scoring
  ↓
Match Summary
  ↓
Session Statistics
```

---

## 📱 Pages & Functional Specification

---

# 1. Home Page

### Purpose
Entry point for the application.

### UI Components
- App Logo: **TurfScore**
- Tagline: "Fast. Live. Accurate. Cricket scoring."
- Buttons:
  - Create Session
  - Join Session
- About Section
- How It Works (simple steps)

### Actions
- Create Session → navigates to session creation flow
- Join Session → navigates to session join flow

---

# 2. Create Session Page

### Purpose
Initialize a new cricket session.

### Input Fields

#### Session Details
- Session Name (optional)
- Generated Session Code (auto-generated, unique)

#### Teams
- Team 1 Name
- Team 2 Name

#### Players

For each team:
- Player Name
- Optional Role (Batsman / Bowler / All-rounder)

### Output
- Session created with unique session code
- Redirect to Session Dashboard

---

# 3. Join Session Page

### Purpose
Allow users to enter an existing session.

### Input Fields
- Session Code

### Output
- Session details (read-only or editable depending on access)

### Permissions
- Viewer Mode (default)
- Edit Mode (if allowed by session creator)

---

# 4. Session Dashboard

### Purpose
Central control panel for a session.

### Displays
- Session Code
- Teams List
- Players List
- Matches Played
- Session Statistics (basic summary)

### Actions
- Add/Edit Teams
- Add/Edit Players
- Create Match

---

# 5. Create Match Page

### Purpose
Set up a new match inside a session.

### Input Fields

#### Match Setup
- Select Team A
- Select Team B

#### Playing XI Selection
- Choose 11 players from each team

#### Toss
- Toss Winner (Team A / Team B)
- Decision (Bat / Bowl)

### Output
- Match created
- Redirect to Match Setup screen

---

# 6. Match Setup Page (Pre-Match)

### Purpose
Finalize match before starting live scoring.

### Input Fields
- Opening Batsman 1
- Opening Batsman 2
- Opening Bowler

### Actions
- Start Match

---

# 7. Live Match Scoring (Core Feature)

### Purpose
Fast ball-by-ball scoring system.

---

## Input Controls (Umpire Panel)

### Run Buttons
- 0, 1, 2, 3, 4, 6

### Extras
- Wide
- No Ball
- Bye
- Leg Bye

### Wickets
- Bowled
- Caught
- Run Out
- LBW
- Stumped

### Controls
- Undo Last Ball
- Change Strike
- End Over

---

## System Auto Calculations

- Total Runs
- Balls Faced
- Overs
- Strike Rate
- Economy Rate
- Wickets
- Current Batters
- Current Bowler stats

---

## Real-Time Features

- Live score updates across devices
- Instant sync for spectators
- Session-wide state consistency

---

# 8. Match Summary Page

### Purpose
Show final match result.

### Displays

#### Match Result
- Winner Team
- Margin (runs/wickets)

#### Scorecard
- Batting statistics
- Bowling statistics
- Fall of wickets

#### Highlights
- Top scorer
- Best bowler

---

# 9. Session Statistics Page

### Purpose
Aggregate stats for entire session.

### Displays

#### Team Stats
- Matches played
- Wins/Losses

#### Player Stats
- Total runs
- Wickets
- Strike rate
- Economy

#### Leaderboards
- Top batsman
- Top bowler

---

## 🏗️ Architecture Overview

### Monorepo Structure

```text
turfscore/
│
├── apps/
│   ├── web      (React frontend)
│   └── api      (Node.js backend)
│
├── packages/
│   └── shared   (types + utilities)
```

---

## ⚙️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript

### Database
- Supabase (PostgreSQL)

### Real-time
- Supabase Realtime

### ORM
- Drizzle ORM

---

## 🚀 Deployment Strategy

| Layer | Platform |
|------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase |

---

## 🔁 State Model (Core Concept)

### Session
- Contains teams, players, matches

### Match
- Contains innings, scorecard, overs

### Player
- Exists inside team → tracks stats per session

---

## 🎯 Key Design Principles

- ⚡ Ultra-fast scoring (2–3 seconds per ball)
- 📱 Mobile-first UI (scorer friendly)
- 🔄 Real-time synchronization
- 🧠 Auto-calculation of all cricket logic
- 🧩 Session-based architecture (no auth in Phase 1)

---

## 📌 Phase 1 Goal

Build a fully functional system where:

> One person can manage an entire cricket match live while others watch in real time without confusion.

---

## 📈 Future Enhancements (Not in Phase 1)

- Authentication system
- Turf owner dashboard
- Payments & subscriptions
- Tournament management
- React Native mobile app
- AI match insights
- Advanced analytics