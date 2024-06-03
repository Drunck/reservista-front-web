import { inter } from "@/ui/fonts";
import "../ui/globals.css";
import "../ui/styles.css";
import ResponsiveNavbar from "./reponsive-navbar";
import { AuthProvider } from "@/lib/context/auth-provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} lg:w-screen lg:overflow-x-hidden transition`}>
          <ResponsiveNavbar />
          {children}
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
