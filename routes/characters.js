import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const dataPath = path.join(process.cwd(), "data.json");

let dataCache = null;
let lastModified = null;

function readData() {
  try {
    const stats = fs.statSync(dataPath);
    const currentModified = stats.mtime.getTime();

    if (dataCache && lastModified === currentModified) {
      return dataCache;
    }

    dataCache = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    lastModified = currentModified;
    return dataCache;
  } catch (error) {
    throw new Error("Failed to read data file");
  }
}

router.get("/", (req, res) => {
  try {
    const { name, status, page = "1", limit = "12" } = req.query;
    const { characters } = readData();

    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.max(
      1,
      Math.min(100, Number.parseInt(limit, 10) || 12)
    );

    let result = characters;

    if (name) {
      const searchTerm = String(name).toLowerCase().trim();
      result = result.filter((c) => c.name.toLowerCase().includes(searchTerm));
    }

    if (status) {
      const validStatuses = ["alive", "deceased"];
      const searchStatus = String(status).toLowerCase().trim();

      if (validStatuses.includes(searchStatus)) {
        result = result.filter(
          (c) => c.status && c.status.toLowerCase() === searchStatus
        );
      }
    }

    const totalItems = result.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));
    const currentPage = Math.min(pageNum, totalPages);
    const start = (currentPage - 1) * limitNum;
    const end = start + limitNum;
    const pageItems = result.slice(start, end);

    res.json({
      info: {
        items: totalItems,
        pages: totalPages,
        next:
          currentPage < totalPages
            ? `/api/characters?page=${currentPage + 1}&limit=${limitNum}`
            : null,
        prev:
          currentPage > 1
            ? `/api/characters?page=${currentPage - 1}&limit=${limitNum}`
            : null,
      },
      results: pageItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch characters",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const { characters } = readData();
    const id = Number(req.params.id);

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "Character ID must be a positive number",
      });
    }

    const char = characters.find((c) => c.id === id);

    if (!char) {
      return res.status(404).json({
        error: "Character not found",
        message: `No character found with ID ${id}`,
      });
    }

    res.json(char);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch character",
    });
  }
});

export default router;
