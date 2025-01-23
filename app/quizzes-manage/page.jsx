'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function QuizzesManagePage() {
  const [file, setFile] = useState(null);
  const [userFile, setUserFile] = useState(null); // For user import
  const [message, setMessage] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);

  // Define the skills array
  const skillsData = [
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

  // Memoize fetchSkills using useCallback
  const fetchSkills = useCallback((grade, subject) => {
    try {
      // Find the skills for the selected grade and subject
      const gradeData = skillsData.find((item) => item.grade === grade);
      if (gradeData) {
        const subjectData = gradeData.outcomes.find((item) => item.subject === subject);
        if (subjectData) {
          setSkills(subjectData.outcomes);
        } else {
          setSkills([]);
        }
      } else {
        setSkills([]);
      }
    } catch (error) {
      setMessage('Failed to fetch skills.');
    }
  }, []);

  // Fetch skills when grade or subject changes
  useEffect(() => {
    if (grade && subject) {
      fetchSkills(grade, subject);
    } else {
      setSkills([]);
      setSkill('');
    }
  }, [grade, subject, fetchSkills]); // ✅ Correct dependency array

  // Handle file selection for quizzes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file selection for users
  const handleUserFileChange = (e) => {
    setUserFile(e.target.files[0]);
  };

  // Handle quiz import
  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('grade', grade);
    formData.append('subject', subject);
    formData.append('skill', skill);

    try {
      const response = await fetch('/api/quizzes/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage('Failed to import quizzes.');
    }
  };

  // Handle user import
  const handleUserImport = async () => {
    if (!userFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', userFile);

    try {
      const response = await fetch('/api/user/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      setMessage('Failed to import users.');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const url = new URL('/api/quizzes/export', window.location.origin);
      if (grade) url.searchParams.set('grade', grade);
      if (subject) url.searchParams.set('subject', subject);
      if (skill) url.searchParams.set('skill', skill);

      const response = await fetch(url);
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `grade_${grade || 'all'}_${subject || 'all'}_${skill || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage('Quizzes exported successfully.');
    } catch (error) {
      setMessage('Failed to export quizzes.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-w-7xl py-10 gap-10">
      <Toaster />
      <div className="poppins h-full max-w-6xl flex flex-col gap-10 justify-between mx-2">
        <h1 className="text-2xl w-full flex justify-center items-center font-bold text-themeYellow">
          Quizzes Management
        </h1>
        <div className="shadow-md rounded-md p-4">
          <div className="mb-8 w-full">
            <h2 className="text-xl font-semibold text-theme mb-4">
              Export Quizzes
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 w-full">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
              >
                <option value="">Select Grade</option>
                <option value="3">Grade 3</option>
                <option value="6">Grade 6</option>
                <option value="9">Grade 9</option>
              </select>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
              >
                <option value="">Select Skill</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExport}
                className="bg-theme text-white px-4 py-2 rounded-md hover:bg-themeYellow transition-all"
              >
                Export Quizzes as CSV
              </button>
            </div>
          </div>
        </div>

        <div className='shadow-md rounded-md p-4'>
          <h2 className="text-xl font-semibold text-theme mb-4">
            Import Quizzes
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between w-full">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
            >
              <option value="">Select Grade</option>
              <option value="3">Grade 3</option>
              <option value="6">Grade 6</option>
              <option value="9">Grade 9</option>
            </select>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
            </select>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="bg-theme text-white px-4 py-2 rounded-md mb-2 md:mb-0"
            >
              <option value="">Select Skill</option>
              {skills.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm text-theme file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-theme file:text-white hover:file:bg-theme mb-2 md:mb-0"
            />
            <button
              onClick={handleImport}
              className="bg-theme text-white px-4 py-2 rounded-md hover:bg-theme hover:text-white transition-all"
            >
              Import Quizzes
            </button>
          </div>
        </div>

        {/* User Import Section */}
        <div className='shadow-md rounded-md p-4'>
          <h2 className="text-xl font-semibold text-theme mb-4">
            Import Users
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between w-full">
            <input
              type="file"
              accept=".csv"
              onChange={handleUserFileChange}
              className="text-sm text-theme file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-theme file:text-white hover:file:bg-theme mb-2 md:mb-0"
            />
            <button
              onClick={handleUserImport}
              className="bg-theme text-white px-4 py-2 rounded-md hover:bg-theme hover:text-white transition-all"
            >
              Import Users
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-theme text-white rounded-md">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}