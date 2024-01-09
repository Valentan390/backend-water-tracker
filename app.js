// const express = require('express')
// const logger = require('morgan')
// const cors = require('cors')

import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import { watersRouter } from "./routes/api/waters.js";

// const contactsRouter = require("./routes/api/contacts");

export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/waters", watersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// module.exports = app;
