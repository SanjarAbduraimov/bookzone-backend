const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    date_of_birth: { type: Date, default: "" },
    date_of_death: { type: Date, default: "" },
    image: { type: String, default: "" },
    oldImage: { type: String, default: "" },
  },
  { timeStamps: true }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
