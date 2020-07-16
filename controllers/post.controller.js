const fs = require("fs");
const shortid = require("shortid");
var cloudinary = require('cloudinary').v2
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var Post = require('../models/post.model')
var User = require('../models/user.model')
const getPost = async function (req, res) {
  User.findOne({
    id: req.signedCookies.userId
  }).then(function (user) {
    Post.find().then(async function (posts) {
      res.render("posts/index", {
        posts,
        user
      });
    })
  })
}
const getApiPost = async function (req, res) {
  User.findOne({
    id: req.signedCookies.userId
  }).then(function (user) {
    Post.find().then(async function (posts) {
      res.json(posts)
    })
  })
}
const getCreate = function (req, res) {
  var user = User.find({
    id: req.signedCookies.userId
  });
  res.render("posts/create", {
    user
  });
};
const postCreate = async function (req, res) {
  console.log(req.file)
  const file= req.file.path;
  console.log(req.body)
  var user = req.body.user;
  var user2 = JSON.parse(user)

  const path = await cloudinary.uploader
    .upload(file)
    .then(result => result.url)
    .catch(error => console.log("erro:::>", error));
  Post.create({
    id:shortid.generate(),
    authorid:user2.id,
    contentPost:req.body.contentPost,
    imagePost: path
  });
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }

return res.json({a:req.body,b:req.file})
};
const viewDetailPost = function (req, res) {
  User.findOne({
    id: req.signedCookies.userId
  }).then(function (user) {
    Post.findOne({
      id: req.params.id
    }).then(function (post) {
      res.render("post/view", {
        post: post,
        user: user
      });
    })
  })
};
const postComment = async function (req, res) {
  let contentComment= req.body.contentComment;
  var user = req.body.user;
  var user2 = JSON.parse(user)
  let commentByUserId =user2.id;
  let postId = req.body.id;
  console.log('postId')
  console.log(postId)
    await Post.findOneAndUpdate({
      _id: postId
    }, {
      $push: {
        comments: {
          commentByUserId:commentByUserId,
          contentComment: contentComment
        }
      }
    });
    return res.json({oke:'oke luôn'});
}
const getComment =function (req,res){
  return res.redirect("/post");
}

var getApi = async (req, res) => {
  let users = await User.find();
  let posts = await Post.find();

  let changePost = posts.map(post => {
    let user = users.find(user => user.id === post.authorid);
    var hearts= post.hearts;
    var c = hearts.map(heart => {
      let u = users.find(us => us.id === heart.heartByUserId)
      return{
     heartByUser:u.username,
     quantity:heart.quantity
      }
    });
    var comments = post.comments;
    var d = comments.map(comment =>{
      let uus=users.find(uus =>uus.id === comment.commentByUserId)
      return{
        commentByUser:uus.username,
        contentComment:comment.contentComment
      }
    })
    return {
      id: post._id,
      userName: user.username,
      contentPost: post.contentPost,
      imagePost: post.imagePost,
      hearts:c,
      comments:d
    };
  });
  res.json(
    changePost
    )
};

const getheart =function (req,res){
  return res.redirect("/post");
}

const addToCartHeart = async (req, res) => {
  var user = req.body.user;
  var user2 = JSON.parse(user)

  let heartByUserId =user2.id;
  let postId = req.body.id;
  let post = await Post.findOne({_id:postId});
  let usera = post.hearts.find(
    cartItem => cartItem.heartByUserId === heartByUserId
  );
  console.log(usera)
  if (usera) {
    usera.quantity += 1;
    console.log(usera.quantity)
    post.save();
  } else {
    await Post.findOneAndUpdate({_id:postId}, {
      $push: { hearts: { heartByUserId, quantity: 1 } }
    });
  }
  res.json({oke:'oke luôn'});
};

module.exports = {
  getPost,
  getCreate,
  postCreate,
  getComment,
  postComment,
  getApiPost,
  getApi,
  addToCartHeart, getheart
}
