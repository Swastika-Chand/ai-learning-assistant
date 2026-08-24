import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";

export default function Dashboard({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
  analytics,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100">

      <Header />

      <div className="flex">

        <Sidebar
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}
        />

        <div className="flex-1 p-6 overflow-y-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Documents" value={analytics?.documents || 0} />
            <StatsCard title="Quizzes" value={analytics?.quizzes || 0} />
            <StatsCard title="Flashcards" value={analytics?.flashcards || 0} />
            <StatsCard title="Avg Score" value={`${analytics?.avgScore || 0}%`} />
          </div>

          {children}

        </div>

      </div>

    </div>
  );
}