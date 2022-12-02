const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      min: [3, "Too few word to comment "],
    },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamp: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
