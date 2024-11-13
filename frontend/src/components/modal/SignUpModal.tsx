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
import {
  hasLength,
  isEmail,
  isNotEmpty,
  matchesField,
  useForm,
} from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

import { register } from '../../apis/AuthApi';
import { useAuth } from '../../hooks/AuthProvider';

interface SignUpModalProps {
  isSignUpModalOpened: boolean;
  closeSignUpModal: () => void;
  openLoginModal: () => void;
}

function SignUpModal({
  isSignUpModalOpened,
  closeSignUpModal,
  openLoginModal,
}: SignUpModalProps) {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const auth = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      username: isNotEmpty('Username cannot be empty'),
      password: hasLength(
        { min: 5 },
        'Password must have 5 or more characters',
      ),
      passwordConfirmation: matchesField('password', 'Password does not match'),
    },
  });

  const handleCloseSignUpModal = () => {
    form.reset();
    setSignUpError(null);
    closeSignUpModal();
  };

  const handleSignUpClick = (values: typeof form.values) => {
    const { email, password } = values;
    register(values).then(
      () => {
        auth.loginAction({ email, password }, setSignUpError);
      },
      (error: any) => {
        setSignUpError(error);
      },
    );
  };

  const handleLogInClick = () => {
    handleCloseSignUpModal();
    openLoginModal();
  };

  return (
    <Modal
      opened={isSignUpModalOpened}
      onClose={handleCloseSignUpModal}
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
    >
      <form onSubmit={form.onSubmit(handleSignUpClick)}>
        <Stack p="16px">
          <Title order={3} ta="center">
            Sign up now
          </Title>
          <TextInput
            {...form.getInputProps('email')}
            key={form.key('email')}
            placeholder="Email"
          />
          <TextInput
            {...form.getInputProps('username')}
            key={form.key('username')}
            placeholder="Username"
          />
          <PasswordInput
            {...form.getInputProps('password')}
            key={form.key('password')}
            placeholder="Password"
          />
          <PasswordInput
            {...form.getInputProps('passwordConfirmation')}
            key={form.key('passwordConfirmation')}
            placeholder="Confirm password"
          />
          {signUpError && (
            <Alert
              variant="light"
              title={signUpError}
              color="red"
              icon={<IconAlertCircle />}
            />
          )}
          <Button type="submit">Sign up</Button>
          <Text ta="center">
            Already have an account?{' '}
            <UnstyledButton onClick={handleLogInClick} fw={700}>
              Log in now
            </UnstyledButton>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}

export default SignUpModal;
