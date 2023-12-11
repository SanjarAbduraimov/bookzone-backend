import mongoose from "mongoose";
import bcrypt from "bcrypt";
import MyError from "../utils/error.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, unique: true, required: true },
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
    otp: {
      code: {
        type: Number,
        default: null
      },
      createdAt: {
        type: Date,
        default: null
      },
      attempts: {
        type: Number,
        default: null
      },
      verified: Boolean
    },
    resetToken: { type: String },
    verified: { type: Boolean, default: false },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword
    next()
  } catch (err) {
    return next(err);
  }
})
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new MyError(error.message, 400);
  }
};
const User = mongoose.model("User", userSchema);
export default User;
