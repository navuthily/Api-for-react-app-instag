var express= require('express');
var controller =require('../controllers/interactiveWithPost.controller');
var router =express.Router();
router.get('/add', controller.addToCartHeart)
module.exports = router;