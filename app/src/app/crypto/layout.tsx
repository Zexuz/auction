import {Providers} from './providers'
import ResponsiveAppBar from "@/components/NavBar";

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
        <Providers>
            <ResponsiveAppBar/>
            {children}
        </Providers>
        </body>
        </html>
    )
}


