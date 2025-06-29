import React from 'react';
import Image from 'next/image';
import QuizCard from './QuizCard';
import PlaceHolder from './PlaceHolder';

function QuizList({
  quizzes,
  session,
  selectedSubject,
  setSelectedSubject,
  assignQuizToGrade,
  userQuizzes,
  router,
  allQuizzes,
}) {
  return (
    <div>
      {allQuizzes.length === 0 ? (
        <PlaceHolder />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-theme font-semibold flex items-center gap-2">
              <Image src="/earth.svg" width={24} height={24} alt="" />
              My Quizzes
            </h2>
            {session?.user.role === 'AD' && (
              <button
                onClick={() => router.push('/quizzes-manage')}
                className="text-white bg-gradient-to-r from-amber-500 to-orange-600 font-semibold hover:underline px-6 py-2 rounded-full flex items-center gap-2"
              >
                Quizzes Management
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {session?.user.role === 'ST' && selectedSubject ? (
              <>
                {quizzes?.length > 0 ? (
                  quizzes
                    .filter((singleQuiz) => singleQuiz.quiz.subject === selectedSubject)
                    .map((singleQuiz, quizIndex) => (
                      <QuizCard
                        key={quizIndex}
                        singleQuiz={singleQuiz.quiz}
                        assignQuizToGrade={assignQuizToGrade}
                        role={session.user.role}
                        assignedQuizzes={quizzes}
                        userQuizzes={userQuizzes}
                      />
                    ))
                ) : (
                  <p className="text-gray-600">No quizzes assigned for {selectedSubject}.</p>
                )}
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="text-theme font-semibold underline mt-4"
                >
                  Back to Subjects
                </button>
              </>
            ) : (
              session?.user.role === 'AD' && (
                <>
                  {quizzes.map((singleQuiz, quizIndex) => (
                    <QuizCard
                      key={quizIndex}
                      singleQuiz={singleQuiz}
                      assignQuizToGrade={assignQuizToGrade}
                      role={session.user.role}
                    />
                  ))}
                  <div
                    onClick={() => router.push('/quiz-build')}
                    className="cursor-pointer flex flex-col items-center justify-center w-56 h-56 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <Image src="/add-quiz.png" width={120} height={120} alt="" />
                    <span className="mt-2 text-gray-500">Add a New Quiz</span>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizList;