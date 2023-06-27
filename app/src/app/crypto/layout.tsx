import {Providers} from './providers'

export const metadata = {
  title: 'wagmi',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en">
    <body>
    <Providers>{children}</Providers>
    </body>
    </html>
  )
}
