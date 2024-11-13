import {
  AppShell,
  Avatar,
  Button,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';

import Header from '../components/header/Header';
import EditProfileModal from '../components/modal/EditProfileModal';
import { useAuth } from '../hooks/AuthProvider';

function Profile() {
  const [
    isEditProfileModalOpened,
    { open: openEditProfileModal, close: closeEditProfileModal },
  ] = useDisclosure(false);
  const auth = useAuth();

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <Header />
        <AppShell.Main
          h="calc(100vh - 80px)"
          w="100%"
          bg="slate.9"
          style={{ overflowY: 'auto' }}
        >
          <Container size="sm">
            <Stack
              align="stretch"
              bg="slate.8"
              p="20px"
              gap="20px"
              style={{ borderRadius: '4px' }}
            >
              <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                size="lg"
                style={{ alignSelf: 'center' }}
              />

              <Stack justify="md">
                <Title order={4}>Username</Title>
                <Text>{auth.userProfile?.username ?? ''}</Text>
                <Title order={4}>Email</Title>
                <Text>{auth.userProfile?.email ?? ''}</Text>
                <Title order={4}>Last Login</Title>
                <Text>
                  {new Date(auth.userProfile?.lastLogin ?? '').toLocaleString()}
                </Text>
                <Button onClick={openEditProfileModal}>Edit Profile</Button>
                <Button variant="light" color="red" onClick={auth.logOutAction}>
                  Log Out
                </Button>
              </Stack>
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>

      <EditProfileModal
        isEditProfileModalOpen={isEditProfileModalOpened}
        closeEditProfileModal={closeEditProfileModal}
        initialUsername={auth.userProfile?.username ?? ''}
      />
    </>
  );
}

export default Profile;
