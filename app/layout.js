'use client';
import "@/app/globals.css";





function RootLayout({ children }) {   
    return (
        <html lang="en">
            <head />
            <body>
                
                {children}
            </body>
            </html>
    );
}

export default RootLayout;
