const fs = require("fs");
const shortid = require("shortid");
var cloudinary = require('cloudinary').v2
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var Book = require('../models/book.model')
var User = require('../models/user.model')
const Session = require('../models/sessions.model')

const getBook = function (req, res) {

  User.findOne({
    id: req.signedCookies.userId
  }).then(function (user) {

    Book.find().then(function (books) {
      res.render("books/index", {
        books,
        user
      });
  //    res.json( books);
    })
  })
}

const getCreate = function (req, res) {
  var user = User.find({
    id: req.signedCookies.userId
  });
  res.render("books/create", {
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
  Book.create({
        id:shortid.generate(),
        creator_id:user2.id,
        title: req.body.title,
        description: req.body.description,
        cover: path,
        price: req.body.price
  });
  if (req.file) {
    fs.unlinkSync(req.file.path);
  }

return res.json({a:req.body,b:req.file})
};

const viewDetailBook = function (req, res) {
  User.findOne({
    id: req.signedCookies.userId
  }).then(function (user) {
    Book.findOne({
      id: req.params.id
    }).then(function (book) {
      res.render("books/view", {
        book: book,
        user: user
      });
    })
  })
};
var getApi = async (req, res) => {
 
  let books = await Book.find();
  res.json(
    books
    )
};


module.exports = {
  getBook,
  getCreate,
  viewDetailBook,
  getApi,
  postCreate
}