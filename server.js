const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const list = JSON.parse(fs.readFileSync("list.json", "utf-8")) || [];

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/todolist", (req, res) => {
  res.json(list);
});

app.post("/todolist", (req, res) => {
  list.push(req.body);
  fs.writeFileSync("list.json", JSON.stringify(list));
  res.json(list);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
