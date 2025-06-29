import React from 'react';

function QuizHeader({ user }) {
  return (
    <div className="bg-gradient-to-r from-theme to-themeYellow p-6">
      <h1 className="text-3xl text-white font-bold text-center">
        {user.isLogged ? 'Your Quiz Dashboard' : 'NAFS Training Platform'}
      </h1>
    </div>
  );
}

export default QuizHeader;