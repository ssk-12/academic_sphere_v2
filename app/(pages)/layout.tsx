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

  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  console.log(defaultLayout, defaultCollapsed);

  return (
    <div className="h-full">
      <Navbar
    defaultCollapsed={defaultCollapsed}
    defaultLayout={defaultLayout}
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

