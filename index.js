"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.use(express_1.default.static("./public"));
app.get("/main", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "./public/main.js"));
});
app.get("/style", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "./public/style.css"));
});
app.listen(8080);
