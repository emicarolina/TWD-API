import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { name } = req.query;
  const filePath = path.join(process.cwd(), "public", "images", name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not found");
  }

  const file = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "image/webp");
  res.send(file);
}
