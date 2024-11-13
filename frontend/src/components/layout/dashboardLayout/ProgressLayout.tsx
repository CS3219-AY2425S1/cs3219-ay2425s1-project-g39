import { Group } from '@mantine/core';

import DifficultyProgressRing from '../../progress/DifficultyProgressRing';

import { Progress } from '../../../types/History';

function ProgressLayout({ progress }: { progress: Progress }) {
  return (
    <Group p="20px" bg="slate.8" gap="10px" style={{ borderRadius: '4px' }}>
      <DifficultyProgressRing
        difficulty="Easy"
        solvedQuestions={progress.difficultyCount.Easy.completed}
        totalQuestions={progress.difficultyCount.Easy.total}
      />
      <DifficultyProgressRing
        difficulty="Medium"
        solvedQuestions={progress.difficultyCount.Medium.completed}
        totalQuestions={progress.difficultyCount.Medium.total}
      />
      <DifficultyProgressRing
        difficulty="Hard"
        solvedQuestions={progress.difficultyCount.Hard.completed}
        totalQuestions={progress.difficultyCount.Hard.total}
      />
    </Group>
  );
}

export default ProgressLayout;
