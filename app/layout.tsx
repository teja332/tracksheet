import type { Metadata } from 'next'
import './globals.css'
import PageTransition from '@/components/page-transition'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata: Metadata = {
  title: 'TRACKSHEET – Student Performance Tracking',
  description: 'Student and staff performance tracking portal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LayoutWrapper>
          <PageTransition>{children}</PageTransition>
        </LayoutWrapper>
      </body>
    </html>
  );
}
