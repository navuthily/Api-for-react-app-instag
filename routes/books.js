var express = require('express')
var router = express.Router();
const {userAuth,userIsNotAuth}=require('../middleware/auth.middleware')
const{
  getBook,
  postCreate,
  getCreate,
  viewDetailBook,
  getApi
}=require('../controllers/book.controller')
const {
  uploadMulter,
} = require('../models/multer');

const {isAdmin,isNotAdmin}=require('../middleware/isAdmin.middleware')
router.get("/",getBook);

router.get('/ap',getApi)
router.get("/create", getCreate);
router.post("/create",uploadMulter.single('cover'), postCreate);
router.get("/view/:id", viewDetailBook);

module.exports = router;