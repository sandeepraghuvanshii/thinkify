const {
  generateResponse,
  generateChatTitle,
} = require("../services/ai.service");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const sendMessageController = async (req, res) => {
  try {
    // FIX: Look for 'chatId' directly, matching what the frontend sends
    let { message, chatId } = req.body;

    if (chatId === "undefined" || chatId === "null" || chatId === "") {
      chatId = null;
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let chat = null;

    if (chatId) {
      // chatId provided -> reuse existing chat, do NOT generate a new title
      chat = await Chat.findOne({ _id: chatId, user: req.user.id });

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }
    } else {
      // No chatId -> brand new chat, generate a title once
      const title = await generateChatTitle(message);
      chat = await Chat.create({
        user: req.user.id,
        title,
      });
    }

    const activeChatId = chat._id;

    const userMessage = await Message.create({
      chat: activeChatId,
      content: message,
      role: "user",
    });

    const messages = await Message.find({ chat: activeChatId });
    const result = await generateResponse(messages);

    const chatMessage = await Message.create({
      chat: activeChatId,
      content: result,
      role: "ai",
    });

    return res.status(201).json({
      success: true,
      userMessage: {
        ...userMessage.toObject(),
        chat: activeChatId,
      },
      chatMessage,
      chatId: activeChatId,
      chatTitle: chat.title,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
};
const getChats = async (req, res) => {
  const user = req.user;
  const chats = await Chat.find({ user: user.id });
  return res.status(200).json({
    chats,
  });
};
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findOne({ _id: chatId, user: req.user.id });
  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }
  const messages = await Message.find({ chat: chatId });
  return res.status(200).json({
    messages,
  });
};
const getAllChatsWithMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });

    if (chats.length === 0) {
      return res.status(200).json({
        success: true,
        chats: [],
      });
    }

    const chatIds = chats.map((c) => c._id);
    const messages = await Message.find({ chat: { $in: chatIds } }).sort({
      createdAt: 1,
    });

    const messagesByChat = {};
    for (const msg of messages) {
      const key = msg.chat.toString();
      if (!messagesByChat[key]) messagesByChat[key] = [];
      messagesByChat[key].push(msg);
    }

    const chatsWithMessages = chats.map((chat) => ({
      ...chat.toObject(),
      messages: messagesByChat[chat._id.toString()] || [],
    }));

    return res.status(200).json({
      success: true,
      chats: chatsWithMessages,
    });
  } catch (error) {
    console.error("getAllChatsWithMessages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chats with messages",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessageController,
  getChats,
  getMessages,
  getAllChatsWithMessages,
};
