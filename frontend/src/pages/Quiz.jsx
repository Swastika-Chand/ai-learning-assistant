import Loader from "../components/Loader";

export default function Quiz({
  quizQuestions,
  currentQuestion,
  selectedOption,
  setSelectedOption,
  submitAnswer,
  quizFinished,
  score,
  userAnswers,
  generateQuiz,
  loadingQuiz,
}) {
  if (loadingQuiz) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Loader text="Generating Quiz Questions via Gemini..." />
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return null;
  }

  if (quizFinished) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">

        <h2 className="text-2xl font-bold mb-4">
          🎉 Quiz Complete
        </h2>

        <h3>
          Score: {score} / {quizQuestions.length}
        </h3>

        <h3 className="mb-6">
          Accuracy:
          {" "}
          {Math.round(
            (score /
              quizQuestions.length) *
              100
          )}
          %
        </h3>

        <h3 className="text-xl font-bold mb-4">
          Review Answers
        </h3>

        {userAnswers.map(
          (item, index) => (
            <div
              key={index}
              className={`p-4 rounded mb-4 ${
                item.isCorrect
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}
            >

              <p>
                <strong>Question:</strong>
                {" "}
                {item.question}
              </p>

              <p>
                <strong>Your Answer:</strong>
                {" "}
                {item.selected}
              </p>

              <p>
                <strong>Correct Answer:</strong>
                {" "}
                {item.correct}
              </p>

              {item.explanation && (
                <p className="mt-2 text-sm text-slate-700">
                  <strong>Explanation:</strong>
                  {" "}
                  {item.explanation}
                </p>
              )}

            </div>
          )
        )}

        <button
          onClick={generateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
        >
          Retry Quiz
        </button>

      </div>
    );
  }

  const current = quizQuestions[currentQuestion];

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">

      <h2 className="text-xl font-bold mb-4">
        Quiz
      </h2>

      <div className="w-full bg-gray-200 h-3 rounded mb-4">
        <div
          className="bg-blue-600 h-3 rounded transition-all duration-300"
          style={{
            width: `${
              ((currentQuestion + 1) /
                quizQuestions.length) *
              100
            }%`,
          }}
        />
      </div>

      <h3 className="font-bold text-slate-700">
        Question {currentQuestion + 1}
        {" / "}
        {quizQuestions.length}
      </h3>

      <p className="mt-4 mb-4 font-medium text-lg text-slate-900">
        {current.question}
      </p>

      {current.options.map(
        (option) => (
          <div
            key={option}
            className="mb-2"
          >
            <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={
                  selectedOption === option
                }
                onChange={(e) =>
                  setSelectedOption(
                    e.target.value
                  )
                }
              />
              <span className="text-slate-800">{option}</span>
            </label>
          </div>
        )
      )}

      <button
        onClick={submitAnswer}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium mt-4 hover:bg-blue-700 transition"
      >
        {currentQuestion === quizQuestions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>
    </div>
  );
}