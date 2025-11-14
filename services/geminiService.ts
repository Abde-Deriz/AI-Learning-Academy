import { GoogleGenAI } from "@google/genai";
import { HelpType, MissionData, MissionType } from '../types';

const API_KEY ="api key"; //process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set for Gemini.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAiHelp = async (
  topic: string,
  helpType: HelpType,
  missionData: MissionData | null = null,
  missionType: MissionType | null = null
): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Psst! The AI Helper is taking a nap. Ask your teacher for a tip instead!");
  }

  let prompt = '';
  const basePrompt = `You are a friendly, encouraging AI robot teaching a 7-year-old about programming and AI. Your tone is simple, fun, and positive.`;

  switch(helpType) {
    case 'hint':
      // Sanitize mission data to keep prompt concise
      const missionSummary = JSON.stringify(missionData, (key, value) => {
          if (key === 'items' && Array.isArray(value)) return `[${value.length} items]`;
          if (missionType === 'jigsaw_puzzle' && key === 'pieces') return `[${value.length} puzzle pieces]`;
          if (missionType === 'fill_in_the_blanks' && key === 'parts') return `[A fill-in-the-blanks sentence]`;
          return value;
      }, 2);

      prompt = `${basePrompt} The student is stuck on a mission about "${topic}". The mission is: ${missionSummary}. Give a short, encouraging hint (under 25 words) to help them solve it without giving away the answer. Start with 'Hint:'.`;
      break;
    case 'explain':
      prompt = `${basePrompt} Explain the topic "${topic}" in a super simple way (under 30 words). Start with 'Here's the simple version:'.`;
      break;
    case 'fact':
      prompt = `${basePrompt} Tell me a surprising "Wow!" fact about "${topic}" (under 30 words). Start with 'Wow Fact:'.`;
      break;
    case 'spark':
      prompt = `${basePrompt} Ask a simple, thought-provoking "Brain Spark" question about "${topic}" to make me think. Start with 'Brain Spark:'.`;
      break;
    case 'tip':
    default:
      prompt = `${basePrompt} Give a fun tip about "${topic}" (under 30 words). Start with 'AI Tip:'.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI help:", error);
    return "Oops! My circuits are a bit scrambled. I couldn't think of anything right now.";
  }
};
