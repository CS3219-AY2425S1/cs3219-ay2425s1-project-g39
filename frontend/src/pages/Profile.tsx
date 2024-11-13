import {
  AppShell,
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import Header from '../components/header/Header';
import EditProfileModal from '../components/modal/EditProfileModal';
import { useAuth } from '../hooks/AuthProvider';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [
    isEditProfileModalOpened,
    { open: openEditProfileModal, close: closeEditProfileModal },
  ] = useDisclosure(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const auth = useAuth();

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        console.log('Fetching Profile');
        await auth.getProfileAction(setProfileError);
      } catch (error) {
        console.error('Error fetching profile:', profileError);
      }
    }
    if (!auth.userProfile) {
      fetchProfile();
    } else {
      setEmail(auth.userProfile.email);
      setUsername(auth.userProfile.username);
      setLastLogin(auth.userProfile.lastLogin);
    }
  }, [auth.userProfile]);

  const handleLogoutAction = () => {
    auth.logOutAction();
  };

  const openEditModal = () => {
    openEditProfileModal();
  };

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
          <Container size="sm" py="xl">
            <Paper shadow="md" p="xl" withBorder>
              <Group justify="center" mb="xl">
                <Title order={2}>{username}</Title>
                <Avatar
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                  radius="xl"
                />
                <Button onClick={openEditModal}>Edit Profile</Button>
              </Group>

              <Stack justify="md">
                <Paper withBorder p="md">
                  <Title order={4} mb="xs">
                    Email
                  </Title>
                  <Text>{email}</Text>
                </Paper>
                <Paper withBorder p="md">
                  <Title order={4} mb="xs">
                    Last Login
                  </Title>
                  <Text>{new Date(lastLogin).toLocaleString()}</Text>
                </Paper>
                <Button onClick={handleLogoutAction}>Log Out</Button>
              </Stack>
            </Paper>
          </Container>
        </AppShell.Main>
      </AppShell>

      <EditProfileModal
        isEditProfileModalOpen={isEditProfileModalOpened}
        closeEditProfileModal={closeEditProfileModal}
        initialUsername={username}
      />
    </>
  );
}

export default Profile;
