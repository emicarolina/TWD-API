import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import charactersRoutes from "../routes/characters.js";
import episodesRoutes from "../routes/episodes.js";

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api/characters", limiter, charactersRoutes);
app.use("/api/episodes", limiter, episodesRoutes);

app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
);

app.get("/api/ping", (req, res) => {
  res.json({ message: "API is awake!" });
});

app.get("/", (req, res) => {
  res.json({
    message: "🧟 Welcome to The Walking Dead API",
    version: "1.0.0",
    endpoints: {
      characters: "/api/characters",
      character_by_id: "/api/characters/:id",
      episodes: "/api/episodes",
      episode_by_id: "/api/episodes/:id",
      health: "/api/health",
    },
    documentation: "https://github.com/emicarolina/api-twd",
    examples: {
      all_characters: "/api/characters?page=1&limit=12",
      search_by_name: "/api/characters?name=Rick",
      filter_by_status: "/api/characters?status=alive",
      episodes_by_season: "/api/episodes?season=1",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
