import {
  Badge,
  Group,
  ScrollArea,
  Stack,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import '@mantine/core/styles.css';

import DifficultyBadge from '../badge/DifficultyBadge';

interface DescriptionTabProps {
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
}

function DescriptionTab({
  title,
  difficulty,
  topics,
  description,
}: DescriptionTabProps) {
  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Stack p="16px" gap="16px">
        <Title order={2}>{title}</Title>
        <Group gap="10px">
          <DifficultyBadge difficulty={difficulty} />
          {topics.map((topic, i) => (
            <Badge key={i} variant="light" color="gray">
              {topic}
            </Badge>
          ))}
        </Group>
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </TypographyStylesProvider>
      </Stack>
    </ScrollArea>
  );
}

export default DescriptionTab;
