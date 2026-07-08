# 🏏 TurfScore

> [!WARNING]
> **Active development is currently in progress.**

**TurfScore** is a modern, intuitive, and dynamic web application designed for creating cricket sessions and live scoring matches. With a seamless user interface and real-time interactions, TurfScore makes it effortless to track match progress, manage teams, and monitor live games straight from your browser.

🌐 **Live Demo:** [TurfScore on Vercel](https://turf-score-web.vercel.app)

---

## ⚡ Features

- **Session Management:** Easily create, configure, and customize match sessions.
- **Team & Player Setup:** Add players, assign them to teams, and get the match started.
- **Live Scoring Interface:** Track runs, wickets, overs, and detailed stats in real-time.
- **Responsive Design:** A fully responsive UI optimized for mobile, tablet, and desktop viewing.
- **Theme Support:** Polished light and dark modes tailored to your preference.

---

## 🛠️ Tech Stack

TurfScore's frontend is built with modern, high-performance web technologies:

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (utility-first, theme-aware)
- **Forms & Validation:** React Hook Form + Zod
- **Language:** TypeScript (Strict Mode)

> 🚧 **Backend Note:** A Node.js/Express backend API is currently in active development to support persistent sessions and live multiplayer syncing.

---

## 📦 Requirements

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)

---

## 🚀 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TurfScore
   ```

2. **Install dependencies:**
   Run the following command in the project root:
   ```bash
   npm install
   ```

3. **Start the development server:**
   Launch the application locally:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` (or the port provided by Vite) to view the application.

---

## 📖 Quick Start Guide

Ready to jump into the action? Here's how to use TurfScore:

1. **Start a Session:** Click on "Create Session" from the homepage to set up a new match.
2. **Add Players & Teams:** Input player names and automatically or manually divide them into teams. 
3. **Configure Match Rules:** Set the number of overs and any specific rules for the session.
4. **Begin Scoring:** Use the live scoring dashboard to track every run, boundary, and wicket in real-time!

---

## 🗺️ Upcoming Features (Roadmap)

Since TurfScore is currently in active development, we have a lot of exciting features planned for the near future:

- [ ] **Full Backend Integration:** Seamless data synchronization with our Express API.
- [ ] **Persistent Sessions:** Save matches and resume them at any time from any device.
- [ ] **Player Statistics:** Detailed career stats, strike rates, and economy tracking across sessions.
- [ ] **Live Leaderboards:** View the top performing players and teams.
- [ ] **PWA Support:** Install TurfScore as an app on your mobile device for offline scoring capabilities.
