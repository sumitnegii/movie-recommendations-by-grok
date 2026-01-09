import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const run = async () => {
  const result = await model.generateContent("Give me 3 thriller movies");
  console.log(result.response.text());
};

run();
