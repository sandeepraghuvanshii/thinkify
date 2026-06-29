require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/user.route");
const chatRouter = require("./routes/chat.routes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { initSocket } = require("./sockets/server.socket");

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer);

app.use(
  cors({
    origin: "https://thinkify-sxaq.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", userRoute);
app.use("/api/chat", chatRouter);

app.use(express.static(path.join(__dirname, "./build")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
