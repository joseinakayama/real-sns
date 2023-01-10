const express = require("express");
const app = express();
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const { required } = require("nodemon/lib/config");
const PORT = 5000;
const mongoose = require("mongoose");
require("dotenv").config();

//DBと接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DB接続中・・・");
  })
  .catch((err) => {
    console.log(err);
  });

//ミドルウェア
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("hello express");
});
// app.get("/users", (req, res) => {
//   res.send("users express");
// });

app.listen(PORT, () => console.log("サーバーが起動しました。"));
