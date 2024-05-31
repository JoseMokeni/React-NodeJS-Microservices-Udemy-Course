const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;

    const post = {
      id,
      title,
      comments: [],
    };

    posts[id] = post;
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    comments = [
      ...posts[postId].comments,
      {
        id,
        content,
      },
    ];

    posts[postId] = {
      ...posts[postId],
      comments,
    };
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("Query service listening on port 4002");
});
