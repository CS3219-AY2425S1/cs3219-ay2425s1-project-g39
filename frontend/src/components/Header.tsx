import {
  AppShell,
  Avatar,
  Group,
  Title,
  UnstyledButton,
} from '@mantine/core';

function Header() {
  return (
    <AppShell.Header px="40px" pt="20px" bg="slate.9">
      <Group justify="space-between">
        <a href="." className="logo">
          <Title c="white">PeerPrep</Title>
        </a>
        <UnstyledButton>
          <Group>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              radius="xl"
            />
          </Group>
        </UnstyledButton>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
