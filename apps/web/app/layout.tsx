import "@/globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
