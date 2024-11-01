import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
// import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fastyr frontend test",
  description: "Built by Abdulhamid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <ApolloWrapper>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <Toaster />
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
