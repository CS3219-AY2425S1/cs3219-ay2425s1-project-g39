import {
  Badge,
  Group,
  ScrollArea,
  Stack,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';

import { Question } from '../../types/QuestionType';
import DifficultyBadge from '../badge/DifficultyBadge';

interface DescriptionTabProps {
  question?: Question;
}

function DescriptionTab({ question }: DescriptionTabProps) {
  return (
    <ScrollArea h="100%" offsetScrollbars>
      {question && (
        <Stack p="16px" gap="16px">
          <Title order={2}>{question.title}</Title>
          <Group gap="10px">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.topics.map((topic, i) => (
              <Badge key={i} variant="light" color="gray">
                {topic}
              </Badge>
            ))}
          </Group>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </TypographyStylesProvider>
        </Stack>
      )}
    </ScrollArea>
  );
}

export default DescriptionTab;
