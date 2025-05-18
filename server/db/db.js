import mongoose from "mongoose";

const users = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    userid: Number
  },
  { collection: "users" }
);

const User = mongoose.model("User", users);

const posts = new mongoose.Schema({
  postid: Number,
  title: String,
  message: String,
  imageUrl: String,
  userid: Number
});

const Post = mongoose.model("Post", posts);

const images = new mongoose.Schema(
  {
    filename: String,
    path: String,
    url: String,
  },
  { collection: "users" }
);

const Image = mongoose.model("Image", images);

export { User, Post, Image};
