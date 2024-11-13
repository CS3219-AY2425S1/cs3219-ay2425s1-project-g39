import { Button, Modal, RingProgress, Stack, Text, Title } from '@mantine/core';

interface MatchingModalProps {
  isMatchingModalOpened: boolean;
  closeMatchingModal: () => void;
  displayTimer: number;
  timeoutTime: number;
}

function MatchingModal({
  isMatchingModalOpened,
  closeMatchingModal,
  displayTimer,
  timeoutTime,
}: MatchingModalProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Modal
        opened={isMatchingModalOpened}
        onClose={closeMatchingModal}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 4,
        }}
      >
        <Stack align="center" p="16px">
          <Title order={3} ta="center">
            Matching...
          </Title>
          <RingProgress
            size={130}
            label={<Text ta="center">{formatTime(displayTimer)}</Text>}
            thickness={12}
            roundCaps
            sections={[
              { value: (displayTimer / timeoutTime) * 100, color: 'indigo.6' },
            ]}
          />
          <Button variant="light" color="gray" onClick={closeMatchingModal}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default MatchingModal;
