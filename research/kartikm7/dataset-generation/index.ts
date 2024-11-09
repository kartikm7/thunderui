import "dotenv/config"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dataset from "./dataset.json" assert {type: "json"}
import { DataEntry } from "./types/types";
import cliProgress from "cli-progress";
import { appendFileSync, createWriteStream, existsSync } from "fs"

// giving access to the api key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "");

// chosen components array with description
const chosenComponents = [
  `RainbowButton:
  - Import: import { RainbowButton } from "@/components/magicui/rainbow-button";
  - children: Content inside the button.
  - className: Optional Tailwind CSS class (e.g., "bg-blue-500 text-white").
  
  Example:
  import { RainbowButton } from "@/components/magicui/rainbow-button";
  <RainbowButton className="text-center">Get Unlimited Access</RainbowButton>`,

  `AnimatedShinyText:
  - Import: import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
  - children: Text to be shimmered.
  - className: Optional Tailwind CSS class (e.g., "text-center").
  - shimmerWidth: Width of the shimmer (default: 100).
  
  Example:
  import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
  <AnimatedShinyText className="text-center">Shiny Text</AnimatedShinyText>`,

  `WordFadeIn:
  - Import: import WordFadeIn from "@/components/magicui/word-fade-in";
  - className: Optional Tailwind CSS class (e.g., "text-xl font-bold").
  - delay: Delay between each word animation (default: 0.15).
  - words: Text animated word by word (default: "word fade in").
  - variants: Framer-motion animation props.
  
  Example:
  import WordFadeIn from "@/components/magicui/word-fade-in";
  <WordFadeIn words="Word Fade In" />`,

  `BorderBeam:
  - Import: import { BorderBeam } from "@/components/magicui/border-beam.tsx";
  - className: Optional Tailwind CSS class (e.g., "border-2").
  - size: Size of the beam (default: 300).
  - duration: Duration of the animation (default: 15).
  - anchor: Anchor point of the beam (default: 90).
  - borderWidth: Width of the beam (default: 1.5).
  - colorFrom: Start color of the beam (default: #ffaa40).
  - colorTo: End color of the beam (default: #9c40ff).
  - delay: Delay before animation starts (default: 0).
  
  Example:
  import { BorderBeam } from "@/components/magicui/border-beam.tsx";
  <div className="relative h-[200px] w-[200px] rounded-xl">
    <BorderBeam />
  </div>`,

  `AnimatedGridPattern:
  - Import: import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
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
  import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
  <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
    <p className="z-10 text-center text-5xl font-medium text-black dark:text-white">Animated Grid Pattern</p>
    <AnimatedGridPattern numSquares={30} maxOpacity={0.1} duration={3} repeatDelay={1} />
  </div>`
];

function safeParseJSON(jsonString:string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Skipping invalid JSON entry due to syntax error");
    return null; // Return null if JSON is invalid
  }
}

// schema of expected output
const schema = {
  description: "Enhanced React Code",
  type: SchemaType.OBJECT,
  properties: {
    prompt: {
      type: SchemaType.STRING,
      description: "Generate a prompt that clearly instructs the LLM to create code from scratch, without EVER referring to prior versions or enhancements. The prompt should focus on the creation of a new element, like 'Generate a Landing Page using XYZ,' instead of suggesting modifications/enhancements to an existing component.",
      nullable: false
    },
    content: {
      type: SchemaType.STRING,
      description: "React code using MagicUI components",
      nullable: false
    },
  },
};

const systemPrompt = `You are a helpful assistant that enhances given code by using the following React components from Magic UI (make sure you update the imports as well): \n
${chosenComponents.toString()}
\n \n
---
\n \n
and also devises a prompt that describes what the user meant to say to you.`


// defining the gemini model w/ json mode and system prompt
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemPrompt,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

// loading the dataset
const data = dataset as DataEntry[]

// where the loop starts from
let index = 500;

// sleep function to not hit the rate limit
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
progressBar.start(499, 0)

const outputFile = "augmented-dataset.json";
const writeStream = createWriteStream(outputFile, { flags: "a" });

if (!existsSync(outputFile)) {
  appendFileSync(outputFile, "[\n");
}

// Progress bar setup
progressBar.start(500, 0);

// Loop through dataset entries and generate content
for (let i = 98; i < index + 500 && i < data.length; i++) {
  const entry = data[i];

  try {
    const result = await model.generateContent(entry.content);
    const parsedResult = safeParseJSON(result.response.text());

    if (!parsedResult) continue; // Skip invalid JSON entries

    const jsonString = JSON.stringify(parsedResult, null, 2);

    // Write JSON string to the file, omitting trailing comma on the last entry
    writeStream.write(jsonString);
    if (i < index + 500 - 1 && i < data.length - 1) {
      writeStream.write(",\n"); // Add comma only if it's not the last entry
    }

    progressBar.increment();
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Rate limit
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

// Close the JSON array and write stream
appendFileSync(outputFile, "\n]");
writeStream.end();
progressBar.stop();

console.log("Dataset augmentation completed successfully.");