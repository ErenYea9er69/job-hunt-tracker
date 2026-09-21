import "./globals.css";

export const metadata = {
  title: "The Hunt Log — Job Search Tracker",
  description: "Track companies, open roles, stipends, and application outcomes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
