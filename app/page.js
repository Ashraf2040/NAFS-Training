'use client';
import { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import QuizzesArea from './Components/QuizzesArea';
import useGlobalContextProvider from './ContextApi';

import { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { clearUser, setUser } from './reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Hero from './Components/Hero';

export default function Home() {
  const { data: session } = useSession();
  const { quizToStartObject, selectedQuizObject } = useGlobalContextProvider();
  const { user } = useSelector((state) => state.user);
  const { setSelectQuizToStart } = quizToStartObject;
  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
  const [myUser,setMyUser] = useState({})
  const dispatch = useDispatch();
  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
      setMyUser(session.user)
    } else {
      dispatch(clearUser());
    }
  }, [ dispatch,session]);

  useEffect(() => {
    setSelectQuizToStart(null);
    // set the selectedQuiz back to null
    setSelectedQuiz(null);
  }, [setSelectQuizToStart, setSelectedQuiz]);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setOpenMenu(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function once initially to set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleModeChange = (event) => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className='relative' >
    
    
    <QuizzesArea />
    <div>
    {/* {session && (
              <span className='h-fit py-2 font-bold text-themeYellow flex items-center justify-center px-4 rounded-full  text-lg bg-theme absolute top-3 right-4  '>
                Score : <span className='ml-2 text-themeYellow'>{user?.score}</span>
              </span>
            )} */}
          </div>
     
    </div>
  );
}

// function Sidebar() {
//   const [openMenu, setOpenMenu] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setOpenMenu(false);
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize(); // Call the function once initially to set initial state

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   return (
//     <div className="bg-red-200 w-full flex flex-row px-5 justify-between md:flex-col md:px-0 md:w-3/12 ">
//       {/* Logo */}
//       <div className="bg-white p-3 border border-gray-300">Logo</div>
//       {/* Menu */}
//       <ul
//         className={`bg-white ${
//           openMenu
//             ? 'flex flex-col absolute w-full h-1/2 top-14 left-0'
//             : 'hidden'
//         } p-3 md:flex md:flex-col gap-2 h-full border border-gray-300`}
//       >
//         <span>Home</span>
//         <span>Blog</span>
//         <span>Contact US</span>
//       </ul>
//       <button
//         onClick={() => setOpenMenu((current) => !current)}
//         className="md:hidden"
//       >
//         ...
//       </button>
//     </div>
//   );
// }

// function Dashboard() {
//   return (
//     <div className="bg-yellow-300 h-full  md:w-9/12 p-4 flex flex-col gap-3  ">
//       <div className="border border-gray-300">
//         <span className="font-bold text-2xl">Hi Ali</span>
//       </div>
//       {/* Projects */}
//       <div className="border border-gray-300 flex flex-col gap-2 md:flex-row">
//         <div className="text-buttons w-full md:w-1/2">Project 1</div>
//         <div className="bg-red-500 w-full md:w-1/2">Project 2</div>
//       </div>
//     </div>
//   );
// }
