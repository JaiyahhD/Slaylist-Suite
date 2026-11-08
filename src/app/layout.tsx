import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";
export const metadata: Metadata = {title:"Slaylist FM | Jaiyah’s Bookish Universe",description:"Too many books. Too many fictional men. Not a single regret."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><Shell>{children}</Shell></body></html>;}
