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
    <div className="use-case-card">
      <div className="feature-icon mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
