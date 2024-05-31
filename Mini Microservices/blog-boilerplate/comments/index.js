const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];

  res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];

  const comment = {
    id: commentId,
    content,
  };

  commentsByPostId[postId] = [...comments, comment];

  // Post event
  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId,
      },
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.status(201).send(comment);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("Comments service listening on port 4001");
});
