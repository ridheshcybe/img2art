import path from "path";
import express from "express";

const app = express();

app.use(express.static("./public"));

app.get("/main", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/main.js"));
});

app.get("/style", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/style.css"));
});

app.listen(8080);
