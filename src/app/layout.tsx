import { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "@/presentation/components/ToastProvider";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
