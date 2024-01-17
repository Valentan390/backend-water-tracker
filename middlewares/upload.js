import multer from "multer";
import path from "path";

import { HttpError } from "../helpers/HttpError.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const allowedExtensions = ["jpeg", "jpg", "png"];

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop().toLowerCase();

  if (extension === "exe") {
    cb(HttpError(400, "Cannot save file with .exe extension"));
  }

  if (!allowedExtensions.includes(extension)) {
    return cb(HttpError(400, `Unsupported file extension: ${extension}`));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
