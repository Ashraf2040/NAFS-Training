import React from 'react';
import Image from 'next/image';

function SubjectSelector({ setSelectedSubject }) {
  const subjectBoxes = [
    { name: 'Science', icon: '/science-icon.svg' },
    { name: 'Math', icon: '/math-icon1.svg' },
    { name: 'English', icon: '/english-icons1.svg' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-[#1f6f78] text-center mb-4">Choose Your Subject</h2>
      <div className="flex flex-wrap justify-around gap-4">
        {subjectBoxes.map((box, index) => (
          <div
            key={index}
            onClick={() => setSelectedSubject(box.name)}
            className="cursor-pointer flex flex-col items-center justify-center w-full max-w-xs h-64 rounded-2xl bg-gradient-to-br from-[#1f6f78]/30 to-[#F5A053]/30 text-[#F5A053] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 active:translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `calc(${index + 1} * 300ms)` }}
          >
            <Image
              src={box.icon}
              alt={`${box.name} Icon`}
              width={120}
              height={120}
              className="mb-3 drop-shadow-md"
            />
            <span className="text-2xl font-semibold">{box.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectSelector;