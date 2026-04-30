const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    likers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
