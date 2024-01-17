import Water from "../models/waters.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import moment from "moment";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Water.find({ owner }, "-createdAt -updatedAt");
  res.json({
    result,
  });
};

const updateWaterById = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const result = await Water.findOneAndUpdate(
    { _id: waterId, owner },
    req.body
  );
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
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const result = await Water.findOneAndDelete({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json({
    message: "Water deleted",
  });
};

const waterUserDay = async (req, res) => {
  const { _id: owner, dailyNorma } = req.user;

  const currentDate = moment().startOf("day");

  const userWaterDay = await Water.find({
    owner,
    createdAt: { $gte: currentDate },
  });

  const totalWaterDayUser = userWaterDay.reduce(
    (sum, drunkwater) => sum + drunkwater.waterVolume,
    0
  );

  const percentDailyNormaUser = Math.round(
    (totalWaterDayUser / dailyNorma) * 100
  );

  res.status(200).json({
    percentDailyNormaUser,
    userWaterDay,
  });
};

const waterUserMonth = async (req, res) => {
  const { _id: owner, dailyNorma } = req.user;
  const { year, month } = req.body;

  const startDate = moment(`${year}-${month}-01`).startOf("month");
  const endDate = moment(startDate).endOf("month");

  const dailyRecords = await Water.find({
    owner,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const groupedRecords = {};

  dailyRecords.forEach((record) => {
    const dayOfMonth = moment(record.createdAt).format("D");

    if (!groupedRecords[dayOfMonth]) {
      groupedRecords[dayOfMonth] = {
        totalVolume: 0,
        count: 0,
      };
    }

    groupedRecords[dayOfMonth].totalVolume += record.waterVolume;
    groupedRecords[dayOfMonth].count += 1;
  });

  const dailySummary = Object.keys(groupedRecords).map((day) => {
    const dayRecord = groupedRecords[day];

    const percentDailyNorm = Math.round(
      (dayRecord.totalVolume / dailyNorma) * 100
    );

    return {
      date: moment(`${year}-${month}-${day}`, "YYYY-MM-D"),
      dailyNorm: dailyNorma,
      percentDailyNorm: Math.min(100, percentDailyNorm),
      consumptionCount: dayRecord.count,
    };
  });

  res.status(200).json(dailySummary);
};

export default {
  updateWaterById: ctrlWrapper(updateWaterById),
  addWater: ctrlWrapper(addWater),
  deleteWaterById: ctrlWrapper(deleteWaterById),
  getAll: ctrlWrapper(getAll),
  waterUserDay: ctrlWrapper(waterUserDay),
  waterUserMonth: ctrlWrapper(waterUserMonth),
};
