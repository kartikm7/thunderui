import { signIn, signOut, auth } from "@/auth";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
export default async function Auth() {
  const session = await auth();
  const user = session?.user;
  console.log(user);
  /* the essence of coding is in doing the things we love, man I don't know why but I've been in my feelings recently
     coding really makes me feel better, gives me a definitive goal to work on and problems too solve.
  */

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <div className="size-8 items-center justify-center rounded-full bg-secondary selection:border-background">
            {user.image ? (
              <Image
                src={user?.image}
                width={0}
                height={0}
                sizes="100vh"
                className="w-full rounded-full"
                alt="Your image, you look great!"
              />
            ) : (
              <h1>{user.name?.charAt(0)}</h1>
            )}
          </div>
          <h1 className="hidden lg:block">{user.name}</h1>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 space-y-2">
        <div>
          <DropdownMenuLabel className="p-0">Your Account</DropdownMenuLabel>
          <p className="text-xs opacity-75">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="secondary" className="w-full" type="submit">
            Sign Out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button className="" variant={'secondary'} type="submit">
        Sign In
      </Button>
    </form>
  );
}
