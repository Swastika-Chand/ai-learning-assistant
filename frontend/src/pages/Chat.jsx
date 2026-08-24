import ReactMarkdown from "react-markdown";

export default function Chat({
  question,
  setQuestion,
  askQuestion,
  chatHistory,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">

      <h2 className="text-xl font-bold mb-4">
        Ask Questions
      </h2>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Ask from PDF..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          className="border p-2 rounded flex-1"
        />

        <button
          onClick={askQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask
        </button>

      </div>

      {chatHistory?.length > 0 && (
        <>
          <h3 className="text-lg font-bold mt-6 mb-4">
            Chat History
          </h3>

          <div className="space-y-4">

            {chatHistory.map(
              (chat, index) => (

                <div
                  key={index}
                  className="space-y-2"
                >

                  <div className="bg-blue-100 p-4 rounded-lg">
                    <strong>You:</strong>
                    <p className="mt-1">
                      {chat.question}
                    </p>
                  </div>

                  <div className="bg-green-100 p-4 rounded-lg">
                    <strong>AI:</strong>

                    <div className="mt-2">
                      <ReactMarkdown>
                        {chat.answer}
                      </ReactMarkdown>
                    </div>

                  </div>

                </div>

              )
            )}

          </div>
        </>
      )}

    </div>
  );
}