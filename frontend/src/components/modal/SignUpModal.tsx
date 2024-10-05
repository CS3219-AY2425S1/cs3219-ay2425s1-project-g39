import {
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { isEmail, isNotEmpty, matchesField, useForm } from '@mantine/form';

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
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('Password cannot be empty'),
      passwordConfirmation: matchesField('password', 'Password does not match'),
    },
  });

  const handleLogInClick = () => {
    closeSignUpModal();
    openLoginModal();
  };

  return (
    <Modal
      opened={isSignUpModalOpened}
      onClose={closeSignUpModal}
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack p="16px">
          <Title order={3} ta="center">
            Sign up now
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
          <PasswordInput
            {...form.getInputProps('passwordConfirmation')}
            key={form.key('passwordConfirmation')}
            placeholder="Confirm password"
          />
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
