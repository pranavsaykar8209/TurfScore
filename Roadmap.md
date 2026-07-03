# 📋 TurfScore - Development Roadmap

## Development Roadmap

| Step | Module | Description |
|------|--------|-------------|
| **1** | Tech Stack Finalization | Finalize technologies, architecture, and development approach. |
| **2** | Project Setup & Deployment | Initialize the project, configure the development environment, and deploy a Hello World application. |
| **3** | Home Page | Build the landing page with Create Session, Join Session, About Us, and How It Works sections. |
| **4** | Create Session | Create a new session, add teams, and register players. |
| **5** | Join Session | Join an existing session using a session code and provide optional edit access. |
| **6** | Create Match | Select teams, configure the match, perform the toss, and start the match. |
| **7** | Match Initialization | Select opening batters and the opening bowler before the first delivery. |
| **8** | Live Scoring (Umpire Panel) | Score the match ball-by-ball with automatic calculations and real-time updates. |
| **9** | Match Summary | Display the complete scorecard, match result, and individual player performances. |
| **10** | Session Statistics | Display all matches played in the session along with cumulative team and player statistics. |

---

# ✅ 1. Tech Stack Finalization

Finalize the complete technology stack, project architecture, and deployment strategy before starting development.

### Finalized Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Real-time | Supabase Realtime |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git + GitHub |

### Repository Structure

```text
turfscore/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── shared/
│   └── ui/ (Optional)
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# ✅ 2. Project Setup & Deployment

Set up the development environment and verify the deployment pipeline.

### Completed Tasks

- Created GitHub repository
- Configured monorepo structure
- Initialized React (Vite + TypeScript)
- Initialized Node.js (Express + TypeScript)
- Connected the frontend and backend
- Verified local development setup
- Deployed frontend to Vercel
- Deployed backend to Render
- Confirmed successful "Hello World" deployment

---

# ⏳ 3. Home Page

Develop the landing page containing:

- Hero section
- Create Session button
- Join Session button
- About TurfScore
- How to Use guide

This page serves as the main entry point for users.

---

# ⏳ 4. Create Session

Allow users to create a new cricket session by:

- Generating a unique session code
- Creating two teams
- Adding players to each team

This initializes a session for one turf booking.

---

# ⏳ 5. Join Session

Allow users to join an existing session using the session code.

Features:

- Join using session code
- View session details
- View teams and players
- Optional edit access for scorekeepers

---

# ⏳ 6. Create Match

Create a new match within the current session.

Features:

- Select participating teams
- Choose the playing squad
- Conduct the toss
- Select batting team
- Start the match

---

# ⏳ 7. Match Initialization

Prepare the match before the first ball.

Features:

- Select opening batters
- Select opening bowler
- Verify match setup
- Begin live scoring

---

# ⏳ 8. Live Scoring (Umpire Panel)

Build the primary scoring interface optimized for speed.

Features:

- Ball-by-ball scoring
- Runs (0, 1, 2, 3, 4, 6)
- Wide
- No Ball
- Bye
- Leg Bye
- Wicket
- Strike rotation
- Over completion
- Undo last ball
- Automatic calculations
- Real-time synchronization

This is the core feature of TurfScore.

---

# ⏳ 9. Match Summary

Display the complete scorecard after the match finishes.

Features:

- Match result
- Final score
- Batting scorecard
- Bowling figures
- Innings summary
- Match statistics

---

# ⏳ 10. Session Statistics

Display cumulative statistics for the current session.

Features:

- All matches played
- Team performance
- Player statistics
- Batting leaderboard
- Bowling leaderboard
- Session summary
- Player rankings

This completes the Phase 1 MVP development roadmap.