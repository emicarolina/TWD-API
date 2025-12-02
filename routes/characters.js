import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const dataPath = path.join(process.cwd(), "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

router.get("/", (req, res) => {
  const { name, status, page = "1", limit = "12" } = req.query;
  const { characters } = readData();

  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, Number.parseInt(limit, 10) || 12));

  let result = characters;

  if (name) {
    result = result.filter((c) =>
      c.name.toLowerCase().includes(String(name).toLowerCase())
    );
  }

  if (status) {
    result = result.filter(
      (c) => c.status && c.status.toLowerCase() === String(status).toLowerCase()
    );
  }

  const totalItems = result.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));
  const currentPage = Math.min(pageNum, totalPages);
  const start = (currentPage - 1) * limitNum;
  const end = start + limitNum;
  const pageItems = result.slice(start, end);

  res.json({
    page: currentPage,
    totalPages,
    totalItems,
    limit: limitNum,
    characters: pageItems,
  });
});

router.get("/:id", (req, res) => {
  const { characters } = readData();
  const char = characters.find((c) => c.id === Number(req.params.id));

  if (!char) return res.status(404).json({ error: "Character not found" });

  res.json(char);
});

export default router;
