interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function UseCaseCard({
  icon,
  title,
  description,
}: UseCaseCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
