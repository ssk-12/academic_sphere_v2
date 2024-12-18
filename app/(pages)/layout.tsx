import type { Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import { cookies } from "next/headers";
import { getSession } from "@/lib/getSession";
import { Toaster } from "@/components/ui/toaster"



export const metadata: Metadata = {
  title: "Academic Sphere",
  description: "Manage your academic life with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;


  return (
    <div className="h-full">
      <Navbar
    defaultCollapsed={true}
    defaultLayout={[4, 96]}
    navCollapsedSize={4}
    user={
      user && user.name && user.email
        ? { name: user.name, email: user.email }
        : null
    }
  >
    {children}
  </Navbar>
    </div>
  );
}

