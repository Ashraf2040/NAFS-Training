"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';   
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser } from '../reducers/userSlice';

function Navbar(props) {
  const { data: session } = useSession();
  const [myUser, setMyUser] = useState({});
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
      setMyUser(session.user);
    } else {
      dispatch(clearUser());
    }
  }, [dispatch, session]);

  return (
    <nav className="bg-white px-4 md:px-8 py-4 shadow-lg rounded-b-xl mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0 transition-transform hover:scale-105">
          <Image
            src="/hero-img.svg"
            alt="Logo"
            width={90}
            height={90}
            className="object-contain"
          />
        </Link>

        {/* User Info and Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {session && (
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-lg font-semibold text-gray-800">
                Welcome, {myUser?.name}
              </span>
            </div>
          )}
          
          {session ? (
            <button
              className="relative bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2 rounded-full text-white font-semibold text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none shadow-md"
              type="button"
              onClick={() => signOut()}
            >
              Logout
            </button>
          ) : (
            <button
              className="relative bg-gradient-to-r from-theme to-themeYellow px-8 py-3 rounded-full text-white font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none shadow-md"
              type="button"
              onClick={() => router.push('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;