import { Alert, Button, Modal, Stack, TextInput, Title } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

import { useAuth } from '../../hooks/AuthProvider';

interface ForgotPasswordModalProps {
  isForgotPasswordModalOpened: boolean;
  closeForgotPasswordModal: () => void;
}

function ForgotPasswordModal({
  isForgotPasswordModalOpened,
  closeForgotPasswordModal,
}: ForgotPasswordModalProps) {
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Invalid email'),
    },
  });

  const handleForgotPasswordClick = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await auth.forgotPasswordAction(values, setForgotPasswordError);
      handleCloseForgotPasswordModal();
    } catch (error) {
      console.error('Error! No email found!', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForgotPasswordModal = () => {
    form.reset();
    setForgotPasswordError(null);
    closeForgotPasswordModal();
  };

  return (
    <>
      <Modal
        opened={isForgotPasswordModalOpened}
        onClose={handleCloseForgotPasswordModal}
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 4,
        }}
      >
        <form onSubmit={form.onSubmit(handleForgotPasswordClick)}>
          <Stack p="16px">
            <Title order={3} ta="center">
              Forgot Password
            </Title>
            <TextInput
              {...form.getInputProps('email')}
              key={form.key('email')}
              placeholder="Email"
              disabled={loading}
            />
            {forgotPasswordError && (
              <Alert
                variant="light"
                title={forgotPasswordError}
                color="red"
                icon={<IconAlertCircle />}
              />
            )}
            <Button type="submit" loading={loading}>
              Forgot Password
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default ForgotPasswordModal;
