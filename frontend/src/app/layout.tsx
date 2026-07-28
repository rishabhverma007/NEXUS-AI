import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProviders } from "@/providers/app-providers";
import { CommandMenu } from "@/components/ui/command-menu";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";

export const metadata: Metadata = {
  title: "NEXUS AI — Enterprise AI Knowledge Operating System",
  description:
    "Production-Grade AI Operating System with Multi-Agent RAG, GraphRAG, Long-Term Memory, and Reflection Engine.",
  openGraph: {
    title: "NEXUS AI — Enterprise AI Knowledge Operating System",
    description:
      "Knowledge. Reasoning. Memory. Agents. Research. Governance. Everything. One Platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#05070A] text-slate-100 min-h-screen">
        {/* Background layers */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob" />
          <div className="aurora-blob" />
          <div className="aurora-blob" />
        </div>
        <div className="grid-overlay" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        <AppProviders>
          <CommandMenu />
          <ShortcutsModal />
          <div className="relative z-[2]">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
