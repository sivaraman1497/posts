import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Post, Image } from "../server/db/db.js"; 
import { get } from "http";

const postRoutes = express.Router();

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/"); 
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);    
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,     // 10mb
    fieldSize: 10 * 1024 * 1024,    // 10mb
  },
});

postRoutes.post("/createPost", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path,
      url: `http://localhost:8000/assets/${req.file.filename}`,
    });

    await newImage.save();

    const postCount = await Post.countDocuments();

    const newPost = {
        postid: postCount+1,
        title: req.body.title,
        message: req.body.message,
        imageUrl: newImage.url,
        userid: req.body.userid
    };

    const createPost = await Post.insertOne(newPost)

    if(createPost)
    {
        res.status(200).json({
        message: "success",
        imageUrl: newImage.url,
        });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

postRoutes.post('/getPosts', async (req, res) => {
    const {userid} = req.body;

    const getPosts = await Post.find({userid}, {_id:0, __v:0});
    
    if(getPosts)
    {
        res.status(200).send(getPosts)   
    }
})

postRoutes.post('/editPost', async (req, res) => {
    let {userid, postid} = req.body;
    const getPost = await Post.findOne({userid, postid}, {_id:0, __v:0})
    
    if(!getPost)
    {
        res.status(500).send('Access denied')
    }
    
    res.status(200).send(getPost)
});

postRoutes.post('/updatePost', upload.single("image"), async (req, res) =>
{
    const { postid, title, message, userid} = req.body;
    const updateFields = { title, message };

    if (req.file) 
    {
        updateFields.imageUrl = `http://localhost:8000/assets/${req.file.filename}`;
    }

    const updatePost = await Post.updateOne({ userid, postid }, { $set: updateFields } );

    if(updatePost)
    {
        res.status(200).send("Update successful");
    }
    
    else
    {
        res.status(500).send("Update unsuccessful");
    }
});

postRoutes.post('/deletePost', async(req, res) => {
    const {userid, postid} = req.body;
  
    const deletePost = await Post.deleteOne({postid, userid})

    if(deletePost)
    {
        const getPosts = await Post.find({userid}, {_id:0, __v:0});
        res.status(200).send(getPosts)  
    }
})

export default postRoutes;
