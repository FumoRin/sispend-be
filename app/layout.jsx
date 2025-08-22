export const metadata = {
  title: "Sispend Backend",
  description: "Sispend API Server",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


