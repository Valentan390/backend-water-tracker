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

  if (!result) {
    throw HttpError(404, "Data not updated");
  }
  res.json({
    waterVolume: result.waterVolume,
    date: result.date,
    _id: result._id,
  });
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Water.create({ ...req.body, owner });

  if (!result) {
    throw HttpError(404, "No data added");
  }

  res.status(201).json({
    waterVolume: result.waterVolume,
    date: result.date,
    _id: result._id,
  });
};

const deleteWaterById = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const result = await Water.findOneAndDelete({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404, "Data not deleted");
  }
  res.json({
    message: "Water deleted",
  });
};

const waterUserDay = async (req, res) => {
  const { _id: owner, dailyNorma } = req.user;

  const currentDate = moment().startOf("day");

  const userWaterDay = await Water.aggregate([
    {
      $match: {
        owner,
        createdAt: { $gte: currentDate.toDate() },
      },
    },
    {
      $group: {
        _id: null,
        totalWaterVolume: { $sum: "$waterVolume" },
        waterEntries: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        percentDailyNormaUser: {
          $round: [
            {
              $multiply: [{ $divide: ["$totalWaterVolume", dailyNorma] }, 100],
            },
          ],
        },
        userWaterDay: {
          $map: {
            input: "$waterEntries",
            as: "entry",
            in: {
              _id: "$$entry._id",
              waterVolume: "$$entry.waterVolume",
              date: { $toDate: "$$entry.date" },
            },
          },
        },
      },
    },
    {
      $unwind: "$userWaterDay",
    },
    {
      $sort: {
        "userWaterDay.date": 1,
      },
    },
    {
      $group: {
        _id: null,
        percentDailyNormaUser: { $first: "$percentDailyNormaUser" },
        userWaterDay: { $push: "$userWaterDay" },
      },
    },
    {
      $project: {
        _id: 0,
        percentDailyNormaUser: 1,
        userWaterDay: 1,
      },
    },
  ]);

  if (userWaterDay.length === 0) {
    return res.status(200).json({
      percentDailyNormaUser: 0,
      userWaterDay: [],
    });
  }

  if (!userWaterDay) {
    throw HttpError(400, "Error while performing aggregation in database");
  }

  res.status(200).json(userWaterDay[0]);
};

const waterUserMonth = async (req, res) => {
  const { _id: owner, dailyNorma } = req.user;
  const { year, month } = req.params;

  if (
    !/^\d{4}$/.test(year) ||
    !/^\d{1,2}$/.test(month) ||
    parseInt(month) < 1 ||
    parseInt(month) > 12
  ) {
    throw HttpError(400, "Incorrect year or month values");
  }

  const startDate = moment(`${year}-${month}-01`).startOf("month");
  const endDate = moment(startDate).endOf("month");

  const dailySummary = await Water.aggregate([
    {
      $match: {
        owner,
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      },
    },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$createdAt" } },
        totalVolume: { $sum: "$waterVolume" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.day": 1 },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: { $toInt: year },
            month: { $toInt: month },
            day: "$_id.day",
          },
        },
        dailyNorm: `${dailyNorma}`,
        percentDailyNorm: {
          $min: [
            100,
            {
              $round: [
                {
                  $multiply: [{ $divide: ["$totalVolume", dailyNorma] }, 100],
                },
              ],
            },
          ],
        },
        consumptionCount: "$count",
      },
    },
  ]);

  if (dailySummary.length === 0) {
    return res.status(200).json({
      percentDailyNorm: 0,
      consumptionCount: 0,
      dailyNorm: dailyNorma,
      date: 0,
    });
  }

  if (!dailySummary) {
    throw HttpError(400, "Error while performing aggregation in database");
  }

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
