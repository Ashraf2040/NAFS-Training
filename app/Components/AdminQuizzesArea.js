import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import useGlobalContextProvider from '../ContextApi';
import QuizHeader from './QuizHeader';
import QuizFilter from './QuizFilter';
import QuizList from './QuizList';
import SatQuizGenerator from './SatQuizGenerator';
import Modal from './Modal';
import Hero from './Hero';
import ShowStatistics from './ShowStatistics';
import { skillsData } from '../../lib/skillsData';

function AdminQuizzesArea() {
  const { allQuizzes, userObject, isLoadingObject } = useGlobalContextProvider();
  const router = useRouter();
  const { user, setUser } = userObject;
  const { isLoading } = isLoadingObject;
  const { data: session, status } = useSession();
  const [students, setStudents] = useState([]);
  const [assignedQuizzes, setAssignedQuizzes] = useState([]);
  const [statShow, setStatShow] = useState(false);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [skill, setSkill] = useState('');
  const [hoveredOutcome, setHoveredOutcome] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeDomain, setActiveDomain] = useState('NAFS Mastering');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [uploadedQuizFile, setUploadedQuizFile] = useState(null);

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
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    getStudentData();
  }, []);

  const standards = {
    Chemistry: ['NGSS HS highschool-PS1-1', 'NGSS HS-PS1-2', 'AP Chemistry Unit 1'],
    Math: ['Common Core Algebra I', 'Common Core Geometry', 'AP Calculus AB'],
    English: ['Common Core ELA 9-10', 'Common Core ELA 11-12', 'AP English Literature'],
  };

  const mappedStudent = useMemo(() => {
    if (!session?.user.code || !students.length) return [];
    return students.filter((student) => student.code === session.user.code);
  }, [students, session?.user.code]);

  useEffect(() => {
    if (!mappedStudent[0]?.id) return;

    const fetchAssignedQuizzes = async () => {
      try {
        const response = await fetch(`/api/assignedQuiz?userId=${mappedStudent[0].id}`, {
          cache: 'no-cache',
        });
        if (!response.ok) {
          toast.error('Something went wrong...');
          throw new Error('Failed to fetch assigned quizzes');
        }
        const { quizzesAssigned } = await response.json();
        setAssignedQuizzes(quizzesAssigned);
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error);
      }
    };

    fetchAssignedQuizzes();
  }, [mappedStudent]);

  useEffect(() => {
    if (!mappedStudent[0]?.id) return;

    const fetchUserQuizzes = async () => {
      try {
        const response = await fetch(`/api/getUserQuizzes?userId=${mappedStudent[0].id}`, {
          cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Failed to fetch user quizzes');
        const { userQuizzes } = await response.json();
        setUserQuizzes(userQuizzes);
      } catch (error) {
        console.error('Error fetching user quizzes:', error);
      }
    };

    fetchUserQuizzes();
  }, [mappedStudent[0]?.id]);

  const handleGenerateQuiz = async () => {
    if (!selectedSubject || !selectedStandard || !uploadedFile) {
      alert('Please select a subject, standard, and upload a file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('subject', selectedSubject);
      formData.append('standard', selectedStandard);

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const quizData = await response.json();
      setGeneratedQuiz(quizData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert(`Failed to generate quiz: ${error.message}`);
    }
  };

  const filterQuizzes = (quizzes, subject, grade, skill) => {
    return quizzes.filter(quiz => quiz.subject === subject && quiz.grade === grade && quiz.skill === skill);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) return words.slice(0, wordLimit).join(' ') + ' ...';
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

  const assignQuizToGrade = async (quizId) => {
    if (!grade) {
      alert('Please select a grade first.');
      return;
    }
    try {
      const response = await fetch('/api/assign-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, grade }),
      });
      const data = await response.json();
      if (response.ok) alert('Quiz assigned successfully!');
      else alert(data.message || 'Failed to assign quiz.');
    } catch (error) {
      console.error('Error assigning quiz:', error);
      alert('An error occurred while assigning the quiz.');
    }
  };

  const changeTHeDomain = (domain) => {
    setActiveDomain(domain);
  };

  const handlePreview = () => {
    console.log('Previewing Quiz:', generatedQuiz);
    alert('Preview functionality to be implemented. Check console for quiz data.');
  };

  const handleDownload = async () => {
    try {
      setIsLoadingAction(true);
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('subject', selectedSubject);
      formData.append('standard', selectedStandard);

      const response = await fetch('/api/generate-quiz-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download quiz CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'generated_quiz.csv';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Quiz CSV downloaded successfully!');
    } catch (error) {
      console.error('Error downloading quiz:', error);
      alert(`Failed to download quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDirectImport = async () => {
    if (!uploadedQuizFile) {
      alert('Please upload a quiz file to import.');
      return;
    }
    if (!selectedSubject) {
      alert('Please select a subject before importing a quiz.');
      return;
    }

    try {
      setIsLoadingAction(true);
      const formData = new FormData();
      formData.append('file', uploadedQuizFile);
      formData.append('subject', selectedSubject);
      formData.append('skill', selectedStandard || '');

      const response = await fetch('/api/quizzes/import-sat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import SAT quiz');
      }

      const result = await response.json();
      alert(`SAT Quiz imported successfully! ${result.message}`);
    } catch (error) {
      console.error('Error importing SAT quiz directly:', error);
      alert(`Failed to import SAT quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleImport = async () => {
    if (!generatedQuiz) {
      alert('No generated quiz data available to import.');
      return;
    }
    if (!selectedSubject) {
      alert('Please select a subject before importing a quiz.');
      return;
    }

    try {
      setIsLoadingAction(true);
      const csvContent = convertQuizDataToCSV(generatedQuiz);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'generated-quiz.csv', { type: 'text/csv' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', selectedSubject);
      formData.append('skill', selectedStandard || '');

      const response = await fetch('/api/quizzes/import-sat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import generated SAT quiz');
      }

      const result = await response.json();
      alert(`Generated SAT Quiz imported successfully! ${result.message}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error importing generated SAT quiz:', error);
      alert(`Failed to import generated SAT quiz: ${error.message}`);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const convertQuizDataToCSV = (quizData) => {
    console.log('Generated Quiz Data for Conversion:', quizData);
    if (!quizData) {
      throw new Error('Quiz data is null or undefined');
    }

    let questions = [];
    let quizId = `generated-quiz-${Date.now()}`;
    let quizTitle = 'Generated SAT Quiz';

    if (Array.isArray(quizData)) {
      questions = quizData;
    } else if (quizData.quizQuestions && Array.isArray(quizData.quizQuestions)) {
      questions = quizData.quizQuestions;
      quizId = quizData.id || quizId;
      quizTitle = quizData.quizTitle || quizTitle;
    } else if (quizData.questions && Array.isArray(quizData.questions)) {
      questions = quizData.questions;
      quizId = quizData.id || quizId;
      quizTitle = quizData.quizTitle || quizTitle;
    } else {
      throw new Error('Invalid quiz data format for CSV conversion: No questions array found');
    }

    if (questions.length === 0) {
      throw new Error('No questions found in quiz data');
    }

    const headers = [
      'quizId',
      'quizTitle',
      'questionId',
      'mainQuestion',
      'choices',
      'correctAnswer',
      'answeredResult',
      'totalAttempts',
      'correctAttempts',
      'incorrectAttempts',
    ];

    const rows = questions.map((question, index) => {
      return [
        quizId,
        quizTitle,
        question.id || `q-${index}-${Date.now()}`,
        question.mainQuestion || question.question || '',
        question.choices ? (Array.isArray(question.choices) ? question.choices.join('|') : question.choices) : '',
        question.correctAnswer !== undefined ? question.correctAnswer : 0,
        question.answeredResult !== undefined ? question.answeredResult : 0,
        question.statistics?.totalAttempts || question.totalAttempts || 0,
        question.statistics?.correctAttempts || question.correctAttempts || 0,
        question.statistics?.incorrectAttempts || question.incorrectAttempts || 0,
      ];
    });

    const csvRows = [headers, ...rows].map(row => row.join(','));
    return csvRows.join('\n');
  };

  return (
    <div className="poppins mx-8 my-6  md:min-w-[800px]  rounded-lg overflow-hidden">
      <Toaster />
      {/* <QuizHeader user={user} /> */}
      <div className="p-6">
        {status === 'loading' || isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : user.isLogged ? (
          <>
            <Hero role={session?.user.role} changeTHeDomain={changeTHeDomain} />
            <div className={`${activeDomain === 'NAFS Mastering' ? 'block' : 'hidden'}`}>
              <QuizFilter
                subject={subject}
                setSubject={setSubject}
                grade={grade}
                setGrade={setGrade}
                skill={skill}
                setSkill={setSkill}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                filteredOutcomes={filteredOutcomes}
                hoveredOutcome={hoveredOutcome}
                setHoveredOutcome={setHoveredOutcome}
                truncateText={truncateText}
              />
              <QuizList
                quizzes={quizzes}
                session={session}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                assignQuizToGrade={assignQuizToGrade}
                userQuizzes={userQuizzes}
                router={router}
                allQuizzes={allQuizzes}
              />
              <button
                className="mt-6 text-theme font-semibold flex items-center gap-2 hover:underline"
                onClick={() => setStatShow(!statShow)}
              >
                <img src="/statistics.svg" width={20} height={20} alt="" />
                {statShow ? 'Hide Statistics' : 'Show Statistics'}
              </button>
              {statShow && <ShowStatistics />}
            </div>
            <div className={`${activeDomain === 'SAT Mastering' ? 'block' : 'hidden'}`}>
              <SatQuizGenerator
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedStandard={selectedStandard}
                setSelectedStandard={setSelectedStandard}
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                uploadedQuizFile={uploadedQuizFile}
                setUploadedQuizFile={setUploadedQuizFile}
                handleGenerateQuiz={handleGenerateQuiz}
                handleDirectImport={handleDirectImport}
                standards={standards}
              />
              {isModalOpen && (
                <Modal
                  generatedQuiz={generatedQuiz}
                  handlePreview={handlePreview}
                  handleDownload={handleDownload}
                  handleImport={handleImport}
                  isLoadingAction={isLoadingAction}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </div>
            <div className={`${activeDomain === 'GAT Mastering' ? 'block' : 'hidden'} w-full`}>
              <h1 className="text-center text-theme font-semibold">No GAT Quizzes have been assigned</h1>
            </div>
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

export default AdminQuizzesArea;