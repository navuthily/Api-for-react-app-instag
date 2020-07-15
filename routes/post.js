var express = require('express')
var router = express.Router();
const {userAuth}=require('../middleware/auth.middleware')
const{
  getPost, 
  getCreate,
  postCreate,
  getComment,
  postComment,
  getApiPost,
  getApi,
  addToCartHeart,
  getheart
}=require('../controllers/post.controller')
const {
  uploadMulter,
} = require('../models/multer');

const {isAdmin,isNotAdmin}=require('../middleware/isAdmin.middleware')
router.get("/",getPost);
router.get("/api",getApiPost);
router.get('/ap',getApi)
router.get("/create",getCreate);
router.post("/create",uploadMulter.single('imagePost'), postCreate);
router.get('/comment/',  getComment)
router.post('/comment/',postComment)
router.get('/heart/', getheart )
router.post('/heart/',addToCartHeart)
module.exports = router;