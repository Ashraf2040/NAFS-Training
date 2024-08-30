"use client"

import Image from 'next/image'
import '../../app/globals.css'
import React, { useCallback, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { Galada } from 'next/font/google';



const galada = Galada({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: [ '400'],
});
const Certificate = ({setIsPreview}) => {

  const {user}= useSelector(state=>state.user)
  const {data:session}= useSession()

  const certificateRef = useRef(null)
  const onButtonClick = useCallback(() => {
    if (certificateRef.current === null) {
      return
    }

    toPng(certificateRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'certificate.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [certificateRef])
  const handlePrint = () => {
    // Capture the current page content
    const originalContent = document.body.innerHTML;

    // Hide all content except the certificate element
    const certificateElement = certificateRef.current;
    document.body.innerHTML = certificateElement.outerHTML;

    // Trigger browser's print dialog
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;
  };
  return (
   
      <div className=' flex items-center justify-center rounded-md gap-10    w-full top-[-70px] absolute h-[500px]'>
         <button onClick={()=>setIsPreview(false)} className='w-6 h-6 bg-white text-theme font-semibold rounded-full absolute top-2 right-4 z-40'>X</button>
        <div className=' w-full      h-full   flex justify-center items-center ' ref={certificateRef}>
        <Image src="/certificate1.png" alt="certificate"  className=' rounded-md' fill/>
        
        <div className=' relative z-20  w-[82%] h-[50%] mt-[124px] flex pt-8 items-center flex-col '>
        <h1 className={`${galada.className} md:text-3xl lg:text-5xl sm:text-2xl font-bold mb-4 text-theme  `}>{session?.user?.name}</h1>
        <p className='text-xl text-center  font-semibold'>For completing the qualifying training for <span className='text-theme font-bold'>NAFS</span>  National Tests.</p>

        <p className=' font-bold text-xl'>Score : <span className='text-theme text-xl'>{user?.score}</span> </p>
        <div className='  absolute bottom-4 flex justify-between items-center w-[90%]  '>
   <h2 className='  max-w-fit   border-t-2 border-slate-600  font-bold text-[14px]    '>XXXXXXXXX</h2>
        <h2 className=' font-bold  text-[14px]   
         max-w-fit   border-t-2 border-slate-600'>XXXXXXXXXX</h2></div>
        </div>
        </div>
     <div className='flex justify-center gap-4 items-center absolute right-0 -bottom-20 '>
     <button onClick={onButtonClick} className='block  cursor-pointer bg-theme text-white px-4 py-2 rounded-md  font-bold text-lg'>Save</button>
     {/* <button onClick={handlePrint} className='cursor-pointer bg-theme px-4 py-2 rounded-md  font-bold text-lg text-white'>Print</button> */}
     </div> 
        
    </div>
  )
}

export default Certificate
