import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Warung Warga',
  description: 'Platform jual beli dan borongan bareng untuk warga sekitar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-text-primary`}>
        {children}
      </body>
    </html>
  )
} 