import {
  ActionIcon,
  AppShell,
  Avatar,
  Group,
  Menu,
  Space,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconHelpHexagon, IconSettings } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/AuthProvider';
import classes from './Header.module.css';

function Header() {
  const auth = useAuth();

  return (
    <AppShell.Header px="40px" bg="slate.9">
      <Group h="100%" justify="space-between" gap="20px">
        <Link to="../dashboard" className="logo">
          <Title c="white">PeerPrep</Title>
        </Link>
        <Space style={{ flexGrow: 1 }} />
        {auth.userProfile?.isAdmin && (
          <Menu
            shadow="md"
            width={225}
            position="bottom-end"
            trigger="hover"
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="white" aria-label="Settings">
                <IconSettings size="32px" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown classNames={{ dropdown: classes.dropdown }}>
              <Menu.Label>Admin</Menu.Label>
              <Menu.Item leftSection={<IconHelpHexagon />}>
                <Link to="../admin">
                  <Text c="white" fz="14px">
                    Manage Questions
                  </Text>
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
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
