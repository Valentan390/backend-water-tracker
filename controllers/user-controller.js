import fs from "fs/promises";
import jimp from "jimp";
import cloudinary from "../helpers/cloudinary.js";

import User from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getCurrent = async (req, res) => {
  const { username, email, avatarURL } = req.user;
  res.json({ username, email, avatarURL });
};

const updateUserAvatars = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);

  const { public_id: originalPublicId, url: originalPoster } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

  const resizedPosterPath = `path/to/store/resized_${_id}.webp`;

  const originalImage = await jimp.read(originalPoster);

  await originalImage.resize(250, 250).write(resizedPosterPath);

  await cloudinary.uploader.destroy(originalPublicId);

  await fs.unlink(req.file.path);

  const { url: resizedPoster } = await cloudinary.uploader.upload(
    resizedPosterPath,
    {
      folder: "avatars",
      format: "webp",
    }
  );

  await fs.unlink(resizedPosterPath);

  const updatedUserAvatar = await User.findByIdAndUpdate(_id, {
    avatarURL: resizedPoster,
  });

  res.status(201).json({
    username: updatedUserAvatar.username,
    avatarURL: updatedUserAvatar.avatarURL,
  });
};

export default {
  getCurrent: ctrlWrapper(getCurrent),
  updateUserAvatars: ctrlWrapper(updateUserAvatars),
};
