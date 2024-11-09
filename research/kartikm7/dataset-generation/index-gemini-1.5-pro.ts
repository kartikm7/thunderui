import { ChatGroq } from "@langchain/groq";
import { DataEntry } from "./types/types";
import z from "zod"
import 'dotenv/config'
import dataset from "./dataset.json" assert {type: "json"}
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createWriteStream } from "fs";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// dataset
const data = dataset as DataEntry[]

// defining the llm

// groq llm
// const llm = new ChatGroq({
//   model: "llama-3.1-8b-instant",
//   apiKey: process.env.GROQ_API,
//   maxRetries: 2
// });

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey: process.env.GEMINI_API
})

const structure = z.object({
  prompt: z.string().describe("A prompt that a user would send to an LLM to generate the code"),
  code: z.string().describe("React code using MagicUI components"),
});

const structuredLLM = llm.withStructuredOutput(structure)

const chosenComponents = [
  `RainbowButton:
  - children: Content inside the button.
  - className: Optional Tailwind CSS class (e.g., "bg-blue-500 text-white").
  
  Example:
  <RainbowButton className="text-center">Get Unlimited Access</RainbowButton>`,

  `AnimatedShinyText:
  - children: Text to be shimmered.
  - className: Optional Tailwind CSS class (e.g., "text-center").
  - shimmerWidth: Width of the shimmer (default: 100).
  
  Example:
  <AnimatedShinyText className="text-center">Shiny Text</AnimatedShinyText>`,

  `WordFadeIn:
  - className: Optional Tailwind CSS class (e.g., "text-xl font-bold").
  - delay: Delay between each word animation (default: 0.15).
  - words: Text animated word by word (default: "word fade in").
  - variants: Framer-motion animation props.
  
  Example:
  <WordFadeIn words="Word Fade In" />`,

  `BorderBeam:
  - className: Optional Tailwind CSS class (e.g., "border-2").
  - size: Size of the beam (default: 300).
  - duration: Duration of the animation (default: 15).
  - anchor: Anchor point of the beam (default: 90).
  - borderWidth: Width of the beam (default: 1.5).
  - colorFrom: Start color of the beam (default: #ffaa40).
  - colorTo: End color of the beam (default: #9c40ff).
  - delay: Delay before animation starts (default: 0).
  
  Example:
  <div className="relative h-[200px] w-[200px] rounded-xl">
    <BorderBeam />
  </div>`,

  `AnimatedGridPattern:
  - className: Optional Tailwind CSS class (e.g., "inset-x-0 inset-y-[-30%]").
  - width: Width of the pattern (default: 40).
  - height: Height of the pattern (default: 40).
  - x: X offset of the pattern (default: -1).
  - y: Y offset of the pattern (default: -1).
  - strokeDasharray: Stroke dash array (default: 0).
  - numSquares: Number of squares (default: 200).
  - maxOpacity: Maximum opacity (default: 0.5).
  - duration: Duration of the animation (default: 1).
  - repeatDelay: Repeat delay (default: 0.5).
  
  Example:
  <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
    <p className="z-10 text-center text-5xl font-medium text-black dark:text-white">Animated Grid Pattern</p>
    <AnimatedGridPattern numSquares={30} maxOpacity={0.1} duration={3} repeatDelay={1} />
  </div>`
];

let count = 0;
const maxRequestsPerMinute = 2;

for (const entry of data) {
  if (count == 500) break;

  // Check if we need to delay the next request to meet rate limit
  if (count > 0 && count % maxRequestsPerMinute === 0) {
    console.log('Rate limit reached. Waiting for next minute...');
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds
  }
  console.log('Augmenation of entry: '+count+' (Starting)')
  const response = await structuredLLM.invoke([
    {
      role: "system",
      content:
        `You are a helpful assistant that enhances given code by using the following React components from Magic UI (make sure you update the imports as well): \n
        ${chosenComponents.toString()}
        \n \n
        ---
        \n \n
        and also devises a prompt that describes what the user meant to say to you.`,
    },
    { role: "user", content: entry.content },
  ]);

  const data_entry = { prompt: response.prompt, content: response.code };

  // Append the augmented data to the file
  const writeStream = createWriteStream('augmented_dataset.json', { flags: "a" });
  writeStream.end(`${JSON.stringify(data_entry)},\n`);
  writeStream.close();
  console.log('Augmenation of entry: '+count+' (Completed)')
  // Increment the count and handle rate limiting delay
  count++;

  // Optional: Adding a slight delay between requests to avoid hitting rate limit too soon
  if (count % maxRequestsPerMinute !== 0) {
    await new Promise(resolve => setTimeout(resolve, 60000 / maxRequestsPerMinute)); // Delay between each request
  }
}
