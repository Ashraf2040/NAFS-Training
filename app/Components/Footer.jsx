import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <footer className=" mt-10 bg-gray-100  ">
  <div className="mx-auto w-[95%] px-4  sm:px-6 lg:px-8  ">
    <div className="flex flex-col  items-center md:flex-row justify-between">
      
      <Image src="/hero-img.svg" alt='' width={100} height={50}  />
      <div className='flex justify-center bg-red-400~'>
          <Image src="/63030330.png" alt="" width={100} height={100} />
        </div>
      <p className="mt-4 text-center  text-theme lg:mt-0 lg:text-right">
        Copyright &copy; <span>{new Date().getFullYear()}</span>. All rights reserved BY <span className='font-bold text-themeYellow'>AEM.DEV.</span> 
      </p>
    </div>
  </div>
</footer>
  )
}

export default Footer
