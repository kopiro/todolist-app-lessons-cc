const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const uuid = require("uuid");
const sessions = new Map();
const cookieParser = require("cookie-parser");

const list = JSON.parse(fs.readFileSync("list.json", "utf-8")) || [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

app.get("/todolist", (req, res) => {
  res.json(list);
});

app.patch("/todolist", (req, res) => {
  console.log("req.body", req.body, list);
  const index = list.findIndex((e) => e.createdAt == req.body.createdAt);
  if (index === -1) {
    return res.json("Unable to find element");
  }
  list[index] = { ...list[index], ...req.body };
  return res.json(list[index]);
});

app.post("/todolist", (req, res) => {
  list.push(req.body);
  fs.writeFileSync("list.json", JSON.stringify(list));
  res.json(list);
});

function getUsers() {
  return (
    JSON.parse(
      fs.existsSync("users.json")
        ? fs.readFileSync("users.json", "utf-8")
        : "[]"
    ) || []
  );
}

app.get("/", (req, res) => {
  if (req.cookies.session && sessions.has(req.cookies.session)) {
    res.redirect("/todolist.html");
  } else {
    res.redirect("/login.html");
  }
});

app.post("/register", upload.none(), (req, res) => {
  const users = getUsers();

  const userOnFile = users.find((e) => e.email === req.body.email);
  if (userOnFile) {
    return res.json({ error: true, message: "Questo utente esiste già!" });
  }

  if (req.body.password.length < 8) {
    return res.json({
      error: true,
      message: "Questa password è troppo corta!",
    });
  }

  users.push(req.body);

  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json({ message: "Registrazione effettuata correttamente!" });
});

app.post("/login", upload.none(), (req, res) => {
  const users = getUsers();
  const userOnFile = users.find((e) => e.email === req.body.email);
  if (!userOnFile) {
    return res.json({ error: true, message: "This user doesn't exists" });
  }

  if (userOnFile.password !== req.body.password) {
    return res.json({ error: true, message: "Invalid password for user" });
  }

  const sessionId = uuid.v4();
  sessions.set(sessionId, userOnFile);
  res.cookie("session", sessionId, { maxAge: 900000, httpOnly: true });

  res.json({ message: "OK" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
