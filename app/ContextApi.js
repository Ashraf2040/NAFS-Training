'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { quizzesData } from './QuizzesData';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [user, setUser] = useState({});
  const [openIconBox, setOpenIconBox] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });
  const [students, setStudents] =useState([]);

  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
  const [isLoading, setLoading] = useState(true);

  const [userXP, setUserXP] = useState(0);
const { data: session } = useSession();

console.log(session?.user)
 
 
   useEffect(() => {
     // Define an async function inside useEffect
     const fetchStudents = async () => {
       try {
         // Fetch data from the API
         const response = await fetch("/api/students", {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         });
 
         // Check if the response is successful
         if (!response.ok) {
           throw new Error("Failed to fetch students");
         }
 
         // Parse the JSON data
         const data = await response.json();
 
         // Update the state with the fetched students
         setStudents(data);
       } catch (error) {
         console.error("Error fetching students:", error);
       }
     };
 
     // Call the async function
     fetchStudents();
   }, []); // Empty dependency array ensures this runs only once on mount
  

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
  useEffect(() => {

   
    // Fetch all quizzes
    const assignedQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/assignedQuiz?userId=${mappedStudent}`, {
          cache: 'no-cache',
        });

        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('fetching failed...');
        }

        const quizzAssigned = await response.json();

        setAssignedQuizzes(quizzAssigned.quizzesAssigned
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the user

    assignedQuizzes();
  }, []);

 
 

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
