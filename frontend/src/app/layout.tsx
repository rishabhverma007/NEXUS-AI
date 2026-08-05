import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import { AppProviders } from "@/providers/app-providers";
import { CommandMenu } from "@/components/ui/command-menu";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS AI — Enterprise AI Knowledge Operating System",
  description: "Production-Grade AI Operating System with Multi-Agent RAG, GraphRAG, Long-Term Memory, and Reflection Engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased text-slate-100 min-h-screen aurora-bg`}
      >
        <AppProviders>
          <CommandMenu />
          <ShortcutsModal />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
