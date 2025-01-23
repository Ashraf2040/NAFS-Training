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

function QuizzesArea({ props }) {
  const { allQuizzes, userObject, isLoadingObject } = useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const [students, setStudents] = useState([]);
  const [statShow, setStatShow] = useState(false);
  const [subject, setSubject] = useState(''); // No default value
  const [grade, setGrade] = useState(''); // No default value
  const [skill, setSkill] = useState(''); // No default value
  const [hoveredOutcome, setHoveredOutcome] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown open state
  const { isLoading } = isLoadingObject;
  const { data: session } = useSession();
  const skills = [
    {
      grade: "3",
      outcomes: [
        {
          subject: "English",
          outcomes: [
            "Vocabulary Acquisition and Use of Verbal Semantics",
            "Reading Comprehension",
          ],
        },
        {
          subject: "Math",
          outcomes: [
            "Numbers and operations",
            "Number sense and operations",
            "Patterns, Relationships and Functions",
            "Algebraic structures and mathematical expressions",
            "Geometric shapes",
            "Statistics and probabilities",
          ],
        },
        {
          subject: "Science",
          outcomes: [
            "Structure and function in living organisms",
            "Organization and diversity of living organisms",
            "Ecosystems and their interactions",
            "Genetics",
          ],
        },
      ],
    },
    {
      grade: "6",
      outcomes: [
        {
          subject: "English",
          outcomes: [
            "Vocabulary Acquisition and Use of Verbal Semantics",
            "Reading Comprehension",
          ],
        },
        {
          subject: "Math",
          outcomes: [
            "Numbers and operations",
            "Number sense and operations",
            "Patterns, Relationships and Functions",
            "Algebraic structures and mathematical expressions",
            "Identifying 2D and 3D geometric shapes, classifying them based on their elementsproperties and creating accurate drawings of them.",
            "Measurement and its units",
            "Calculate Probabilities",
          ],
        },
        {
          subject: "Science",
          outcomes: [
            "Life Science",
            "Matter and its interactions",
            "Motion and Forces",
            "Energy",
            "waves and vibrations",
            "Electromagnetism",
            "The universe and the solar system",
            "The Earth System",
          ],
        },
      ],
    },
    {
      grade: "9",
      outcomes: [
        {
          subject: "English",
          outcomes: [
            "Vocabulary Acquisition and Use of Verbal Semantics",
            "Reading Comprehension",
          ],
        },
        {
          subject: "Math",
          outcomes: [
            "Numbers and operations",
            "Number sense and operations",
            "Patterns, Relationships and Functions",
            "Algebraic structures and mathematical expressions",
            "Geometric shapes",
            "Measurement and its units",
            "Data analysis and interpretation",
            "Calculating probabilities",
          ],
        },
        {
          subject: "Science",
          outcomes: [
            "Structure and function in living organisms",
            "Organizing of living organisms and their diversity",
            "Genetics",
            "Matter and its interactions",
            "Motion and Forces",
            "Electromagnetism",
            "Energy",
            "Waves and vibrations",
            "The universe and the solar system",
            "Earth System",
            "Land and human activity",
          ],
        },
      ],
    },
  ];
console.log(allQuizzes)
  useEffect(() => {
    const getStudentData = async () => {
      await fetch('/api/user/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setStudents(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getStudentData();
  }, [setStudents]);

  const currentStudent = students?.find(student => student.code === session?.user?.code);

  const filterQuizzes = (quizzes, subject, grade, skill) => {
    return quizzes.filter(quiz => {
      return quiz.subject === subject && quiz.grade === grade && quiz.skill === skill;
    });
  };

  const quizzes = filterQuizzes(allQuizzes, subject, grade, skill);
  const filteredOutcomes = skills
    .find((skill) => skill.grade === grade)
    ?.outcomes.find((outcome) => outcome.subject === subject)?.outcomes || [];
console.log(quizzes)
  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoveredOutcome && !event.target.closest('.modal-content')) {
        setHoveredOutcome(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hoveredOutcome]);

  return (
    <div className="poppins mx-12 mt-10 h-full">
      <div>
        {isLoading ? (
          <div></div>
        ) : user.isLogged ? (
          <>
            <Hero />
            {allQuizzes.length === 0 ? (
              <PlaceHolder />
            ) : (
              <div className=''>
                <h1 className='text-xl font-bold flex gap-2 text-theme px-4 rounded-md py-2 max-w-fit items-center'>
                  Choose Your Quiz <span><Image src="/arrow1.svg" alt='' width={20} height={20} /></span>
                </h1>
                <DropDown />
                <div className='px-4 my-6 py-3  rounded-md font-bold text-white flex flex-col md:gap-0 gap-6   justify-between md:flex-row bg-theme'>
                  <div className='w-full md:max-w-fit text-center'>
                    <span className='mr-2'>Subject :</span>
                    <select
                      name="subject"
                      className="text-theme px-2 rounded-md"
                      onChange={(e) => setSubject(e.target.value)}
                      value={subject}
                    >
                      <option value="">Select Subject</option> {/* Placeholder option */}
                      <option value="Math">Math</option>
                      <option value="English">English</option>
                      <option value="Science">Science</option>
                    </select>
                  </div >
                  <div  className='w-full md:max-w-fit text-center'>
                    <span className='mr-2'>Grade :</span>
                    <select
                      name="grade"
                      className="text-theme px-2 rounded-md"
                      onChange={(e) => setGrade(e.target.value)}
                      value={grade}
                    >
                      <option value="">Select Grade</option> {/* Placeholder option */}
                      <option value="3">3</option>
                      <option value="6">6</option>
                      <option value="9">9</option>
                    </select>
                  </div>
                  <div className="relative w-full md:max-w-fit text-center items-center flex">
                    <button
                      className="text-white px-2 rounded-md flex items-center gap-1"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={!subject || !grade} // Disable if subject or grade is not selected
                    >
                      {skill || 'Select Outcome'} <span className="text-sm ml-2">▼</span> {/* Arrow down icon */}
                    </button>
                    {isDropdownOpen && (
                      <ul
                        className="absolute top-10 left-0 z-10 bg-themeYellow border border-gray-200 rounded-md w-48 max-h-60 overflow-y-auto shadow-lg"
                        onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown on mouse leave
                      >
                        {filteredOutcomes.map((outcome, index) => (
                          <li
                            key={index}
                            className="p-2 text-center hover:bg-theme border-b-2 border-theme cursor-pointer"
                            onClick={() => {
                              setSkill(outcome);
                              setIsDropdownOpen(false);
                            }}
                            onMouseEnter={() => setHoveredOutcome(outcome)} // Set hovered outcome
                            onMouseLeave={() => setHoveredOutcome(null)} // Clear hovered outcome
                          >
                            Domain {index + 1}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {hoveredOutcome && (
                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md modal-content">
                      <h3 className="text-lg font-bold text-theme mb-4">Outcome Details</h3>
                      <p className="text-gray-700">{hoveredOutcome}</p>
                     
                    </div>
                  </div>
                )}

              <div className='flex items-center justify-between'>
              <h2 className="text-xl font-bold flex gap-2 text-theme px-4 rounded-md py-2 max-w-fit items-center">
                  <span><Image src='/earth.svg' width={30} height={30} alt="" /></span>My Quizzes ...
                </h2>
                <button onClick={() => router.push('/quizzes-manage')} className='text-lg font-bold flex gap-2 text-theme px-4 rounded-md py-2 max-w-fit items-center'>Quizzes Management</button>
              </div>
                <div className="mt-6 flex gap-2 flex-wrap">
                  <div className="flex gap-2 flex-wrap items-center">
                    {quizzes.map((singleQuiz, quizIndex) => (
                      <div key={quizIndex} className='flex-grow md:flex-grow-0'>
                        <QuizCard singleQuiz={singleQuiz} />
                      </div>
                    ))}
                    {session && session.user.role === 'AD' && (
                      <div
                        onClick={() => router.push('/quiz-build')}
                        className="cursor-pointer justify-center items-center rounded-[10px] w-[230px] flex flex-col gap-2 border border-gray-100 bg-white p-4"
                      >
                        <Image src={'/add-quiz.png'} width={160} height={160} alt="" />
                        <span className="select-none opacity-40">Add a new Quiz</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="text-xl font-bold flex gap-2 text-theme px-4 rounded-md mt-8 py-2 max-w-fit"
                  onClick={() => setStatShow(!statShow)}
                >
                  <span><Image src={'/statistics.svg'} width={20} height={20} alt="" /></span>Statistics ...
                </button>

                {statShow && (

                  <ShowStatistics  />
                  
                )}
              </div>
            )}
          </>
        ) : (
          <div className="h-96 flex flex-col text-2xl gap-4 justify-center items-center">
            <h2 className="font-bold md:text-5xl text-themeYellow">
              <span className="text-theme">NAFS</span> Training Platform
            </h2>
            <span className="text-xl font-semibold text-center">
              Unlock Your Potential with Personalized Quizzes
            </span>
            <button
              onClick={() => {
                setUser((prevUser) => ({ ...prevUser, isLogged: true }));
              }}
              className="p-4 bg-theme text-white font-semibold rounded-md"
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