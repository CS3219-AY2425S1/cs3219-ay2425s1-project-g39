import {
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';

import { useAuth } from '../../hooks/AuthProvider';

interface EditProfileModalProps {
  isEditProfileModalOpen: boolean;
  closeEditProfileModal: () => void;
  initialUsername: string;
}

function EditProfileModal({
  isEditProfileModalOpen,
  closeEditProfileModal,
  initialUsername,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [editProfileError, setEditProfileError] = useState<string | null>(null);

  const auth = useAuth();

  const handleSaveChanges = async () => {
    try {
      const updatedProfileData = { username, password };
      await auth.updateProfileAction(updatedProfileData, setEditProfileError);
      setEditProfileError(null);
      closeEditProfileModal();
    } catch (error) {
      console.error('Error saving profile changes:', error);
    }
  };

  return (
    <Modal
      opened={isEditProfileModalOpen}
      onClose={closeEditProfileModal}
      title="Edit Profile"
      centered
      overlayProps={{
        blur: 4,
      }}
    >
      <Stack gap="16px">
        <TextInput
          label="New Username"
          placeholder="Leave empty to keep the same"
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <PasswordInput
          label="New Password"
          placeholder="Leave empty to keep the same"
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Button onClick={handleSaveChanges}>Save Changes</Button>
        {editProfileError && <Text>{editProfileError}</Text>}
      </Stack>
    </Modal>
  );
}

export default EditProfileModal;
