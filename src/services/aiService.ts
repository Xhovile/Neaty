import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getSchoolNews = async () => {
  if (!apiKey) return "Please set your GEMINI_API_KEY in the environment.";
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide a brief summary of the latest trends in global education for 2024-2025. Keep it to 3 bullet points.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching school news:", error);
    return "Unable to fetch education trends at this time.";
  }
};

export const chatWithAssistant = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  if (!apiKey) return "Please set your GEMINI_API_KEY in the environment.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "You are a helpful school management assistant for EduReport Pro. You help teachers and administrators with student data, grading policies, and general school management advice. Keep responses professional and concise.",
      },
      history,
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
