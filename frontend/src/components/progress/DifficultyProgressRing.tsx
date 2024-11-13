import { RingProgress, Stack, Text } from '@mantine/core';

interface DifficultyProgressRingProps {
  difficulty: string;
  solvedQuestions: number;
  totalQuestions: number;
}

function DifficultyProgressRing({
  difficulty,
  solvedQuestions,
  totalQuestions,
}: DifficultyProgressRingProps) {
  const difficultyColors: { [difficulty: string]: string } = {
    Easy: 'green.6',
    Medium: 'yellow.6',
    Hard: 'red.5',
  };

  const color = difficultyColors[difficulty] ?? 'white';

  return (
    <Stack align="center" gap={0}>
      <RingProgress
        size={130}
        label={
          <Text ta="center">
            <Text span size="xl" fw={700}>
              {solvedQuestions}
            </Text>
            /{totalQuestions}
          </Text>
        }
        thickness={16}
        roundCaps
        sections={[
          { value: (solvedQuestions / totalQuestions) * 100, color: color },
        ]}
      />
      <Text>{difficulty}</Text>
    </Stack>
  );
}

export default DifficultyProgressRing;
