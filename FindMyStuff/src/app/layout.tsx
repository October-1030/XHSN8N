import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindMyStuff - 家庭物品收纳管理",
  description: "记录物品存放位置，再也不怕找不到东西",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
