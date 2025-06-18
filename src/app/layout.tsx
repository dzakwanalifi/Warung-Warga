import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Warung Warga - Solusi Belanja Hyperlocal',
  description: 'Platform untuk membeli produk lokal dan berpartisipasi dalam pembelian kolektif di komunitas Anda',
  keywords: ['warung', 'lokal', 'komunitas', 'belanja', 'group buying', 'hyperlocal'],
  authors: [{ name: 'Warung Warga Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-background text-text-primary antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
} 