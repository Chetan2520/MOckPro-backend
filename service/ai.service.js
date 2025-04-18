// import { GoogleGenAI } from "@google/genai";
const GoogleGenAI = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyCYQFnnIgaOORFogGhXWQBcPiQpDjBYEW4" });

 async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works",
  });
  console.log(response.text);
}

await main();