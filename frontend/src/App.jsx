import { useState, useEffect } from "react";
import api from "./services/api";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Dashboard from "./pages/Dashboard";
import Summary from "./pages/Summary";
import Loader from "./components/Loader";


function App() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [workspaceFiles, setWorkspaceFiles] = useState([]);
  const [selectedWorkspaceFile, setSelectedWorkspaceFile] = useState(null);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [processingContent, setProcessingContent] = useState(false);
  const [buildingRag, setBuildingRag] = useState(false);

  const [question, setQuestion] = useState("");

  const [notes, setNotes] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [flashcards, setFlashcards] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  const [userAnswers, setUserAnswers] = useState([]);

  const [analytics, setAnalytics] = useState({ documents: 0, quizzes: 0, flashcards: 0, avgScore: 0 });

  const [chatHistory, setChatHistory] = useState([]);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);


  const loadWorkspaces = async () => {
    try {
      const response = await api.get("/workspace/");
      setWorkspaces(response.data);
      if (response.data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(response.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const createWorkspace = async () => {
    if (!workspaceName.trim()) {
      alert("Enter workspace name");
      return;
    }
    try {
      const response = await api.post("/workspace/", { name: workspaceName });
      alert(`Workspace Created: ${response.data.name}`);
      setWorkspaceName("");
      loadWorkspaces();
      setSelectedWorkspace(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to create workspace");
    }
  };

  const loadWorkspaceFiles = async (workspaceId) => {
    try {
      const response = await api.get(`/upload/files/${workspaceId}`);
      setWorkspaceFiles(response.data);
      setAnalytics(prev => ({ ...prev, documents: response.data.length }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedWorkspace) {
      loadWorkspaceFiles(selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  // Clear all data when workspace changes
  useEffect(() => {
    setSelectedWorkspaceFile(null);
    setNotes("");
    setSummary("");
    setQuizQuestions([]);
    setFlashcards([]);
    setChatHistory([]);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setUserAnswers([]);
  }, [selectedWorkspace]);

  // Clear all data when selected file changes
  useEffect(() => {
    if (selectedWorkspaceFile) {
      setNotes("");
      setSummary("");
      setQuizQuestions([]);
      setFlashcards([]);
      setChatHistory([]);
      setQuizFinished(false);
      setScore(0);
    }
  }, [selectedWorkspaceFile]);

  const uploadFile = async () => {
    if (!selectedWorkspace || !selectedFile) {
      alert("Select workspace and file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post(
        `/upload/${selectedWorkspace.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedWorkspaceFile(response.data);
      setSelectedFile(null);
      loadWorkspaceFiles(selectedWorkspace.id);
      alert(`Uploaded: ${response.data.file_name}`);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const importYoutubeVideo = async () => {
    if (!selectedWorkspace) {
      alert("Select a workspace first");
      return;
    }
    if (!youtubeUrl.trim()) {
      alert("Enter a YouTube URL");
      return;
    }

    try {
      setLoadingYoutube(true);
      const response = await api.post("/youtube/import", {
        workspace_id: selectedWorkspace.id,
        url: youtubeUrl.trim(),
      });

      setYoutubeUrl("");
      await loadWorkspaceFiles(selectedWorkspace.id);
      
      const newFile = {
        id: response.data.file_id,
        file_name: response.data.file_name || "YouTube Video",
        file_type: "youtube",
        workspace_id: selectedWorkspace.id
      };
      setSelectedWorkspaceFile(newFile);

      alert(`YouTube Video Imported Successfully!\n${response.data.characters} characters extracted.`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "YouTube import failed. Ensure captions are enabled.");
    } finally {
      setLoadingYoutube(false);
    }
  };

  const processContent = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select a file first");
      return;
    }

    try {
      setProcessingContent(true);
      const response = await api.post(
        `/process/content/${selectedWorkspaceFile.id}`
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Processing failed");
    } finally {
      setProcessingContent(false);
    }
  };

  const buildRag = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    try {
      setBuildingRag(true);
      const response = await api.post(
        `/rag/build/file/${selectedWorkspaceFile.id}`
      );
      alert(`Knowledge Base Created! Chunks: ${response.data.chunks}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Build knowledge base failed. Extract text first.");
    } finally {
      setBuildingRag(false);
    }
  };

  const askQuestion = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    if (!question.trim()) {
      alert("Enter a question");
      return;
    }

    try {
      const response = await api.post(
        `/chat/file/${selectedWorkspaceFile.id}`,
        { question: question }
      );

      setChatHistory(prev => [
        ...prev,
        { question: question, answer: response.data.answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Chat failed");
    }
  };

  const generateNotes = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    try {
      setLoadingNotes(true);
      const response = await api.get(`/notes/file/${selectedWorkspaceFile.id}`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate notes. Ensure Knowledge Base is built.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const generateQuiz = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    try {
      setLoadingQuiz(true);
      const response = await api.get(`/quiz/file/${selectedWorkspaceFile.id}`);
      setQuizQuestions(response.data.questions);
      setAnalytics(prev => ({ ...prev, quizzes: prev.quizzes + 1 }));
      setCurrentQuestion(0);
      setSelectedOption("");
      setScore(0);
      setQuizFinished(false);
      setUserAnswers([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate quiz. Ensure Knowledge Base is built.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const submitAnswer = () => {
    if (!selectedOption) {
      alert("Select an answer");
      return;
    }

    const current = quizQuestions[currentQuestion];

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        selected: selectedOption,
        correct: current.answer,
        explanation: current.explanation || "",
        isCorrect: selectedOption === current.answer,
      },
    ]);

    if (selectedOption === current.answer) {
      setScore((prev) => prev + 1);
    }

    setSelectedOption("");

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = selectedOption === current.answer ? score + 1 : score;
      const percentage = Math.round((finalScore / quizQuestions.length) * 100);
      setAnalytics(prev => ({ ...prev, avgScore: percentage }));
      setQuizFinished(true);
    }
  };

  const generateFlashcards = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    try {
      setLoadingFlashcards(true);
      const response = await api.get(`/flashcards/file/${selectedWorkspaceFile.id}`);
      setFlashcards(response.data.cards);
      setAnalytics(prev => ({ ...prev, flashcards: response.data.cards.length }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate flashcards. Ensure Knowledge Base is built.");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedWorkspaceFile) {
      alert("Select file first");
      return;
    }

    try {
      setLoadingSummary(true);
      const response = await api.get(
        `/summary/file/${selectedWorkspaceFile.id}`
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate summary. Ensure Knowledge Base is built.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <Dashboard
      workspaces={workspaces}
      selectedWorkspace={selectedWorkspace}
      setSelectedWorkspace={setSelectedWorkspace}
      analytics={analytics}
    >

      {/* Create Workspace */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Workspace Management</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={createWorkspace}
            className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            + Create Workspace
          </button>
        </div>
      </div>

      {/* Selected Workspace Header */}
      {selectedWorkspace && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 border-l-4 border-blue-600 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{selectedWorkspace.name}</h2>
            <p className="text-xs text-slate-500">Active Workspace ID: {selectedWorkspace.id}</p>
          </div>
        </div>
      )}

      {/* Input Ingestion Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Add Learning Sources</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Source 1 & 2: PDF or Image File Upload */}
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-slate-700 mb-2">📄 / 🖼️ Upload Document or Image</h3>
            <p className="text-xs text-slate-500 mb-3">Supported formats: PDF, PNG, JPG, JPEG, WEBP</p>
            
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 rounded w-full bg-white text-sm"
            />
            
            {selectedFile && (
              <p className="mt-2 text-xs font-semibold text-blue-600">
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              onClick={uploadFile}
              className="mt-3 w-full bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 transition text-sm"
            >
              Upload File
            </button>
          </div>

          {/* Source 3: YouTube URL Import */}
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <h3 className="font-semibold text-slate-700 mb-2">▶️ Import YouTube Video</h3>
            <p className="text-xs text-slate-500 mb-3">Directly extract captions & transcript from YouTube URL</p>

            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="border p-2 rounded w-full bg-white text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />

            <button
              onClick={importYoutubeVideo}
              disabled={loadingYoutube}
              className="mt-3 w-full bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition text-sm disabled:opacity-50"
            >
              {loadingYoutube ? "Extracting Transcript..." : "Import YouTube Video"}
            </button>
          </div>

        </div>

        {/* Files List & Pipeline Actions */}
        <div className="mt-8">
          <h3 className="font-bold text-slate-800 mb-3">Workspace Files ({workspaceFiles.length})</h3>

          {workspaceFiles.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No files in this workspace yet. Upload a PDF/Image or import a YouTube video above.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {workspaceFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedWorkspaceFile(file)}
                  className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center transition ${
                    selectedWorkspaceFile?.id === file.id
                      ? "bg-blue-50 border-blue-500 shadow-sm"
                      : "bg-white hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {file.file_type === "pdf" ? "📄" : file.file_type === "youtube" ? "▶️" : "🖼️"}
                    </span>
                    <span className="font-medium text-slate-700 text-sm">{file.file_name}</span>
                  </div>
                  <span className="text-xs uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">
                    {file.file_type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Active File Indicator & Action Buttons */}
          {selectedWorkspaceFile && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-blue-900">
                  Active Selected Source: <strong className="underline">{selectedWorkspaceFile.file_name}</strong>
                </span>
                <span className="text-xs text-blue-700 font-mono">ID: {selectedWorkspaceFile.id}</span>
              </div>

              <div className="flex gap-3 flex-wrap">
                {selectedWorkspaceFile.file_type !== "youtube" && (
                  <button
                    onClick={processContent}
                    disabled={processingContent}
                    className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {processingContent ? "Extracting Text..." : "1. Extract Text"}
                  </button>
                )}

                <button
                  onClick={buildRag}
                  disabled={buildingRag}
                  className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {buildingRag ? "Building Index..." : "2. Build Knowledge Base (FAISS)"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Tools Bar */}
      {selectedWorkspaceFile && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">AI Learning Tools</h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={generateSummary}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm"
            >
              📝 Summary
            </button>

            <button
              onClick={generateNotes}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              📖 Study Notes
            </button>

            <button
              onClick={generateQuiz}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
            >
              🎯 Generate Quiz
            </button>

            <button
              onClick={generateFlashcards}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              🎴 Flashcards
            </button>
          </div>
        </div>
      )}

      {/* Summary View */}
      <Summary summary={summary} loadingSummary={loadingSummary} />

      {/* Notes View */}
      <Notes notes={notes} loadingNotes={loadingNotes} />

      {/* Quiz View */}
      <Quiz
        quizQuestions={quizQuestions}
        currentQuestion={currentQuestion}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        submitAnswer={submitAnswer}
        quizFinished={quizFinished}
        score={score}
        userAnswers={userAnswers}
        generateQuiz={generateQuiz}
        loadingQuiz={loadingQuiz}
      />

      {/* Flashcards View */}
      <Flashcards flashcards={flashcards} loadingFlashcards={loadingFlashcards} />

      {/* Chat View */}
      <Chat
        question={question}
        setQuestion={setQuestion}
        askQuestion={askQuestion}
        chatHistory={chatHistory}
      />

    </Dashboard>
  );
}

export default App;