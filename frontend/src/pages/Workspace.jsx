export default function Workspace({
  selectedWorkspace,
}) {
  if (!selectedWorkspace)
    return (
      <div className="bg-white p-6 rounded shadow">
        Select a workspace
      </div>
    );

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-2xl font-bold">
        {selectedWorkspace.name}
      </h2>
    </div>
  );
}