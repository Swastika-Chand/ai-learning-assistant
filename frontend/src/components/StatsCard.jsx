export default function StatsCard({
  title,
  value,
}) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}