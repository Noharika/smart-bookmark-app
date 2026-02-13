export const metadata = {
  title: "Smart Bookmark App",
  description: "Next.js + Supabase + Tailwind — Smart Bookmark Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}