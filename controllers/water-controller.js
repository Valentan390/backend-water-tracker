import Water from "../models/waters.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAll = async (req, res) => {
  // const { _id: owner } = req.user;
  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  const result = await Water.find({});
  // const total = await Water.countDocuments({});
  res.json({
    result,
    // total,
  });
};

const updateWaterById = async (req, res) => {
  const { id } = req.params;
  // const { _id: owner } = req.user;
  const result = await Water.findOneAndUpdate({ _id: id }, req.body);
  res.json(result);
  if (error) {
    throw HttpError(404);
  }
  res.json(result);
};
// const updateWaterById = async (req, res) => {
//   const { id } = req.params;
//   const { _id: owner } = req.user;
//   const result = await Water.findOneAndUpdate({ _id: id, owner }, req.body);
//   res.json(result);
//   if (error) {
//     throw HttpError(404);
//   }
//   res.json(result);
// };

const addWater = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Water.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteWaterById = async (req, res) => {
  const { id } = req.params;
  // const { _id: owner } = req.user;
  const result = await Water.findOneAndDelete({ _id: id });
  if (!result) {
    throw HttpError(404);
  }
  res.json({
    message: "Water deleted",
  });
};
// const deleteWaterById = async (req, res) => {
//   const { id } = req.params;
//   const { _id: owner } = req.user;
//   const result = await Water.findOneAndDelete({ _id: id, owner });
//   if (!result) {
//     throw HttpError(404);
//   }
//   res.json({
//     message: "Water deleted",
//   });
// };

export default {
  updateWaterById: ctrlWrapper(updateWaterById),
  // getById: ctrlWrapper(getById),
  addWater: ctrlWrapper(addWater),
  // updateById: ctrlWrapper(updateById),
  deleteWaterById: ctrlWrapper(deleteWaterById),
  getAll: ctrlWrapper(getAll),
};
