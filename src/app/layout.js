import "./globals.css";

export const metadata = {
  title: "Quran Web Application",
  description: "Quran Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
