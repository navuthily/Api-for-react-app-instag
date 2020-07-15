const Post= require("../models/post.model.js");
module.exports.addToCartHeart = async (req, res) => {
  var user = req.body.user;
  var user2 = JSON.parse(user)
  let heartByUserId =user2.id;
  let postId = '5f0f01a7e5b652634c89de6d'
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
