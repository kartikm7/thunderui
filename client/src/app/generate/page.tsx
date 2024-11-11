"use client";
import { BrowserComponent } from "@/components/ui/browser-mock";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { ChatGroq } from "@langchain/groq";
import { ChatXAI } from "@langchain/xai";
import React, { useState } from "react";
import { LiveProvider, LiveError, LivePreview, LiveEditor } from "react-live";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import AnimatedShinyPattern from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { RainbowButton } from "@/components/ui/rainbow-button";
import WordFadeIn from "@/components/ui/word-fade-in";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import z from "zod";
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

const scope = {
  RainbowButton,
  AnimatedGridPattern,
  AnimatedShinyPattern,
  BorderBeam,
  WordFadeIn,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Textarea,
  z,
  zodResolver
};

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
  "Dashboard with stats and graphs.",
];

const schema = {
  component: "react component based on the users prompt",
};

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
render(<SimpleGreeting />);`,
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

render(<CounterButton />);`,
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
);`,
  },
];

const systemPrompt = `
You are a helpful AI assistant that generates React components using Tailwind CSS and custom components.

Available custom components that are already imported and ready to use, YOU NEED TO USE these:

1. Button
   Usage: <Button variant="outline">Button</Button>

2. RainbowButton
   Usage: <RainbowButton className="...">Button Text</RainbowButton>

3. WordFadeIn
   Usage: <WordFadeIn words="Text to fade in" className="..." />

4. BorderBeam
   Usage: <div className="relative h-[200px] w-[200px] rounded-xl"><BorderBeam /></div>

5. AnimatedGridPattern
   Usage: <div className="relative"><AnimatedGridPattern numSquares={30} maxOpacity={0.1} /></div>

6. Accordion
   Usage: 
   <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
         <AccordionTrigger>Is it accessible?</AccordionTrigger>
         <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
         </AccordionContent>
      </AccordionItem>
   </Accordion>

7. Input
   Usage: <Input />

8. AnimatedShinyPattern
   Usage: <AnimatedShinyPattern>Text to animate</AnimatedShinyPattern>

9. DropdownMenu
   Usage: 
   <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
         <DropdownMenuLabel>My Account</DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem>Profile</DropdownMenuItem>
         <DropdownMenuItem>Billing</DropdownMenuItem>
         <DropdownMenuItem>Team</DropdownMenuItem>
         <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
   </DropdownMenu>

10. Select
    Usage: 
    <Select>
       <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
       </SelectTrigger>
       <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
       </SelectContent>
    </Select>

  11. Separator
      Usage:
      <Separator />
  12. Text Area
      Usage:
      <Textarea />

Important instructions:
- DO NOT include any imports - all components are already imported
- Use Tailwind CSS for styling
- Prefer using the custom components when appropriate
- Components should be responsive
- Follow dark mode conventions using the "dark:" class
- Output must follow this schema: ${JSON.stringify(schema)}
- Add appropriate gaps and spacing ALWAYS  

- USE ONLY the following classes:
bg-foreground text-background antialiased dark:bg-foreground dark:text-foreground

ALSO MAKE SURE YOU ADD the render(<ComponentName/>) to preview the component
Here are some examples of valid components:
${JSON.stringify(examples, null, 2)}
`;

export default function GeneratePage() {
  const [generatedResponse, setGeneratedResponse] = useState(``);
  const [prompt, setPrompt] = useState("");
  const [codePreview, setCodePreview] = useState(false);

  // const llm = new ChatXAI({
  //   model: "grok-beta",
  //   apiKey: process.env.NEXT_PUBLIC_XAI_API
  // })

  const llm = new ChatGroq({
    model: "llama-3.2-90b-text-preview",
    apiKey: process.env.NEXT_PUBLIC_GROQ_API,
  });
  const structure = z.object({
    component: z.string().describe("React code with render for live preview"),
  });
  const structuredLLM = llm.withStructuredOutput(structure);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await structuredLLM.invoke([
      ["system", systemPrompt],
      ["human", prompt],
    ]);
    if (response.component) setGeneratedResponse(response.component);
    else setGeneratedResponse("");
  };

  // useEffect(()=>{c
  // },[generatedResponse])

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-4">
      <BrowserComponent
        codePreview={codePreview}
        setCodePreview={setCodePreview}
        url="thunderui.in/generate"
        className="size-3/4 overflow-scroll"
      >
        {generatedResponse ? (
          <LiveProvider scope={scope} code={generatedResponse} noInline={true}>
            <LiveError />
            {codePreview ? <LiveEditor className="overflow-scroll" /> : <LivePreview />}
          </LiveProvider>
        ) : (
          "Nothing to preview."
        )}
      </BrowserComponent>
      <PlaceholdersAndVanishInput
        placeholders={placeholder}
        onSubmit={onSubmit}
        onChange={handleChange}
      />
    </div>
  );
}
