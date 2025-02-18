import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MiFID II Compliance Checker',
  description: 'Audio transcription and compliance analysis tool for MiFID II regulations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#1A1B1E] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}