import React from 'react';

function QuizFilter({
  subject,
  setSubject,
  grade,
  setGrade,
  skill,
  setSkill,
  isDropdownOpen,
  setIsDropdownOpen,
  filteredOutcomes,
  hoveredOutcome,
  setHoveredOutcome,
  truncateText,
}) {
  return (
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
  );
}

export default QuizFilter;