import React, { useEffect, useState, useRef } from 'react';
import QuizCard from './QuizCard';
import PlaceHolder from './PlaceHolder';
import useGlobalContextProvider from '../ContextApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropDown from './DropDown';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Hero from './Hero';
import ShowStatistics from './ShowStatistics';
import { skillsData } from '../../lib/skillsData';
import toast, { Toaster } from 'react-hot-toast';

function QuizzesArea({ props }) {
  const { allQuizzes, userObject, isLoadingObject } = useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const [students, setStudents] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [statShow, setStatShow] = useState(false);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [skill, setSkill] = useState('');
  const [hoveredOutcome, setHoveredOutcome] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoading } = isLoadingObject;
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const getStudentData = async () => {
      await fetch('/api/user/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => setStudents(data))
        .catch((error) => console.error(error));
    };
    getStudentData();
  }, [setStudents]);
 console.log(students)
 console.log('Session:', session);
  const mappedStudent = students?.filter((student) => student.code === session?.user.code);
console.log(mappedStudent)
  useEffect(() => {
    const assignedQuizzes = async () => {
      try {
        const response = await fetch(`/api/assignedQuiz?userId=${mappedStudent[0]?.id}`, {
          cache: 'no-cache',
        });
        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('fetching failed...');
        }
        const quizzAssigned = await response.json();
        setAssignedQuizzes(quizzAssigned.quizzesAssigned);
      } catch (error) {
        console.log(error);
      }
    };
    assignedQuizzes();
  }, [mappedStudent]);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      if (!mappedStudent[0]?.id) return;
      try {
        const response = await fetch(`/api/getUserQuizzes?userId=${mappedStudent[0]?.id}`, {
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Failed to fetch user quizzes');
        const { userQuizzes } = await response.json();
        setUserQuizzes(userQuizzes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserQuizzes();
  }, [mappedStudent[0]?.id]);

  const filterQuizzes = (quizzes, subject, grade, skill) => {
    return quizzes.filter(quiz => quiz.subject === subject && quiz.grade === grade && quiz.skill === skill);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) return words.slice(0, wordLimit).join(" ") + " ...";
    return text;
  };

  const quizzes = filterQuizzes(allQuizzes, subject, grade, skill);
  const filteredOutcomes = skillsData
    .find((skill) => skill.grade === grade)
    ?.outcomes.find((outcome) => outcome.subject === subject)?.outcomes || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoveredOutcome && !event.target.closest('.modal-content')) setHoveredOutcome(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hoveredOutcome]);

  const populateQuizzes = () => {
    if (session && session.user.role === 'AD') return quizzes;
    else return assignedQuizzes?.quiz;
  };

  const quizzesToRender = populateQuizzes();

  const assignQuizToGrade = async (quizId) => {
    if (!grade) {
      alert("Please select a grade first.");
      return;
    }
    try {
      const response = await fetch('/api/assign-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, grade }),
      });
      const data = await response.json();
      if (response.ok) alert("Quiz assigned successfully!");
      else alert(data.message || "Failed to assign quiz.");
    } catch (error) {
      console.error("Error assigning quiz:", error);
      alert("An error occurred while assigning the quiz.");
    }
  };

  const subjectBoxes = [
    { name: "Science", icon: "/science-icon.svg" },
    { name: "Math", icon: "/math-icon.svg" },
    { name: "English", icon: "/english-icon.svg" },
  ];

  return (
    <div className="poppins mx-8 my-6 max-w-7xl md:min-w-[800px] shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-theme to-themeYellow p-6">
        <h1 className="text-3xl text-white font-bold text-center">
          {user.isLogged ? 'Your Quiz Dashboard' : 'NAFS Training Platform'}
        </h1>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : user.isLogged ? (
          <>
            <Hero role={session?.user.role} />
            {allQuizzes.length === 0 ? (
              <PlaceHolder />
            ) : (
              <div>
                {/* Filters for Admin */}
                {session?.user.role === 'AD' && (
                  <div className="mb-6">
                    <h2 className="text-2xl text-theme font-semibold mb-4">Filter Quizzes</h2>
                    <div className="flex flex-col sm:flex-row gap-4 bg-gray-100 p-4 rounded-lg">
                      <div className="flex-1">
                        <label className="text-theme font-medium">Subject:</label>
                        <select
                          name="subject"
                          className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent"
                          onChange={(e) => setSubject(e.target.value)}
                          value={subject}
                        >
                          <option value="">Select Subject</option>
                          <option value="Math">Math</option>
                          <option value="English">English</option>
                          <option value="Science">Science</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-theme font-medium">Grade:</label>
                        <select
                          name="grade"
                          className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent"
                          onChange={(e) => setGrade(e.target.value)}
                          value={grade}
                        >
                          <option value="">Select Grade</option>
                          <option value="3">3</option>
                          <option value="6">6</option>
                          <option value="9">9</option>
                        </select>
                      </div>
                      <div className="flex-1 relative">
                        <label className="text-theme font-medium">Skill:</label>
                        <button
                          className="mt-1 w-full p-2 bg-white border border-gray-300 rounded-md text-left text-gray-700 flex justify-between items-center"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          disabled={!subject || !grade}
                        >
                          {skill === '' ? 'Select Skill' : truncateText(skill, 5)}
                          <span>▼</span>
                        </button>
                        {isDropdownOpen && (
                          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-lg">
                            {filteredOutcomes.map((outcome, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-theme hover:text-white cursor-pointer"
                                onClick={() => {
                                  setSkill(outcome);
                                  setIsDropdownOpen(false);
                                }}
                                onMouseEnter={() => setHoveredOutcome(outcome)}
                                onMouseLeave={() => setHoveredOutcome(null)}
                              >
                                Outcome {index + 1}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    {hoveredOutcome && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md modal-content">
                          <h3 className="text-lg font-bold text-theme mb-4">Outcome Details</h3>
                          <p className="text-gray-700">{hoveredOutcome}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Subject Selection for Students */}
                {session?.user.role === 'ST' && !selectedSubject && (
                  <div className="mb-6 ">
                    <h2 className="text-2xl text-theme font-semibold mb-4">Choose Your Subject</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {subjectBoxes.map((box, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedSubject(box.name)}
                          className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 bg-theme rounded-lg shadow-md hover:bg-themeYellow hover:text-black text-white transition-all duration-300"
                        >
                          {/* <Image src={box.icon} width={60} height={60} alt={box.name} /> */}
                          <span className="mt-2 text-lg font-semibold">{box.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quizzes Section */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl text-theme font-semibold flex items-center gap-2">
                    <Image src="/earth.svg" width={24} height={24} alt="" />
                    My Quizzes
                  </h2>
                  {session?.user.role === 'AD' && (
                    <button
                      onClick={() => router.push('/quizzes-manage')}
                      className="text-white bg-gradient-to-r from-amber-500 to-orange-600 font-semibold hover:underline px-6 py-2 rounded-full flex items-center gap-2"
                    >
                      Quizzes Management
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {session?.user.role === 'ST' && selectedSubject ? (
                    <>
                      {assignedQuizzes?.length > 0 ? (
                        assignedQuizzes
                          .filter((singleQuiz) => singleQuiz.quiz.subject === selectedSubject)
                          .map((singleQuiz, quizIndex) => (
                            <QuizCard
                              key={quizIndex}
                              singleQuiz={singleQuiz.quiz}
                              assignQuizToGrade={assignQuizToGrade}
                              role={session.user.role}
                              assignedQuizzes={assignedQuizzes}
                              userQuizzes={userQuizzes}
                            />
                          ))
                      ) : (
                        <p className="text-gray-600">No quizzes assigned for {selectedSubject}.</p>
                      )}
                      <button
                        onClick={() => setSelectedSubject(null)}
                        className="text-theme font-semibold underline mt-4"
                      >
                        Back to Subjects
                      </button>
                    </>
                  ) : (
                    session?.user.role === 'AD' && (
                      <>
                        {quizzes.map((singleQuiz, quizIndex) => (
                          <QuizCard
                            key={quizIndex}
                            singleQuiz={singleQuiz}
                            hoveredOutcome={hoveredOutcome}
                            assignQuizToGrade={assignQuizToGrade}
                            role={session.user.role}
                          />
                        ))}
                        <div
                          onClick={() => router.push('/quiz-build')}
                          className="cursor-pointer flex flex-col items-center justify-center w-56 h-56 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          <Image src="/add-quiz.png" width={120} height={120} alt="" />
                          <span className="mt-2 text-gray-500">Add a New Quiz</span>
                        </div>
                      </>
                    )
                  )}
                </div>

                {/* Statistics Button */}
                {session?.user.role === 'AD' && (
                  <button
                    className="mt-6 text-theme font-semibold flex items-center gap-2 hover:underline"
                    onClick={() => setStatShow(!statShow)}
                  >
                    <Image src="/statistics.svg" width={20} height={20} alt="" />
                    {statShow ? 'Hide Statistics' : 'Show Statistics'}
                  </button>
                )}
                {statShow && <ShowStatistics />}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-4xl font-bold text-themeYellow mb-4">
              <span className="text-theme">NAFS</span> Training Platform
            </h2>
            <p className="text-lg text-gray-600 mb-6">Unlock Your Potential with Personalized Quizzes</p>
            <button
              onClick={() => setUser((prevUser) => ({ ...prevUser, isLogged: true }))}
              className="px-6 py-3 bg-gradient-to-r from-theme to-themeYellow text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all"
            >
              Get Started Now!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizzesArea;