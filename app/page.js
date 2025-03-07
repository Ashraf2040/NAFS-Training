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
    <div className='relative  flex items-center justify-center' >
    
    
    <QuizzesArea />
   
     
    </div>
  );
}

