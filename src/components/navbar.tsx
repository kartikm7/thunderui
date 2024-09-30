import { Flower } from "lucide-react";
import HyperText from "./magicui/hyper-text";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className="fixed z-10 w-full flex justify-between items-center p-5">
        <Link href={'/'} className="">
        <div className="flex items-center gap-1 !cursor-pointer">
          <Flower />
          <HyperText text="Flow UI" />
        </div>
        </Link>
        <div className="flex items-center gap-2">
        <Link href={'/generate'}><Button variant='link'>Get Started</Button></Link>
        <ModeToggle />
        </div>
      </div>
    </>
  );
}
