import { Badge } from '@mantine/core';
import '@mantine/core/styles.css';

interface DescriptionTabProps {
  difficulty: string;
}

function DifficultyBadge({ difficulty }: DescriptionTabProps) {
  const difficultyColors: { [difficulty: string]: string } = {
    Easy: 'green.6',
    Medium: 'yellow.6',
    Hard: 'red.5',
  };

  const color = difficultyColors[difficulty] ?? 'white';

  return (
    <Badge variant="light" color="gray" c={color}>
      {difficulty}
    </Badge>
  );
}

export default DifficultyBadge;
