import { Button, Group, Modal, Stack, Text } from '@mantine/core';

interface LeaveSessionModalProps {
  isLeaveSessionModalOpened: boolean;
  closeLeaveSessionModal: () => void;
}

function LeaveSessionModal({
  isLeaveSessionModalOpened,
  closeLeaveSessionModal,
}: LeaveSessionModalProps) {
  return (
    <Modal
      opened={isLeaveSessionModalOpened}
      onClose={closeLeaveSessionModal}
      withCloseButton={false}
      title="Hang on!"
      centered
      overlayProps={{
        blur: 4,
      }}
      styles={{ title: { fontWeight: 700 } }}
    >
      <Stack>
        <Text>Are you sure you want to leave this session?</Text>
        <Group justify="flex-end">
          <Button variant="light" color="red" onClick={closeLeaveSessionModal}>
            Leave
          </Button>
          <Button variant="light" color="gray" onClick={closeLeaveSessionModal}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default LeaveSessionModal;
