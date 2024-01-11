import Water from "../models/waters.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

import fs from "fs/promises";
import path from "path";

const avatarsPath = path.resolve("public", "avatars");

const updateWaterById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Water.findOneAndUpdate({ _id: id, owner }, req.body);
  res.json(result);
  if (error) {
    throw HttpError(404);
  }
  res.json(result);
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatars = path.join("public", "avatars", filename);
  const result = await Water.create({ ...req.body, avatars, owner });
  res.status(201).json(result);
};

const deleteWaterById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Water.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json({
    message: "Water deleted",
  });
};

export default {
  updateWaterById: ctrlWrapper(updateWaterById),
  // getById: ctrlWrapper(getById),
  addWater: ctrlWrapper(addWater),
  // updateById: ctrlWrapper(updateById),
  deleteWaterById: ctrlWrapper(deleteWaterById),
};
