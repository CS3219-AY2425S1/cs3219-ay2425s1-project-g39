import {
  Alert,
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

import { useAuth } from '../../hooks/AuthProvider';
import ForgotPasswordModal from './ForgotPasswordModal';

interface LoginModalProps {
  isLoginModalOpened: boolean;
  closeLoginModal: () => void;
  openSignUpModal: () => void;
}

function LoginModal({
  isLoginModalOpened,
  closeLoginModal,
  openSignUpModal,
}: LoginModalProps) {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [
    isForgotPasswordModalOpened,
    { open: openForgotPasswordModal, close: closeForgotPasswordModal },
  ] = useDisclosure(false);
  const auth = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('Password cannot be empty'),
    },
  });

  const handleCloseLoginModal = () => {
    form.reset();
    setLoginError(null);
    closeLoginModal();
  };

  const handleLogInClick = (values: typeof form.values) => {
    auth.loginAction(values, setLoginError);
  };

  const handleSignUpClick = () => {
    handleCloseLoginModal();
    openSignUpModal();
  };

  const handleForgotPassword = () => {
    handleCloseLoginModal();
    openForgotPasswordModal();
  };

  return (
    <>
      <Modal
        opened={isLoginModalOpened}
        onClose={handleCloseLoginModal}
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 4,
        }}
      >
        <form onSubmit={form.onSubmit(handleLogInClick)}>
          <Stack p="16px">
            <Title order={3} ta="center">
              Login
            </Title>
            <TextInput
              {...form.getInputProps('email')}
              key={form.key('email')}
              placeholder="Email"
            />
            <PasswordInput
              {...form.getInputProps('password')}
              key={form.key('password')}
              placeholder="Password"
            />
            {loginError && (
              <Alert
                variant="light"
                title={loginError}
                color="red"
                icon={<IconAlertCircle />}
              />
            )}
            <Button type="submit">Log in</Button>
            <Text ta="center">
              Don't have an account yet?{' '}
              <UnstyledButton onClick={handleSignUpClick} fw={700}>
                Sign up now
              </UnstyledButton>
            </Text>
            <UnstyledButton ta="center" onClick={handleForgotPassword} fw={700}>
              Forgot Password?
            </UnstyledButton>
          </Stack>
        </form>
      </Modal>

      <ForgotPasswordModal
        isForgotPasswordModalOpened={isForgotPasswordModalOpened}
        closeForgotPasswordModal={closeForgotPasswordModal}
      />
    </>
  );
}

export default LoginModal;
