'use client';
import "@/app/globals.css";

function RootLayout({ children }) {   
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}

export default RootLayout;
