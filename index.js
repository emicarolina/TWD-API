import express from "express";
import cors from "cors";
import path from "path";
import charactersRoutes from "./routes/characters.js";
import episodesRoutes from "./routes/episodes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.join(process.cwd(), "public")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/ping", (req, res) => {
  res.json({ message: "API is awake!" });
});

app.use("/characters", charactersRoutes);
app.use("/episodes", episodesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API-TWD rodando na porta ${PORT}`));
