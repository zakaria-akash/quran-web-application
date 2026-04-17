import "./globals.css";
import { ReaderSettingsProvider } from "./settings-provider";

export const metadata = {
  title: "Quran Web Application",
  description: "Quran Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Global provider makes settings available across all client views. */}
        <ReaderSettingsProvider>{children}</ReaderSettingsProvider>
      </body>
    </html>
  );
}
