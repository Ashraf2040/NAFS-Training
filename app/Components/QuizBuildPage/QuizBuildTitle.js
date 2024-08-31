'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import useGlobalContextProvider from '@/app/ContextApi';
import convertToFaIcons from '@/app/convertToFaIcons';

function QuizBuildTitle({ focusProp, onChangeQuizTitle, onSubjectChange, onGradeChange,onSkillChange, newQuiz}) {
  const { openBoxToggle, selectedIconObject, selectedQuizObject } =
    useGlobalContextProvider();
  const { selectedQuiz } = selectedQuizObject;
  const [quizTitle, setQuizTitle] = useState(() => {
    return selectedQuiz ? selectedQuiz.quizTitle : '';
  });
  const { focus } = focusProp;
  const quizTitleRef = useRef(null);

  const { openIconBox, setOpenIconBox } = openBoxToggle;
  const { selectedIcon, setSelectedIcon } = selectedIconObject;
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [skill, setSkill] = useState('');
  const skills=["Skill 1","Skill 2","Skill 3","Skill 4","Skill 5"]

  function handleTextInputChange(text) {
    setQuizTitle(text);
    onChangeQuizTitle(text);
  }
  // function handleSubjectChange(event) {
  //   setSubject(event.target.value);
  //   onSubjectChange(event.target.value); // Pass the selected subject to the parent component
  // }
  
  function handleSubjectChange(event) {
    const selectedSubject = event.target.value; // Capture the selected value
    setSubject(selectedSubject); // Update the state
    onSubjectChange(selectedSubject); // Pass the selected value to the parent component
  }

  function handleGradeChange(event) {
    setGrade(event.target.value);
    onGradeChange(event.target.value); // Pass the selected grade to the parent component
  }
  function handleSkillChange(event) {
    setSkill(event.target.value);
    onSkillChange(event.target.value); // Pass the selected grade to the parent component
  }

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
  useEffect(() => {
    if (newQuiz.subject === '') { // Check if subject is empty
      handleSubjectChange('English'); // Call handleSubjectChange with initial value
    }
    if (newQuiz.grade === '') { // Check if grade is empty
      handleGradeChange('3'); // Call handleGradeChange with initial value
    }
  }, [newQuiz.subject, newQuiz.grade, handleSubjectChange, handleGradeChange ,handleSkillChange]);

  return (
    <div className="p-3 flex justify-between border border-theme  rounded-md">
      <div className="flex gap-2">
        <div className="flex  items-center gap-2">
          <div className="bg-theme px-4 py-1 rounded-md text-white">Quiz Details</div>
          

          <span className="font-bold">Quiz Name : </span>
          
          
        </div>
        <input
          onChange={(e) => {
            handleTextInputChange(e.target.value);
          }}
          value={quizTitle}
          ref={quizTitleRef}
          className="outline-none border-b-2 pt-1 w-[300px] text-[13px]"
          placeholder="Enter the Name Of The Quiz..."
        />
        
      </div>
      <FontAwesomeIcon
        onClick={() => {
          setOpenIconBox(true);
        }}
        icon={selectedIcon.faIcon}
        height={40}
        width={40}
        className="text-white p-2 rounded-md bg-theme cursor-pointer"
      />
      <div className='gap-6 flex items-center justify-center'>
        <span className='font-bold'>Subject :</span>
        <select name="subject" id="" value={newQuiz.subject} onChange={handleSubjectChange}>
  <option value="English" selected>English</option>
  <option value="Math">Math</option>
  <option value="Science">Science</option>
</select>
        <span className='font-bold'>Grade :</span>
        <select name="grade" id="" value={newQuiz.grade} onChange={handleGradeChange}>
          <option value="3" >3</option>
          <option value="6">6</option>
          <option value="9">9</option>
        </select>
        <span className='font-bold'>Skill :</span>
        <select name="grade" id="" value={newQuiz.skill} onChange={handleSkillChange}>
        { skills.map((skill)=> <option value={skill.toLocaleLowerCase()} key={skill.toLocaleLowerCase()}>{skill}</option>)}
        </select>
      </div>
    </div>
  );
}

export default QuizBuildTitle;
