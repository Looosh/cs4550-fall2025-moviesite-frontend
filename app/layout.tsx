import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthProvider";

export const metadata = {
  title: "MovieHub",
  description: "Movie reviews, favorites, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="px-8 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
