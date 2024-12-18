import type { Metadata } from "next";
import "./globals.css";
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

 

  return (
    <html lang="en" className="h-full w-full">
      <body
        className={` h-full w-full`}
      >

          {children}

        <Toaster />
      </body>
    </html>
  );
}

