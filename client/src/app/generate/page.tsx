"use client";

import { BrowserComponent } from "@/components/ui/browser-mock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { ChatGroq } from "@langchain/groq";
import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview, LiveEditor } from "react-live";
import * from 

const placeholder = [
  "Responsive navbar with dropdowns.",
  "Card with image, title, and text.",
  "Login form with email and password.",
  "Sidebar with expandable sections.",
  "Modal with 'Yes'/'No' buttons.",
  "Hero section with background and CTA.",
  "Paginated list with search.",
  "Profile card with avatar and links.",
  "Pricing table with three tiers.",
  "Footer with links and social icons.",
  "Progress bar for multi-step form.",
  "Image carousel with navigation.",
  "Contact form with fields and submit.",
  "Notification banner with dismiss.",
  "Tabbed interface for content switch.",
  "Product card with price and 'Add to Cart'.",
  "Timeline with dates and events.",
  "Responsive photo grid layout.",
  "Dropdown menu with subcategories.",
  "Dashboard with stats and graphs."
];

const schema = {
  component: "react component based on the users prompt",
}

const examples = [
  {
    component: `function SimpleGreeting() {
  return (
    <div className="p-4 bg-blue-200">
      <h1 className="text-xl font-bold text-center">Hello, World!</h1>
    </div>
  );
}

// This line is necessary for react-live to render the component
render(<SimpleGreeting />);`
  },
  {
    component: `function CounterButton() {
  const [count, setCount] = React.useState(0);

  return (
    <button
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      onClick={() => setCount(count + 1)}
    >
      Clicked {count} times
    </button>
  );
}

render(<CounterButton />);`
  },
  {
    component: `function UserProfile({ name, email, avatar }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
}

render(
  <UserProfile
    name="John Doe"
    email="john@example.com"
    avatar="https://placekitten.com/100/100"
  />
);`
  }
];

// chosen components array with description
const chosenComponents = [
  `RainbowButton:
  - children: Content inside the button.
  - className: Optional Tailwind CSS class (e.g., "bg-blue-500 text-white").
  
  Example:
  <RainbowButton className="text-center">Get Unlimited Access</RainbowButton>`,

  `AnimatedShinyText:
  - Import: import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
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
  import { BorderBeam } from "@/components/magicui/border-beam.tsx";
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
  import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
  <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
    <p className="z-10 text-center text-5xl font-medium text-black dark:text-white">Animated Grid Pattern</p>
    <AnimatedGridPattern numSquares={30} maxOpacity={0.1} duration={3} repeatDelay={1} />
  </div>`
];

const systemPrompt = `
You are a helpful AI assistant, you need to output react code along with tailwind css, use the following colour classes
(bg-foreground text-background dark:bg-foreground dark:text-foreground)
(you do not have access to any external components or libraries) \n strictly follow the following output schema: \n ${JSON.stringify(schema)} \n
some output examples: \n ${JSON.stringify(examples)}
`

export default function GeneratePage() {
  const [generatedResponse, setGeneratedResponse] = useState(``);
  const [prompt, setPrompt] = useState('')
  const [codePreview, setCodePreview] = useState(false)
  const llm = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.NEXT_PUBLIC_GROQ_API,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await llm.invoke([
      [
        "system",
        systemPrompt,
      ],
      ["human", prompt],
    ])
    const res = JSON.parse(`${response.content}`)
    console.log(res)
    if(res.component) setGeneratedResponse(res.component)
    else setGeneratedResponse('')
  };

  // useEffect(()=>{c
  // },[generatedResponse])

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center gap-4 ">
      <BrowserComponent codePreview={codePreview} setCodePreview={setCodePreview} url="thunderui.in/generate" className="size-3/4">
        { generatedResponse ? <LiveProvider code={generatedResponse} noInline={true}>
          <LiveError />
          {codePreview ? <LiveEditor /> : <LivePreview /> }
        </LiveProvider> : 'Nothing to preview.'}
      </BrowserComponent>
      <PlaceholdersAndVanishInput placeholders={placeholder} onSubmit={onSubmit} onChange={handleChange} />
    </div>
  );
}
