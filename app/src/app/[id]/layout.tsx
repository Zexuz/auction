export const metadata = {
    title: 'wagmi',
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <section>
            {children}
        </section>
    )
}


