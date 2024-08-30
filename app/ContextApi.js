'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { quizzesData } from './QuizzesData';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [user, setUser] = useState({});
  const [openIconBox, setOpenIconBox] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });

  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(true);

  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    // Fetch all quizzes
    const fetchAllQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quizzes', {
          cache: 'no-cache',
        });

        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('fetching failed...');
        }

        const quizzesData = await response.json();

        setAllQuizzes(quizzesData.quizzes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the user

    fetchAllQuizzes();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/api/user', {
  //         method: 'POST',
  //         headers: {
  //           'Content-type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           name: 'Abdulsalam',
  //           isLogged: false,
  //           experience: 0,
  //         }),
  //       });

  //       if (!response.ok) {
  //         toast.error('Something went wrong...');
  //         throw new Error('fetching failed...');
  //       }

  //       const userData = await response.json();
  //       console.log(userData);

  //       if (userData.message === 'User already exists') {
  //         // If user already exists, update the user state with the returned user
  //         setUser(userData.user);
  //       } else {
  //         // If user doesn't exist, set the newly created user state
  //         setUser(userData.user);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  // useEffect(() => {
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     experience: userXP,
  //   }));
  // }, [userXP]);

  useEffect(() => {
    if (selectedQuiz) {
      setSelectedIcon({ faIcon: selectedQuiz.icon });
    } else {
      setSelectedIcon({ faIcon: faQuestion });
    }
  }, [selectedQuiz]);

  return (
    <GlobalContext.Provider
      value={{
        allQuizzes,
        setAllQuizzes,
        quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
        userObject: { user, setUser },
        openBoxToggle: { openIconBox, setOpenIconBox },
        selectedIconObject: { selectedIcon, setSelectedIcon },
        dropDownToggleObject: { dropDownToggle, setDropDownToggle },
        threeDotsPositionsObject: { threeDotsPositions, setThreeDotsPositions },
        selectedQuizObject: { selectedQuiz, setSelectedQuiz },
        userXpObject: { userXP, setUserXP },
        isLoadingObject: { isLoading, setLoading },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function useGlobalContextProvider() {
  return useContext(GlobalContext);
}
