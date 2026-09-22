import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "EduConnect - G8",
  description:
    "Plataforma de gestión de tutorías académicas: encuentra tutor, agenda tu sesión y da seguimiento a tu progreso.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-body bg-paper text-charcoal antialiased`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
