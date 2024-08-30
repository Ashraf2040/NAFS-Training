"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';   

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import   
 { clearUser, setUser } from '../reducers/userSlice';

function Navbar(props) {
  const { data: session } = useSession();
  const [myUser,setMyUser] = useState({})
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
      setMyUser(session.user)
    } else {
      dispatch(clearUser());
    }
  }, [ dispatch,session]);
 
  
      // setCurrentScore(session?.user?.score)   
     


  return (
  
      <div className="relative  md:px-8   mt-2 sm:flex sm:flex-col md:flex-row w-[95%] justify-between  text-theme   rounded-md mx-auto shadow-lg">
      
        <div className=" items-center     sm:flex-col   md:flex-row justify-between  max-h-fit">
          <Link href="/" className="flex   md:gap-1 items-center  justify-around  ">
            <Image
              src="/hero-img.svg"
              alt=""
              width={120}
              height={100}
             
            />
          
          </Link>
          
        </div>
        <div className='flex justify-center bg-red-400~'>
          <Image src="/63030330.png" alt="" width={150} height={50} />
        </div>
       
        <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
          <div className='flex items-center   flex-col md:flex-row justify-center gap-6 relative'>
            {session && (
              <div className="flex gap-2 ">
                <span className='text-[19px] text-theme font-bold'>
                   <span className=''>Welcome : {myUser?.name}</span>
                </span>
              </div>
            )}
            {session ? (
              <button
                className="block rounded-lg bg-theme px-2 py-2 text-sm font-semibold text-white transition focus:outline-none  w-4/5 md:w-fit"
                type="button"
                onClick={() => signOut()}
              >
               <button>Logout</button>
              </button>
            ) : (
              <button
                className="block rounded-lg bg-theme px-7 py-3 text-lg font-medium text-white transition focus:outline-none"
                type="button"
                onClick={() => {
                  router.push('/login');
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

  );
}

export default Navbar;
