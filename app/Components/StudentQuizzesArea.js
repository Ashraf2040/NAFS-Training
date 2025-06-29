import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContextProvider from '../ContextApi';
import QuizHeader from './QuizHeader';
import SubjectSelector from './SubjectSelector';
import QuizList from './QuizList';
import Hero from './Hero';

function StudentQuizzesArea() {
  const { allQuizzes, userObject, isLoadingObject } = useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const { isLoading } = isLoadingObject;
  const { data: session, status } = useSession();
  const [students, setStudents] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeDomain, setActiveDomain] = useState('NAFS Mastering');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const getStudentData = async () => {
      try {
        const response = await fetch('/api/user/getUsers', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setStudents(data);
        console.log('Fetched students:', data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load student data');
      }
    };
    getStudentData();
  }, []);

  const mappedStudent = useMemo(() => {
    if (!session?.user.code || !students.length) {
      console.log('Session code or students missing:', { code: session?.user.code, studentsLength: students.length });
      return [];
    }
    const filtered = students.filter((student) => student.code === session.user.code);
    console.log('Mapped student:', filtered);
    return filtered;
  }, [students, session?.user.code]);

  useEffect(() => {
    if (!mappedStudent[0]?.id) {
      console.log('No mapped student ID found:', mappedStudent);
      return;
    }

    const fetchAssignedQuizzes = async () => {
      try {
        const response = await fetch(`/api/assignedQuiz?userId=${mappedStudent[0].id}`, {
          cache: 'no-cache',
        });
        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('Failed to fetch assigned quizzes');
        }
        const data = await response.json();
        setAssignedQuizzes(data.quizzesAssigned || []);
        console.log('Assigned quizzes response:', data);
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
        toast.error('Failed to load assigned quizzes');
      }
    };

    fetchAssignedQuizzes();
  }, [mappedStudent]);

  useEffect(() => {
    if (!session?.user.code) {
      console.log('No user code found for quiz stats:', session?.user);
      return;
    }

    const fetchUserQuizStats = async () => {
      try {
        // Using a route similar to the admin route to fetch quiz stats with quizTitle
        const response = await fetch(`/api/students/${session.user.code}/quiz-stats`, {
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Failed to fetch user quiz stats');
        const data = await response.json();
        setUserQuizzes(data || []);
        console.log('User quiz stats response:', data);
      } catch (error) {
        console.error('Error fetching user quiz stats:', error);
        toast.error('Failed to load quiz history');
      }
    };

    fetchUserQuizStats();
  }, [session?.user.code]);

  const changeTHeDomain = (domain) => {
    setActiveDomain(domain);
    console.log('Active domain changed to:', domain);
  };

  // Helper to extract quizzes from assignedQuizzes
  const quizzesToDisplay = useMemo(() => {
    if (Array.isArray(assignedQuizzes)) {
      return assignedQuizzes;
    } else if (assignedQuizzes.quiz && Array.isArray(assignedQuizzes.quiz)) {
      return assignedQuizzes.quiz;
    }
    return [];
  }, [assignedQuizzes]);

  // Toggle statistics visibility
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Determine user's grade from mappedStudent (assuming grade is a field in student data)
  const userGrade = mappedStudent[0]?.grade || 0; // Fallback to 0 if grade is not available
  const isGrade12 = userGrade === 12;

  // Define domain boxes based on grade
  const domains = [
    {
      name: 'NAFS Mastering',
      description: 'Explore your assigned NAFS quizzes',
      delay: 1,
      show: true, // Always show NAFS
    },
    {
      name: 'SAT Mastering',
      description: 'Check for SAT preparation quizzes',
      delay: 2,
      show: isGrade12,
    },
    {
      name: 'GAT Mastering',
      description: 'View your GAT assigned quizzes',
      delay: 3,
      show: isGrade12,
    },
  ];

  return (
    <div className="mx-4 sm:mx-8 my-6 min-h-screen rounded-2xl overflow-hidden text-[#1f6f78] font-poppins">
      <Toaster />
      <div className="p-4 sm:p-6">
        {status === 'loading' || isLoading ? (
          <div className="text-center text-[#1f6f78] text-lg font-medium animate-pulse">Loading...</div>
        ) : user.isLogged ? (
          <>
            <Hero role={session?.user.role} changeTHeDomain={changeTHeDomain} />
            {!selectedSubject && <SubjectSelector setSelectedSubject={setSelectedSubject} />}
            <div className="space-y-4">
              {domains
                .filter((domain) => domain.show)
                .map((domain) => (
                  <React.Fragment key={domain.name}>
                    <div
                      className={`cursor-pointer p-6 my-3 rounded-xl bg-theme hover:bg-[#1f6f78]/30 active:bg-[#1f6f78]/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        activeDomain === domain.name ? 'bg-[#1f6f78] border-2 border-[#F5A053]/50' : ''
                      } animate-fade-in-up`}
                      style={{ animationDelay: `calc(${domain.delay} * 200ms)` }}
                      onClick={() => changeTHeDomain(domain.name)}
                    >
                      <h2 className="text-xl font-semibold text-[#F5A053]">{domain.name}</h2>
                    </div>
                    {activeDomain === domain.name && (
                      <div className="bg-white/95 p-6 rounded-xl mt-4 shadow-md w-full animate-fade-in">
                        {domain.name === 'NAFS Mastering' ? (
                          quizzesToDisplay.length > 0 ? (
                            <QuizList
                              quizzes={quizzesToDisplay}
                              session={session}
                              selectedSubject={selectedSubject}
                              setSelectedSubject={setSelectedSubject}
                              userQuizzes={userQuizzes}
                              router={router}
                              allQuizzes={allQuizzes}
                            />
                          ) : (
                            <h1 className="text-center text-[#F5A053] font-semibold">No NAFS Quizzes assigned yet.</h1>
                          )
                        ) : domain.name === 'SAT Mastering' ? (
                          <h1 className="text-center text-[#F5A053] font-semibold">No SAT Quizzes available</h1>
                        ) : (
                          <h1 className="text-center text-[#F5A053] font-semibold">No GAT Quizzes have been assigned</h1>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </div>
            <button
              className="flex items-center gap-2 bg-[#1f6f78] text-[#F5A053] px-6 py-3 rounded-md font-semibold transition-all duration-300 mt-6 hover:bg-[#1f6f78]/80 hover:shadow-lg"
              onClick={toggleStats}
            >
              <img src="/statistics.svg" width={20} height={20} alt="Stats Icon" />
              {showStats ? 'Hide Statistics & History' : 'Show Statistics & History'}
            </button>
            {showStats && (
              <div className="mt-8 bg-white/95 p-6 rounded-xl shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-[#F5A053] mb-4">Your Quiz Statistics</h2>
                {userQuizzes.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-[#1f6f78]">Total Quizzes Taken</h3>
                        <p className="text-2xl font-bold text-[#F5A053]">{userQuizzes.length}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-[#1f6f78]">Average Score</h3>
                        <p className="text-2xl font-bold text-[#F5A053]">
                          {Math.round(
                            userQuizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / userQuizzes.length
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-[#1f6f78]">Completion Rate</h3>
                        <p className="text-2xl font-bold text-[#F5A053]">
                          {Math.round((userQuizzes.length / (quizzesToDisplay.length || 1)) * 100)}%
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#F5A053] mb-3">Quiz History</h3>
                    <div className="border-t border-[#1f6f78]/20">
                      {userQuizzes.map((quiz, index) => (
                        <div key={index} className="py-4 border-b border-[#1f6f78]/10 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-[#1f6f78]">
                              {quiz.quizTitle || 'Untitled Quiz'}
                            </p>
                            <p className="text-sm text-[#1f6f78]/60">
                              Taken on: {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#F5A053]">Score: {quiz.score || 0}</p>
                            <p className="text-sm text-[#1f6f78]/60">
                              Status: {quiz.completed ? 'Completed' : 'Incomplete'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[#1f6f78]/60">No quiz history or statistics available yet.</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-4xl font-bold text-[#1f6f78] mb-4">
              <span className="text-[#F5A053]">NAFS</span> Training Platform
            </h2>
            <p className="text-lg text-[#1f6f78]/80 mb-6">Unlock Your Potential with Personalized Quizzes</p>
            <button
              onClick={() => setUser((prevUser) => ({ ...prevUser, isLogged: true }))}
              className="px-6 py-3 bg-gradient-to-r from-[#1f6f78] to-[#F5A053] text-white font-semibold rounded-md shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Now!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentQuizzesArea;
