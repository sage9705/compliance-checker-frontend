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
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex items-center">
            <span className="text-xl font-semibold">
              MiFID II Compliance Checker
            </span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}