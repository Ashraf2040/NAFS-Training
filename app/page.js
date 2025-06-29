'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from './reducers/userSlice';
import useGlobalContextProvider from './ContextApi';
import Navbar from './Components/Navbar';
import AdminQuizzesArea from './Components/AdminQuizzesArea';
import StudentQuizzesArea from './Components/StudentQuizzesArea';

export default function Home() {
  const { data: session } = useSession();
  const { quizToStartObject, selectedQuizObject } = useGlobalContextProvider();
  const { user } = useSelector((state) => state.user);
  const { setSelectQuizToStart } = quizToStartObject;
  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;
  const [myUser, setMyUser] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      dispatch(setUser(session.user));
      setMyUser(session.user);
      // Redirect based on role
      if (session.user.role === 'AD') {
        router.push('/admin');
      } else if (session.user.role === 'ST') {
        router.push('/student');
      }
    } else {
      dispatch(clearUser());
    }
  }, [dispatch, session, router]);

  useEffect(() => {
    setSelectQuizToStart(null);
    setSelectedQuiz(null);
  }, [setSelectQuizToStart, setSelectedQuiz]);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setOpenMenu(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleModeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative flex items-center justify-center">
      <Toaster />
      {session?.user.role === 'AD' ? (
        <AdminQuizzesArea />
      ) : session?.user.role === 'ST' ? (
        <StudentQuizzesArea />
      ) : null}
    </div>
  );
}