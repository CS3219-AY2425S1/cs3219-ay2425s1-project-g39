import { Button, Group, Modal, Space, Stack, Text } from '@mantine/core';

interface RejoinSessionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  rejoinSession: () => void;
  startNewMatch: () => void;
}

function RejoinSessionModal({
  isOpen,
  closeModal,
  rejoinSession,
  startNewMatch,
}: RejoinSessionModalProps) {
  const handleRejoinButtonClick = () => {
    closeModal();
    rejoinSession();
  };

  const handleStartNewMatchButtonClick = () => {
    closeModal();
    startNewMatch();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={closeModal}
      withCloseButton={false}
      title="Hang on!"
      centered
      overlayProps={{
        blur: 4,
      }}
      styles={{ title: { fontWeight: 700 } }}
    >
      <Stack>
        <Text>
          You have an existing practice room. Do you want to rejoin the existing
          room?
        </Text>
        <Group>
          <Button variant="light" onClick={handleRejoinButtonClick}>
            Rejoin
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={handleStartNewMatchButtonClick}
          >
            Start New Match
          </Button>
          <Space style={{ flexGrow: 1 }} />
          <Button variant="light" color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default RejoinSessionModal;
