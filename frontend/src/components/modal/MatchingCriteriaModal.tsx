import { Button, Modal, MultiSelect, Stack, Title } from '@mantine/core';
import { useState } from 'react';

import { difficulties, topics } from '../../constants/Question';

interface MatchingCriteriaModalProps {
  isMatchingCriteriaModalOpened: boolean;
  closeMatchingCriteriaModal: () => void;
  findMatch: (difficulties: string[], topics: string[]) => void;
}

function MatchingCriteriaModal({
  isMatchingCriteriaModalOpened,
  closeMatchingCriteriaModal,
  findMatch,
}: MatchingCriteriaModalProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState<string[]>([]);
  const handleFindMatchClick = () => {
    closeMatchingCriteriaModal();
    findMatch(
      difficultyFilter.length > 0 ? difficultyFilter : difficulties,
      topicFilter.length > 0 ? topicFilter : topics,
    );
  };

  return (
    <Modal
      opened={isMatchingCriteriaModalOpened}
      onClose={closeMatchingCriteriaModal}
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
    >
      <Stack p="16px">
        <Title order={3} ta="center">
          Find Your Interview Partner
        </Title>
        <MultiSelect
          description="Difficulty"
          clearable
          placeholder={difficultyFilter.length > 0 ? '' : 'Difficulty'}
          data={difficulties}
          value={difficultyFilter}
          onChange={setDifficultyFilter}
        />
        <MultiSelect
          description="Topic"
          clearable
          placeholder={topicFilter.length > 0 ? '' : 'Topic'}
          data={topics}
          value={topicFilter}
          onChange={setTopicFilter}
        />
        <Button onClick={handleFindMatchClick}>Find Match</Button>
      </Stack>
    </Modal>
  );
}

export default MatchingCriteriaModal;
