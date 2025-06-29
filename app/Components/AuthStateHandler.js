import React from 'react';
import Hero from './Hero';
import SubjectSelector from './SubjectSelector';
import QuizFilter from './QuizFilter';
import QuizList from './QuizList';
import SATMasteringSection from './SATMasteringSection';
import GATMasteringSection from './GATMasteringSection';

function AuthStateHandler({
  status, isLoading, user, setUser, session, activeDomain, changeDomain,
  allQuizzes, selectedSubject, setSelectedSubject, assignedQuizzes, userQuizzes,
  router, subject, setSubject, grade, setGrade, skill, setSkill, quizzes
}) {
  if (status === 'loading' || isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!user.isLogged) {
    return (
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
    );
  }

  return (
    <>
      <Hero role={session?.user.role} changeDomain={changeDomain} />
      {activeDomain === "NAFS Mastering" && session?.user.role === 'ST' && !selectedSubject && (
        <SubjectSelector setSelectedSubject={setSelectedSubject} />
      )}
      {activeDomain === "NAFS Mastering" && (
        <div>
          {allQuizzes.length === 0 ? (
            <div className="text-center text-gray-500">No quizzes available.</div>
          ) : (
            <>
              {session?.user.role === 'AD' && (
                <QuizFilter
                  subject={subject}
                  setSubject={setSubject}
                  grade={grade}
                  setGrade={setGrade}
                  skill={skill}
                  setSkill={setSkill}
                />
              )}
              <QuizList
                session={session}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                assignedQuizzes={assignedQuizzes}
                userQuizzes={userQuizzes}
                quizzes={quizzes}
                router={router}
              />
            </>
          )}
        </div>
      )}
      {activeDomain === "SAT Mastering" && (
        <SATMasteringSection />
      )}
      {activeDomain === "GAT Mastering" && (
        <GATMasteringSection />
      )}
    </>
  );
}

export default AuthStateHandler;
