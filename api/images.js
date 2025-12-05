import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Invalid image name" });
  }

  if (!name.toLowerCase().endsWith(".webp")) {
    return res.status(400).json({ error: "Only .webp images are allowed" });
  }

  const filePath = path.join(process.cwd(), "public", "images", name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  const file = fs.readFileSync(filePath);

  res.setHeader("Content-Type", "image/webp");

  res.setHeader("Cache-Control", "public, max-age=604800, immutable");

  res.send(file);
}
