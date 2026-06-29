const express = require("express");
const router = express.Router();
const {
  sendMessageController,
  getChats,
  getMessages,
  getAllChatsWithMessages,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/message", authMiddleware, sendMessageController);
router.get("/", authMiddleware, getChats);
router.get("/:chatId/messages", authMiddleware, getMessages);
router.get("/all-with-messages", authMiddleware, getAllChatsWithMessages);

module.exports = router;
