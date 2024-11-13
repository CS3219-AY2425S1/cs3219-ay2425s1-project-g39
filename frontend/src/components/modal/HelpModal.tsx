import { Modal, Title } from '@mantine/core';

interface HelpModalProps {
  isHelpModalOpened: boolean;
  closeHelpModal: () => void;
}

function HelpModal({ isHelpModalOpened, closeHelpModal }: HelpModalProps) {
  return (
    <Modal
      opened={isHelpModalOpened}
      onClose={closeHelpModal}
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
    >
      <Title order={3} ta="center">
        Getting Started
      </Title>
    </Modal>
  );
}

export default HelpModal;
