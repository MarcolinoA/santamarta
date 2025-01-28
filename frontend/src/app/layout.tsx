import type { Metadata } from "next";
import "./globals.css";
import { Inter, Bebas_Neue, Exo_2 } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${bebasNeue.className} ${exo2.className}`}>
        {children}
      </body>
    </html>
  );
}
