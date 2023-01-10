const router = require("express").Router();
const { Promise } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を編集する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿を編集しました");
    } else {
      return res.status(403).json("他の人の投稿を編集できません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿を削除しました");
    } else {
      return res.status(403).json("他の人の投稿を削除できません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を削除する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //まだ投稿にいいねをしていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねを押しました");
      //投稿にいいねをしていたら
    } else {
      //いいねを取り除く
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねを外しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //自分がフォローしているユーザーの投稿を取得
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
