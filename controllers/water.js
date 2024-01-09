import Contact from "../models/waters.js";

// import * as contactsService from "../models/contacts.js";
// import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getALL = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

export default {
  getALL: ctrlWrapper(getALL),
  // getById: ctrlWrapper(getById),
  // add: ctrlWrapper(add),
  // updateById: ctrlWrapper(updateById),
  // deleteById: ctrlWrapper(deleteById),
};
