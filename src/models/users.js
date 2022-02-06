const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    shelf: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    // book: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'Book',
    // },
    // shelfName: {
    //   type: String,
    //   enum: ['currently-reading', 'to-read', 'read'],
    //   lowercase: true,
    //   required: true
    // },
    // updatedAt: { type: Date, default: Date.now() }
    // }],
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
    image: { type: String, default: "" },
    oldImage: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
