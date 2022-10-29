import express from "express";
import { bmiHandler } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (typeof height === "string" && typeof weight === "string") {
    res.send(bmiHandler(height, weight));
  } else {
    res.status(400).send({ error: "malformatted parameters" });
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (typeof target !== "number") {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  for (const d of daily_exercises) {
    if (typeof d !== "number") {
      return res.status(400).send({ error: "malformatted parameters" });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return res.send(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
