import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const moviesPath = path.resolve("data", "movies.json");
const movies = JSON.parse(fs.readFileSync(moviesPath, "utf8"));

router.get("/movies", (req, res) => res.json(movies));

router.get("/movies/:slug", (req, res) => {
  const movie = movies.find((m) => m.slug === req.params.slug);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

router.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    return res.status(404).json({ error: "Query parameter 'q' is required" });
  }

  const results = movies.filter((movie) =>
    movie.title.toLowerCase().includes(q.toLowerCase())
  );

  res.json(results);
});

export default router;
