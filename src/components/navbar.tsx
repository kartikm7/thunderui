import HyperText from "./magicui/hyper-text";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import Auth from "./auth";

export default function Navbar() {
  return (
    <>
      <div className="fixed z-10 w-full flex justify-between items-center p-5">
        <Link href={'/'} className="">
        <div className="flex items-center gap-1 !cursor-pointer">
          <LightningBoltIcon />
          <HyperText text="Thunder UI" />
        </div>
        </Link>
        <div className="flex items-center gap-4">
        <Auth />
        <Link href={'/generate'}><Button>Generate</Button></Link>
        <ModeToggle />
        </div>
      </div>
    </>
  );
}
