import type { Metadata } from "next";
import { Dancing_Script, Lato } from "next/font/google";
import "./globals.css";
import { Background } from "@/components/ui/Background";

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bingo Chá de Panela",
  description: "Divirta-se no Chá de Panela!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dancingScript.variable} ${lato.variable} font-sans antialiased text-foreground bg-background`}
      >
        <Background />
        {children}
      </body>

    </html>
  );
}
