import { HttpError } from "../helpers/HttpError.js";

const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(year) && year > 0 && year <= currentYear;
};

const isValidMonth = (month) => {
  return Number.isInteger(month) && month >= 1 && month <= 12;
};

const isValidYearAndMonth = (req, res, next) => {
  const { year, month } = req.params;

  if (!isValidYear(Number(year))) {
    return next(HttpError(400, `${year} is not a valid year`));
  }

  if (!isValidMonth(Number(month))) {
    return next(HttpError(400, `${month} is not a valid month`));
  }

  next();
};

export default isValidYearAndMonth;
