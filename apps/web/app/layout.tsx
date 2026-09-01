import "@/globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Toaster position="top-center"></Toaster>
      </body>
    </html>
  );
}
