CREATE TYPE "public"."extra_type" AS ENUM('wide', 'no_ball', 'bye', 'leg_bye');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'completed');--> statement-breakpoint
CREATE TYPE "public"."toss_decision" AS ENUM('bat', 'bowl');--> statement-breakpoint
CREATE TABLE "balls" (
	"ball_id" serial PRIMARY KEY NOT NULL,
	"inning_id" integer NOT NULL,
	"over_number" integer NOT NULL,
	"ball_number" integer NOT NULL,
	"striker_id" integer NOT NULL,
	"non_striker_id" integer NOT NULL,
	"bowler_id" integer NOT NULL,
	"runs_off_bat" integer DEFAULT 0 NOT NULL,
	"extra_type" "extra_type",
	"extra_runs" integer DEFAULT 0 NOT NULL,
	"is_legal_ball" boolean DEFAULT true NOT NULL,
	"is_wicket" boolean DEFAULT false NOT NULL,
	"dismissed_player_id" integer,
	CONSTRAINT "balls_inning_over_ball_unq" UNIQUE("inning_id","over_number","ball_number")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_id" serial PRIMARY KEY NOT NULL,
	"session_code" varchar(255) NOT NULL,
	"session_name" varchar(255) NOT NULL,
	"status" "session_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_session_code_unique" UNIQUE("session_code")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"team_id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"team_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"player_id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"player_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"match_id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"team_a_id" integer NOT NULL,
	"team_b_id" integer NOT NULL,
	"overs_per_innings" integer NOT NULL,
	"toss_winner_team_id" integer,
	"toss_decision" "toss_decision",
	"current_inning" integer DEFAULT 1,
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"winner_team_id" integer,
	"win_type" varchar(50),
	"win_margin" integer,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "innings" (
	"inning_id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"inning_number" integer NOT NULL,
	"batting_team_id" integer NOT NULL,
	"bowling_team_id" integer NOT NULL,
	"total_runs" integer DEFAULT 0 NOT NULL,
	"total_wickets" integer DEFAULT 0 NOT NULL,
	"total_extras" integer DEFAULT 0 NOT NULL,
	"legal_balls" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "innings_match_id_inning_number_unq" UNIQUE("match_id","inning_number")
);
--> statement-breakpoint
CREATE TABLE "player_stats" (
	"player_stats_id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"match_id" integer NOT NULL,
	"inning_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"runs" integer DEFAULT 0 NOT NULL,
	"balls_faced" integer DEFAULT 0 NOT NULL,
	"fours" integer DEFAULT 0 NOT NULL,
	"sixes" integer DEFAULT 0 NOT NULL,
	"balls_bowled" integer DEFAULT 0 NOT NULL,
	"maidens" integer DEFAULT 0 NOT NULL,
	"runs_conceded" integer DEFAULT 0 NOT NULL,
	"wickets" integer DEFAULT 0 NOT NULL,
	"wides" integer DEFAULT 0 NOT NULL,
	"no_balls" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "player_stats_player_match_inning_unq" UNIQUE("player_id","match_id","inning_id")
);
--> statement-breakpoint
ALTER TABLE "balls" ADD CONSTRAINT "balls_inning_id_innings_inning_id_fk" FOREIGN KEY ("inning_id") REFERENCES "public"."innings"("inning_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balls" ADD CONSTRAINT "balls_striker_id_players_player_id_fk" FOREIGN KEY ("striker_id") REFERENCES "public"."players"("player_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balls" ADD CONSTRAINT "balls_non_striker_id_players_player_id_fk" FOREIGN KEY ("non_striker_id") REFERENCES "public"."players"("player_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balls" ADD CONSTRAINT "balls_bowler_id_players_player_id_fk" FOREIGN KEY ("bowler_id") REFERENCES "public"."players"("player_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balls" ADD CONSTRAINT "balls_dismissed_player_id_players_player_id_fk" FOREIGN KEY ("dismissed_player_id") REFERENCES "public"."players"("player_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_session_id_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_session_id_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_a_id_teams_team_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_b_id_teams_team_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_toss_winner_team_id_teams_team_id_fk" FOREIGN KEY ("toss_winner_team_id") REFERENCES "public"."teams"("team_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_team_id_teams_team_id_fk" FOREIGN KEY ("winner_team_id") REFERENCES "public"."teams"("team_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "innings" ADD CONSTRAINT "innings_match_id_matches_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("match_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "innings" ADD CONSTRAINT "innings_batting_team_id_teams_team_id_fk" FOREIGN KEY ("batting_team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "innings" ADD CONSTRAINT "innings_bowling_team_id_teams_team_id_fk" FOREIGN KEY ("bowling_team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_players_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_match_id_matches_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("match_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_inning_id_innings_inning_id_fk" FOREIGN KEY ("inning_id") REFERENCES "public"."innings"("inning_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_team_id_teams_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "balls_inning_id_idx" ON "balls" USING btree ("inning_id");--> statement-breakpoint
CREATE INDEX "balls_striker_id_idx" ON "balls" USING btree ("striker_id");--> statement-breakpoint
CREATE INDEX "balls_non_striker_id_idx" ON "balls" USING btree ("non_striker_id");--> statement-breakpoint
CREATE INDEX "balls_bowler_id_idx" ON "balls" USING btree ("bowler_id");--> statement-breakpoint
CREATE INDEX "balls_dismissed_player_id_idx" ON "balls" USING btree ("dismissed_player_id");--> statement-breakpoint
CREATE INDEX "teams_session_id_idx" ON "teams" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "players_team_id_idx" ON "players" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "matches_session_id_idx" ON "matches" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "matches_team_a_id_idx" ON "matches" USING btree ("team_a_id");--> statement-breakpoint
CREATE INDEX "matches_team_b_id_idx" ON "matches" USING btree ("team_b_id");--> statement-breakpoint
CREATE INDEX "matches_toss_winner_team_id_idx" ON "matches" USING btree ("toss_winner_team_id");--> statement-breakpoint
CREATE INDEX "matches_winner_team_id_idx" ON "matches" USING btree ("winner_team_id");--> statement-breakpoint
CREATE INDEX "innings_match_id_idx" ON "innings" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "innings_batting_team_id_idx" ON "innings" USING btree ("batting_team_id");--> statement-breakpoint
CREATE INDEX "innings_bowling_team_id_idx" ON "innings" USING btree ("bowling_team_id");--> statement-breakpoint
CREATE INDEX "player_stats_player_id_idx" ON "player_stats" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "player_stats_match_id_idx" ON "player_stats" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "player_stats_inning_id_idx" ON "player_stats" USING btree ("inning_id");--> statement-breakpoint
CREATE INDEX "player_stats_team_id_idx" ON "player_stats" USING btree ("team_id");