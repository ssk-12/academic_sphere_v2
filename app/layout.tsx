import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from 'antd';

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
      <body className={` h-full w-full`}>
      <ConfigProvider>
        <AntdRegistry>{children}</AntdRegistry></ConfigProvider>

        <Toaster />
      </body>
    </html>
  );
}
