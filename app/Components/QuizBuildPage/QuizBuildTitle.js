'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import useGlobalContextProvider from './../../ContextApi';
import convertToFaIcons from './../../convertToFaIcons';

function QuizBuildTitle({ focusProp, onChangeQuizTitle, onSubjectChange, onGradeChange, onSkillChange, newQuiz }) {
  const { openBoxToggle, selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
  const { selectedQuiz } = selectedQuizObject;
  const [quizTitle, setQuizTitle] = useState(() => {
    return selectedQuiz ? selectedQuiz.quizTitle : '';
  });
  const { focus } = focusProp;
  const quizTitleRef = useRef(null);

  const { openIconBox, setOpenIconBox } = openBoxToggle;
  const { selectedIcon, setSelectedIcon } = selectedIconObject;
  const [subject, setSubject] = useState(newQuiz.subject || '');
  const [grade, setGrade] = useState(newQuiz.grade || '');
  const [skill, setSkill] = useState(newQuiz.skill || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown open state
  const [hoveredOutcome, setHoveredOutcome] = useState(null); // Track hovered outcome

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

  // Filter outcomes based on selected subject and grade
  const filteredOutcomes = skills
    .find((skill) => skill.grade === grade)
    ?.outcomes.find((outcome) => outcome.subject === subject)?.outcomes || [];

  function handleTextInputChange(text) {
    setQuizTitle(text);
    onChangeQuizTitle(text);
  }

  function handleSubjectChange(event) {
    const selectedSubject = event.target.value;
    setSubject(selectedSubject);
    onSubjectChange(selectedSubject);
  }

  function handleGradeChange(event) {
    const selectedGrade = event.target.value;
    setGrade(selectedGrade);
    onGradeChange(selectedGrade);
  }

  function handleSkillSelection(outcome) {
    setSkill(outcome);
    onSkillChange(outcome);
    setIsDropdownOpen(false); // Close the dropdown after selection
  }

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

  useEffect(() => {
    if (focus) {
      quizTitleRef.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    if (typeof selectedIcon.faIcon === 'string') {
      const newFaIcon = convertToFaIcons(selectedIcon.faIcon);
      const copySelectedIcon = { ...selectedIcon };
      copySelectedIcon.faIcon = newFaIcon;
      setSelectedIcon(copySelectedIcon);
    }
  }, [selectedIcon, setSelectedIcon]);

  return (
    <div className="p-3 flex  justify-between border border-theme rounded-md ">
      <div className="flex  gap-2 ">
        <div className="flex items-center  ">
         
          <span className="font-bold">Quiz Name : </span>
        </div>
        <input
          onChange={(e) => handleTextInputChange(e.target.value)}
          value={quizTitle}
          ref={quizTitleRef}
          className="outline-none border-b-2 pt-1 w-fit text-[13px]"
          placeholder="."
        />
      </div>
      <FontAwesomeIcon
        onClick={() => setOpenIconBox(true)}
        icon={selectedIcon.faIcon}
        height={40}
        width={40}
        className="text-white p-2 rounded-md bg-theme cursor-pointer"
      />
      <div className=" flex gap-2 items-center justify-center">
        <span className="font-bold">Subject :</span>
        <select
          name="subject"
          value={subject}
          onChange={handleSubjectChange}
          className="text-theme px-2 rounded-md"
        >
          
          <option value="English">English</option>
          <option value="Math">Math</option>
          <option value="Science">Science</option>
        </select>
        <span className="font-bold">Grade :</span>
        <select
          name="grade"
          value={grade}
          onChange={handleGradeChange}
          className="text-theme px-2 rounded-md"
        >
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
        </select>
        <div className="relative">
          <button
            className="text-theme px-2 rounded-md flex items-center gap-1"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={!subject || !grade} // Disable if subject or grade is not selected
          >
            {skill || 'Select Outcome'} <span className="text-sm">▼</span> {/* Arrow down icon */}
          </button>
          {isDropdownOpen && (
            <ul className="absolute top-10 left-0 z-10 bg-white border border-gray-200 rounded-md w-48 max-h-60 overflow-y-auto shadow-lg" onMouseLeave={() => setIsDropdownOpen(false)}>
              {filteredOutcomes.map((outcome, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSkillSelection(outcome)}
                  onMouseEnter={() => setHoveredOutcome(outcome)} // Set hovered outcome
                  onMouseLeave={() => setHoveredOutcome(null)} // Clear hovered outcome
                >
                Outcome {index + 1}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal to display hovered outcome */}
      {hoveredOutcome && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md modal-content">
            <h3 className="text-lg font-bold text-theme mb-4">Outcome Details</h3>
            <p className="text-gray-700">{hoveredOutcome}</p>
            <button
              className="mt-4 px-4 py-2 bg-theme text-white rounded-md"
              onClick={() => setHoveredOutcome(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizBuildTitle;