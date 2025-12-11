import { GoogleGenAI, Chat } from "@google/genai";
import { Role } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model configuration
const MODEL_NAME = "gemini-2.5-flash";

export const createChatSession = (systemInstruction?: string): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction || "You are a helpful, witty, and concise AI assistant designed to act like a conversational form. Keep your answers relatively short and engaging.",
    },
  });
};

export const sendMessageStream = async (
  chat: Chat,
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const result = await chat.sendMessageStream({ message });
    let fullText = "";

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};