
"use client";
import { Inter, Poppins,Whisper,Lexend } from 'next/font/google';
import './globals.css';
import { ContextProvider } from './ContextApi';
import AuthProvider from './Components/Provider';
import Navbar from './Components/Navbar';
import { Provider } from 'react-redux';
import { store } from './store';
import Footer from './Components/Footer';


const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const whisper = Whisper({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: [ '400'],
});
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: [ '400'],
});

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// };

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en" className='' >
      
      <head>
        <title>NAFS QUIZ APP</title>
      </head>

      <body className={`   ${lexend.className}   `}>
      <Provider store={store}>
        <ContextProvider>
        
      {/* <NavBar1 />   */}
      <Navbar />  
          <main className='min-h-screen h-full' >{children}</main>
         <Footer/>
        </ContextProvider>
        </Provider>
      </body>
    </html>
    </AuthProvider>
  
  );
}
