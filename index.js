const express = require("express");
const redis = require("redis");
const axios = require("axios");

const util = require("util");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient();

client.connect();

// util.promisify => 비동기로 돌리려는 함수를 promise로 감싸주지 않고 사용할 수 있다.
// client.set = util.promisify(client.set);
// client.get = util.promisify(client.get);

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { key, value } = req.body;
  client.set(key, value);

  const response = await client.get(key, value);
  console.log("success");
  res.json(response);
});

app.get("/post/:id", async (req, res) => {
  let { id } = req.params;

  const cachedPost = await client.get(`post-${id}`);
  if (cachedPost) {
    console.log("cache hit");
    return res.json(JSON.parse(cachedPost));
  }

  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  client.set(`post-${id}`, JSON.stringify(response.data));
  console.log("cache miss");
  return res.json(response.data);
});

app.listen(8080, () => {
  console.log("8080 connect!");
});
