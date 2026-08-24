import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";

export default function Summary({
  summary,
  loadingSummary,
}) {

  if (loadingSummary) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Loader text="Generating Executive Summary via Gemini..." />
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">

      <h2 className="text-2xl font-bold mb-4">
        Executive Summary
      </h2>

      <ReactMarkdown>
        {summary}
      </ReactMarkdown>

    </div>
  );
}