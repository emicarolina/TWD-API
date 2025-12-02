import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const dataPath = path.join(process.cwd(), "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

router.get("/", (req, res) => {
  const { season } = req.query;
  let { episodes } = readData();

  if (season) {
    episodes = episodes.filter((e) => e.season === Number(season));
  }

  res.json(episodes);
});

router.get("/:id", (req, res) => {
  const { episodes } = readData();
  const ep = episodes.find((e) => e.id === Number(req.params.id));

  if (!ep) return res.status(404).json({ error: "Episode not found" });

  res.json(ep);
});

export default router;
