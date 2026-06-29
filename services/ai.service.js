const { ChatMistralAI } = require("@langchain/mistralai");
const { HumanMessage, SystemMessage, AIMessage } = require("langchain");

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_AI_KEY,
});

const generateResponse = async (messages) => {
  try {
    const response = await model.invoke(
      messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    );

    return response.content;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

const generateChatTitle = async (message) => {
  try {
    const response = await model.invoke([
      new SystemMessage(
        "You are a helpful assistant that generates concise and descriptive titles for chat conversations.",
      ),
      new HumanMessage(
        `Generate a short title (max 5 words) for a chat conversation based on the following first message:\n\n${message}`,
      ),
    ]);

    return response.content;
  } catch (error) {
    console.error("Error generating chat title:", error);
    throw error;
  }
};

module.exports = {
  generateResponse,
  generateChatTitle,
};
