import { inter } from "@/ui/fonts";
import "../ui/globals.css";
import "../ui/styles.css";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} lg:w-screen lg:overflow-x-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
