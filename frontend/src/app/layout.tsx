import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProviders } from "@/providers/app-providers";
import { CommandMenu } from "@/components/ui/command-menu";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";

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
      <body className="antialiased bg-[#05070d] text-slate-100 min-h-screen">
        <AppProviders>
          <CommandMenu />
          <ShortcutsModal />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
