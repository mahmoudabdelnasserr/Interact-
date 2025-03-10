"use client"
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Navbar from "./_navbar/page";
import { Box } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./_redux/store";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import '@fortawesome/fontawesome-free/css/all.min.css';


const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500','600', '700']
});



// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({children} : {children : ReactNode}) {
  const path = usePathname()
  return (
    <html lang="en">
      <body style={{fontFamily: poppins.style.fontFamily}} className={path === '/register' || path === '/login' ? 'image' : ''}>
      <Provider store={store}>
      <AppRouterCacheProvider>
        <Navbar />
        <Box sx={{width: '50%', margin: 'auto', marginTop: '50px'}}>
        {children}
        <Toaster />
        </Box>
        </AppRouterCacheProvider>
      </Provider>
      </body>
    </html>
  );
}
