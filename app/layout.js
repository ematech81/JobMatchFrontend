import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://jobmatch.com'), // replace with real domain
  title: {
    default: 'JobMatch | Find Remote Jobs & Careers Matched by AI',
    template: '%s | JobMatch',
  },
  description:
    'JobMatch is a job website that matches you to remote jobs and career opportunities by AI. Upload your resume or build one in minutes and get matched with verified employers worldwide.',
  keywords: [
    'job website',
    'job search website',
    'remote jobs',
    'job search',
    'AI job matching',
    'resume builder',
    'career advancement',
    'find a job',
    'job board',
  ],
  openGraph: {
    title: 'JobMatch | Find Remote Jobs & Careers Matched by AI',
    description:
      'Find remote jobs and career opportunities matched to your skills by AI. Upload your resume or build one in minutes.',
    url: 'https://jobmatch.com',
    siteName: 'JobMatch',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // add a real 1200x630 image to /public
        width: 1200,
        height: 630,
        alt: 'JobMatch — AI-powered job matching platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobMatch | Find Remote Jobs & Careers Matched by AI',
    description: 'Find remote jobs matched to your skills by AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`light ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-md overflow-x-hidden">
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}