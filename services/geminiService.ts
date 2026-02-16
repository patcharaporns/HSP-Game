import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { FALLBACK_QUESTIONS } from "../constants";

export const generateQuizQuestions = async (): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found, using fallback questions.");
    return FALLBACK_QUESTIONS;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We request 15 questions as per requirements
    const prompt = `
      Generate 15 multiple-choice questions about "Principles of Research Human Ethics" (e.g., Belmont Report, Informed Consent, Vulnerable Populations, Beneficence, Justice, Privacy).
      The content MUST be in THAI language.
      Each question must have 4 options and one correct answer.
      Provide a short explanation for the correct answer.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING, description: "The question text in Thai" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 options in Thai"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct in Thai" }
            },
            required: ["id", "text", "options", "correctAnswerIndex", "explanation"],
            propertyOrdering: ["id", "text", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure we have exactly 15 or whatever returned, mapping to our interface just in case
      return data.map((q: any, index: number) => ({
        ...q,
        id: index + 1 // Ensure sequential IDs
      }));
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return FALLBACK_QUESTIONS; // Graceful degradation
  }
};
