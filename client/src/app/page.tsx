import VanishInput from "@/components/landing/VanishInput";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import DotPattern from "@/components/magicui/dot-pattern";
import { Lights } from "@/components/ui/lights";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-5 relative">
      <div
        className={cn(
          "group rounded-full border  border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out">
          <span>✨ Free and Open Source</span>
        </AnimatedShinyText>
      </div>
      <div className="p-10">
        <h1 className="text-xl md:text-3xl lg:text-5xl">Create exemplarary user interfaces <br /> using natural language.</h1> 
      </div>
      <VanishInput />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] opacity-20 -z-10",
        )}
      />
      <Lights className='fixed' />
    </div>
  );
}
