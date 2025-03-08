"use client";
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import { Toaster } from 'react-hot-toast';
import { skillsData } from '../../lib/skillsData';

export default function QuizzesManagePage() {
  const [file, setFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [message, setMessage] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);

  const fetchSkills = useCallback((grade, subject) => {
    try {
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

  useEffect(() => {
    if (grade && subject) {
      fetchSkills(grade, subject);
    } else {
      setSkills([]);
      setSkill('');
    }
  }, [grade, subject, fetchSkills]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUserFileChange = (e) => setUserFile(e.target.files[0]);

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

  const handleExport = async () => {
    try {
      const url = new URL('/api/quizzes/export', window.location.origin);
      if (grade) url.searchParams.set('grade', grade);
      if (subject) url.searchParams.set('subject', subject);
      if (skill) url.searchParams.set('skill', skill);

      const response = await fetch(url);
      const blob = await response.blob();
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
    <div className="poppins min-h-screen ">
     
      <div className="mx-auto max-w-6xl my-8">
        <Toaster />
        {/* Header */}
        <div className="bg-gradient-to-r from-theme to-themeYellow p-6 rounded-t-lg shadow-lg">
          <h1 className="text-3xl text-white font-bold text-center">Quizzes Management</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-b-lg p-6 space-y-8">
          {/* Export Quizzes */}
          <div className="space-y-4">
            <h2 className="text-2xl text-theme font-semibold">Export Quizzes</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Grade</option>
                <option value="3">Grade 3</option>
                <option value="6">Grade 6</option>
                <option value="9">Grade 9</option>
              </select>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Outcome</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill.length > 30 ? `${skill.substring(0, 30)}...` : skill}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all"
              >
                Export as CSV
              </button>
            </div>
          </div>

          {/* Import Quizzes */}
          <div className="space-y-4">
            <h2 className="text-2xl text-theme font-semibold">Import Quizzes</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Grade</option>
                <option value="3">Grade 3</option>
                <option value="6">Grade 6</option>
                <option value="9">Grade 9</option>
              </select>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Outcome</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill.length > 30 ? `${skill.substring(0, 30)}...` : skill}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-theme file:text-white file:font-semibold hover:file:bg-themeYellow"
                />
              </div>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all"
              >
                Import Quizzes
              </button>
            </div>
          </div>

          {/* Import Users */}
          <div className="space-y-4">
            <h2 className="text-2xl text-theme font-semibold">Import Users</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleUserFileChange}
                  className="w-full p-2 rounded-md border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-theme file:text-white file:font-semibold hover:file:bg-themeYellow"
                />
              </div>
              <button
                onClick={handleUserImport}
                className="px-4 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all"
              >
                Import Users
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="p-4 bg-theme text-white rounded-md shadow-md">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}