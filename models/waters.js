import { Schema, model } from "mongoose";

const waterSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  // email: {
  //   type: String,
  // },
  // phone: {
  //   type: String,
  // },
  // favorite: {
  //   type: Boolean,
  //   default: false,
  // },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Contact = model("waters", waterSchema);

export default Contact;
