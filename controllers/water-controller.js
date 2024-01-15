import Water from "../models/waters.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllWaters = async (req, res) => {
  const result = await Water.find({});
  res.json({
    result,
  });
};

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
  const result = await Water.create({ ...req.body, owner });
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
  addWater: ctrlWrapper(addWater),
  deleteWaterById: ctrlWrapper(deleteWaterById),
  getAllWaters: ctrlWrapper(getAllWaters),
};
