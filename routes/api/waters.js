// const express = require('express')

import express from "express";

import watersController from "../../controllers/water.js";

export const watersRouter = express.Router();

watersRouter.get("/", watersController.getALL);

// watersRouter.get("/:waterId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// watersRouter.post("/", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// watersRouter.delete("/:waterId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// watersRouter.put("/:waterId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// module.exports = router
