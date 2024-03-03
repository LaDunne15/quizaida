import { Inter } from "next/font/google";
import Link from "next/link";
import NavBar from "../components/navbar";
//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quizaida",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body /*className={inter.className}*/>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}