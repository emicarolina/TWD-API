import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const dataPath = path.join(process.cwd(), "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

router.get("/", (req, res) => {
  try {
    const { season } = req.query;
    let { episodes } = readData();

    if (season) {
      const seasonNum = Number(season);

      if (isNaN(seasonNum) || seasonNum < 1 || seasonNum > 11) {
        return res.status(400).json({
          error: "Invalid season",
          message: "Season must be a number between 1 and 11",
        });
      }

      episodes = episodes.filter((e) => e.season === seasonNum);
    }

    res.json(episodes);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch episodes",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const { episodes } = readData();
    const id = Number(req.params.id);

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Episode ID must be a positive number",
      });
    }

    const ep = episodes.find((e) => e.id === id);

    if (!ep) {
      return res.status(404).json({
        error: "Episode not found",
        message: `No episode found with ID ${id}`,
      });
    }

    res.json(ep);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch episode",
    });
  }
});

export default router;
