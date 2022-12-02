const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    shelf: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    lang: {
      type: String,
      default: "uz",
      enum: ["uz", "ru", "en"],
      lowercase: true,
    },
    date_of_birth: {
      type: Date,
      required: function () {
        return this.role === "author";
      },
    },
    date_of_death: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["reader", "author"],
      required: true,
    },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
