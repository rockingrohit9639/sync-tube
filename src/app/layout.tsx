import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import NextAuthProvider from '~/components/providers/next-auth-provider'
import TrpcProvider from '~/components/providers/trpc-provider'
import ThemeProvider from '~/components/providers/theme-provider'
import { Toaster } from '~/components/ui/toaster'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SyncTube',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={montserrat.className}>
        <ThemeProvider>
          <NextAuthProvider>
            <TrpcProvider>
              {children}
              <Toaster />
            </TrpcProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
