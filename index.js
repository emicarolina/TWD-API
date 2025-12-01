import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import charactersRoutes from "./routes/characters.js";
import episodesRoutes from "./routes/episodes.js";

const app = express();

app.use(compression());

app.use(cors());

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

app.use("/characters", limiter);
app.use("/episodes", limiter);

app.use(
  "/public",
  express.static(path.join(process.cwd(), "public"), {
    maxAge: "7d",
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.match(/\.(webp|jpg|png|jpeg|gif|svg)$/i)) {
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
      }
    },
  })
);

app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
);

app.get("/ping", (req, res) => {
  res.json({ message: "API is awake!", uptime: Math.floor(process.uptime()) });
});

app.use("/characters", charactersRoutes);
app.use("/episodes", episodesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API-TWD rodando na porta ${PORT}`));
