import { AppShell, Avatar, Group, Title, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppShell.Header px="40px" pt="16px" bg="slate.9">
      <Group justify="space-between">
        <Group gap="48px">
          <Link to="../dashboard">
            <Title c="white">PeerPrep</Title>
          </Link>
          <Link to="../admin">
            <Title c="white" fz="lg">Questions</Title>
          </Link>
        </Group>
        <Link to="../profile">
          <UnstyledButton>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              radius="xl"
            />
          </UnstyledButton>
        </Link>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
