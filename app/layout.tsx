import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cognex Key Generator',
  description: 'Generate Cognex offline program keys from program references',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
