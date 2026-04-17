import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Poller from "@/components/Poller";
import { SidebarProvider } from "@/components/SidebarContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MailForge Pro",
  description: "Enterprise Email Automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <div className="content-container">
              {children}
            </div>
          </div>
          <Poller />
        </SidebarProvider>
      </body>
    </html>
  );
}
