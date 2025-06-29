import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import emojiIconScore from './../../utils/emojiIconScore';

export default function ScoreComponent({ quizQuestions, userAnswers, score, quiz, restartQuiz, onClose }) {
  const correctAnswers = quizQuestions.map(q => q.correctAnswer);
  const correctCount = userAnswers.filter((a, i) => a === correctAnswers[i]).length;
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white max-w-6xl w-full mx-4 rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-theme to-themeYellow p-4 flex justify-between items-center">
          <h3 className="text-xl text-white font-semibold">Quiz Results</h3>
          <IoClose className="text-2xl text-white cursor-pointer hover:text-gray-200" onClick={handleClose} />
        </div>
        <div className="p-6 bg-gray-50">
          <div className="flex items-center gap-4">
            <Image
              src={`/${emojiIconScore(score, quizQuestions.length)}`}
              alt="Score Emoji"
              width={60}
              height={60}
            />
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-theme">Your Score:</span>
              <div className="text-3xl text-themeYellow font-semibold mt-2">
                {score}/{quizQuestions.length * 10}
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Image src="/correct-answer.png" alt="" width={20} height={20} />
              <span>Correct: {correctCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/incorrect-answer.png" alt="" width={20} height={20} />
              <span>Incorrect: {quizQuestions.length - correctCount}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-theme text-white font-semibold rounded-md shadow-md hover:bg-themeYellow hover:text-black transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <h4 className="text-xl text-theme font-semibold text-center mb-4">
            {quiz?.quizTitle}
          </h4>
          {quizQuestions.map((question, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <h5 className="text-lg text-theme font-medium">
                Q{index + 1}: <span className="text-gray-700">{question.mainQuestion}</span>
              </h5>
              <div className="mt-2 p-4 bg-gray-100 rounded-md flex justify-between items-center">
                <div className="space-y-1">
                  <p>
                    Your Answer:{' '}
                    <span className={userAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-500'}>
                      {question.choices[userAnswers[index]]}
                    </span>
                  </p>
                  <p>Correct Answer: <span className="text-gray-800">{question.choices[question.correctAnswer]}</span></p>
                </div>
                <p className="text-theme font-semibold">
                  {userAnswers[index] === question.correctAnswer ? '+10' : '0'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}