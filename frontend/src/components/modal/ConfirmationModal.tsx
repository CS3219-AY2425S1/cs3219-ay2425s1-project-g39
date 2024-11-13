import { Button, Group, Modal, Stack, Text } from '@mantine/core';

interface ConfirmationModalProps {
  isConfirmationModalOpened: boolean;
  closeConfirmationModal: () => void;
  handleConfirmation: () => void;
  description: string;
  confirmationButtonLabel: string;
  confirmationButtonColor: string;
}

function ConfirmationModal({
  isConfirmationModalOpened,
  closeConfirmationModal,
  handleConfirmation,
  description,
  confirmationButtonLabel,
  confirmationButtonColor,
}: ConfirmationModalProps) {
  const handleConfirmButtonClick = () => {
    closeConfirmationModal();
    handleConfirmation();
  };

  return (
    <Modal
      opened={isConfirmationModalOpened}
      onClose={closeConfirmationModal}
      withCloseButton={false}
      title="Hang on!"
      centered
      overlayProps={{
        blur: 4,
      }}
      styles={{ title: { fontWeight: 700 } }}
    >
      <Stack>
        <Text>{description}</Text>
        <Group justify="flex-end">
          <Button
            variant="light"
            color={confirmationButtonColor}
            onClick={handleConfirmButtonClick}
          >
            {confirmationButtonLabel}
          </Button>
          <Button variant="light" color="gray" onClick={closeConfirmationModal}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ConfirmationModal;
