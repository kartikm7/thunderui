"use client";

import { BrowserComponent } from "@/components/ui/browser-mock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { ChatGroq } from "@langchain/groq";
import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview, LiveEditor } from "react-live";

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
      <PlaceholdersAndVanishInput className="" placeholders={placeholder} onSubmit={onSubmit} onChange={handleChange} />
    </div>
  );
}
