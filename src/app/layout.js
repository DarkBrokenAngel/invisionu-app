import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import CursorTrail from '@/components/CursorTrail';

export const metadata = {
  title: 'inVision U — AI-Powered Candidate Screening Platform',
  description: 'Revolutionary AI-driven admissions platform for inVision U. Evaluate motivation, experience, skills, and potential of applicants with intelligent screening.',
  keywords: 'inVision U, AI admissions, candidate screening, university, education, scholarship, Kazakhstan',
  openGraph: {
    title: 'inVision U — Shape Your Future',
    description: 'AI-powered admissions platform that discovers true potential.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <CursorTrail />
          <div className="grid-bg" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
