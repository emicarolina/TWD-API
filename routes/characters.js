import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const dataPath = path.join(process.cwd(), "data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", (req, res) => {
  const { name, status, page = "1", limit = "12" } = req.query;
  const { characters } = readData();

  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, Number.parseInt(limit, 10) || 12)); // cap max 100

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

router.post("/", (req, res) => {
  const data = readData();
  const newChar = { id: Date.now(), ...req.body };

  data.characters.push(newChar);
  writeData(data);

  res.status(201).json(newChar);
});

router.put("/:id", (req, res) => {
  const data = readData();
  const idx = data.characters.findIndex((c) => c.id === Number(req.params.id));

  if (idx === -1) return res.status(404).json({ error: "Character not found" });

  data.characters[idx] = { ...data.characters[idx], ...req.body };

  writeData(data);

  res.json(data.characters[idx]);
});

router.delete("/:id", (req, res) => {
  const data = readData();
  const idx = data.characters.findIndex((c) => c.id === Number(req.params.id));

  if (idx === -1) return res.status(404).json({ error: "Character not found" });

  const removed = data.characters.splice(idx, 1);

  writeData(data);

  res.json(removed[0]);
});

export default router;
