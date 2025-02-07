import express from "express";
import cors from "cors";
import moviesRouter from "./routes/movies.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRouter);

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
