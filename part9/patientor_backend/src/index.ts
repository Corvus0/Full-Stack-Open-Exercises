require("dotenv").config();
import express from "express";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors());

app.use(express.static("frontend"));

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnoseRouter);

app.use("/api/patients", patientRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
