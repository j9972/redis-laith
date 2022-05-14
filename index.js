const express = require("express");
const redis = require("redis");

const util = require("util");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient();

client.connect();

// util.promisify => 비동기로 돌리려는 함수를 promise로 감싸주지 않고 사용할 수 있다.
//client.set = util.promisify(client.set);
client.set("post", "test");
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const { key, value } = req.body;
  let respone_data = client.set(key, value);
  console.log(respone_data);
  const response = await client.get(key);
  res.json(respone_data);
});

app.listen(8080, () => {
  console.log("8080 connect!");
});
