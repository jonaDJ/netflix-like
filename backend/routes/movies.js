import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const moviesPath = path.resolve("data", "movies.json");
const movies = JSON.parse(fs.readFileSync(moviesPath, "utf8"));

router.get("/", (req, res) => res.json(movies));

router.get("/:slug", (req, res) => {
  const movie = movies.find((m) => m.slug === req.params.slug);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

export default router;
