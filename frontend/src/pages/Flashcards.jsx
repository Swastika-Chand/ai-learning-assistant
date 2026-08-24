import { useState } from "react";
import Loader from "../components/Loader";

export default function Flashcards({
  flashcards,
  loadingFlashcards,
}) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [revisionCards, setRevisionCards] = useState([]);

  if (loadingFlashcards) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Loader text="Generating Interactive Flashcards via Gemini..." />
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  const card = flashcards[currentCard];

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowBack(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowBack(false);
    }
  };

  const markKnown = () => {
    if (!knownCards.includes(currentCard)) {
      setKnownCards([...knownCards, currentCard]);
    }
  };

  const markRevision = () => {
    if (!revisionCards.includes(currentCard)) {
      setRevisionCards([...revisionCards, currentCard]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">

      <h2 className="text-2xl font-bold mb-4">
        Interactive Flashcards
      </h2>

      <div className="flex justify-between mb-4 font-semibold text-slate-700">
        <span>
          Card {currentCard + 1} / {flashcards.length}
        </span>
        <span>
          Known: <span className="text-emerald-600 font-bold">{knownCards.length}</span> | Revision: <span className="text-red-600 font-bold">{revisionCards.length}</span>
        </span>
      </div>

      <div
        onClick={() => setShowBack(!showBack)}
        className="
          cursor-pointer
          border-2
          border-slate-200
          rounded-xl
          p-10
          min-h-[220px]
          flex
          items-center
          justify-center
          text-center
          text-xl
          font-semibold
          bg-slate-50
          hover:bg-blue-50
          hover:border-blue-300
          hover:shadow-md
          transition-all
          duration-200
        "
      >
        {showBack ? card.back : card.front}
      </div>

      <p className="text-center text-xs text-slate-400 mt-3">
        Click card to flip
      </p>

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={previousCard}
          disabled={currentCard === 0}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => setShowBack(!showBack)}
          className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 transition"
        >
          Flip Card
        </button>

        <button
          onClick={nextCard}
          disabled={currentCard === flashcards.length - 1}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={markKnown}
          className="bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 transition"
        >
          ✓ Known
        </button>

        <button
          onClick={markRevision}
          className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition"
        >
          🔄 Revise Again
        </button>
      </div>

    </div>
  );
}