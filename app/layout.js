import './globals.css';

export const metadata = {
    title: 'DINU CHAT APP',
    description: 'A simple chat application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
