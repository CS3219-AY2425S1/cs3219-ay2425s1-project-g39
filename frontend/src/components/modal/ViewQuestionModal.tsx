import {
  Badge,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';

import { Question } from '../../types/QuestionType';
import DifficultyBadge from '../badge/DifficultyBadge';

interface ViewQuestionModalProps {
  isViewQuestionModalOpened: boolean;
  closeViewQuestionModal: () => void;
  question: Question;
}

function ViewQuestionModal({
  isViewQuestionModalOpened,
  closeViewQuestionModal,
  question,
}: ViewQuestionModalProps) {
  return (
    <Modal
      opened={isViewQuestionModalOpened}
      onClose={closeViewQuestionModal}
      size="xl"
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
      scrollAreaComponent={ScrollArea.Autosize}
    >
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
    </Modal>
  );
}

export default ViewQuestionModal;
