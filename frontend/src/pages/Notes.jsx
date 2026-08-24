import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";

export default function Notes({
  notes,
  loadingNotes,
}) {
  if (loadingNotes) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Loader text="Generating Study Notes via Gemini..." />
      </div>
    );
  }

  if (!notes) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">
        Study Notes
      </h2>

      <ReactMarkdown>
        {notes}
      </ReactMarkdown>
    </div>
  );
}