const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    resetToken: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1000 * 60 })
const Session = mongoose.model("Session", userSchema);
module.exports = Session;
