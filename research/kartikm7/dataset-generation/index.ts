import { ChatGroq } from "@langchain/groq";
import { DataEntry } from "./types/types";
import 'dotenv/config'
import dataset from "./dataset.json" assert {type: "json"}

// dataset
const data = dataset as DataEntry[]

// defining the llm
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API,
  temperature: 0 
});

// sending ai message
const aiMsg = await llm.invoke([
  {
    role: "system",
    content:
      "You are a helpful assistant that translates English to French. Translate the user sentence.",
  },
  { role: "user", content: "I love programming." },
]);

console.log(aiMsg.content);