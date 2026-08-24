export default function Sidebar({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
}) {
  return (
    <div className="w-64 bg-slate-900 text-white p-5 min-h-screen">
      <h2 className="text-xl font-bold mb-5">
        Workspaces
      </h2>

      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          onClick={() =>
            setSelectedWorkspace(workspace)
          }
          className={`w-full text-left p-3 mb-2 rounded ${
            selectedWorkspace?.id === workspace.id
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >
          {workspace.name}
        </button>
      ))}
    </div>
  );
}