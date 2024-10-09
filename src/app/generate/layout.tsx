import { auth } from "@/auth";
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const user = session?.user
  if(!user) redirect('/')
  return <div>{children}</div>;
}
