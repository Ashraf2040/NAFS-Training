"use client";
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import { Toaster } from 'react-hot-toast';
import { skillsData } from '../../lib/skillsData';

export default function SatQuizzesManagePage() {
  const [file, setFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const fixedGrade = '12'; // Fixed grade for SAT
  const fixedScope = 'SAT'; // Fixed scope for SAT quizzes

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
      setMessage('Failed to fetch skills for SAT.');
    }
  }, []);

  useEffect(() => {
    if (subject) {
      fetchSkills(fixedGrade, subject);
    } else {
      setSkills([]);
      setSkill('');
    }
  }, [subject, fetchSkills, fixedGrade]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUserFileChange = (e) => setUserFile(e.target.files[0]);

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file to upload for SAT quizzes.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('grade', fixedGrade); // Fixed grade value for SAT
    formData.append('scope', fixedScope); // Fixed scope value for SAT quizzes
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
      setMessage('Failed to import SAT quizzes.');
    }
  };

  const handleUserImport = async () => {
    if (!userFile) {
      setMessage('Please select a file to upload for users.');
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
      url.searchParams.set('grade', fixedGrade); // Fixed grade value for SAT
      url.searchParams.set('scope', fixedScope); // Fixed scope value for SAT quizzes
      if (subject) url.searchParams.set('subject', subject);
      if (skill) url.searchParams.set('skill', skill);

      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `sat_grade_${fixedGrade}_${subject || 'all'}_${skill || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage('SAT quizzes exported successfully.');
    } catch (error) {
      setMessage('Failed to export SAT quizzes.');
    }
  };

  return (
    <div className="poppins min-h-screen">
      <div className="mx-auto max-w-7xl my-8">
        <Toaster />
        {/* Header */}
        <div className="bg-gradient-to-r from-theme to-themeYellow p-6 rounded-t-lg shadow-lg">
          <h1 className="text-3xl text-white font-bold text-center">SAT Quizzes Management</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-b-lg p-6 space-y-8">
          {/* Export SAT Quizzes */}
          <div className="space-y-4">
            <h2 className="text-2xl text-theme font-semibold">Export SAT Quizzes</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
               
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
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

          {/* Import SAT Quizzes */}
          <div className="space-y-4">
            <h2 className="text-2xl text-theme font-semibold">Import SAT Quizzes</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-theme focus:border-transparent shadow-sm"
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
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
                Import SAT Quizzes
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
