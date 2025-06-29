import Image from 'next/image';

export default function QuestionSection({
  question,
  questionIndex,
  totalQuestions,
  selectedChoice,
  onSelectChoice,
  imageSrc
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="bg-theme text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
          {questionIndex + 1}
        </div>
        <div className="flex-1">
          <p className="text-lg text-gray-800 font-medium">
            {question.mainQuestion}
          </p>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="Question Image"
              width={200}
              height={200}
              className="mt-4 rounded-md shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {question.choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => onSelectChoice(index)}
            className={`p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:bg-theme hover:text-white ${
              selectedChoice === index ? 'bg-theme text-white' : 'bg-white text-gray-800'
            }`}
          >
            {choice}
          </div>
        ))}
      </div>
    </div>
  );
}