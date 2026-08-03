import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";
import "@/styles/globals.css";
import { AppProviders } from "@/providers/app-providers";
import { CommandMenu } from "@/components/ui/command-menu";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZHĪ AI – Enterprise AI Knowledge Operating System",
  description: "Production-Grade AI Operating System with Multi-Agent RAG, GraphRAG, Long-Term Memory, and Reflection Engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${barlow.variable} ${instrumentSerif.variable}`}>
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
