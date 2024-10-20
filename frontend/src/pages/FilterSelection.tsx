import {
  AppShell,
  Button,
  Card,
  Container,
  Group,
  MultiSelect,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/notifications/styles.css';
import { useState } from 'react';

import MatchingModal from '../components/modal/MatchingModal';

const difficulties = ['Easy', 'Medium', 'Hard'];
const topics = [
  'Strings',
  'Algorithms',
  'Bit Manipulation',
  'Data Structures',
  'Recursion',
  'Databases',
  'Arrays',
  'Brainteaser',
];

function Filter() {
  const [filterDifficulty, setFilterDifficulty] = useState<string[]>([]);
  const [filterTopic, setFilterTopic] = useState<string[]>([]);
  const [
    isMatchingModalOpened,
    { open: openMatchingModal, close: closeMatchingModal },
  ] = useDisclosure(false);

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <AppShell.Header px="40px" py="16px" bg="slate.8">
          <Group justify="space-between">
            <a href="." className="logo">
              <Title c="white">PeerPrep</Title>
            </a>
            <Button>Log In</Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main
          h="calc(100vh - 80px)"
          w="100%"
          bg="slate.9"
          style={{ overflowY: 'auto' }}
        >
          <Container mt="xl" size="50%">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={2}>Start Your Collaboration</Title>
              <Stack justify="apart" mb="md">
                <MultiSelect
                  description="Difficulty"
                  clearable
                  placeholder={
                    filterDifficulty.length > 0 ? '' : 'Select Difficulty'
                  }
                  data={difficulties}
                  value={filterDifficulty}
                  onChange={setFilterDifficulty}
                  style={{ width: '300px' }}
                />
                <MultiSelect
                  description="Topic"
                  clearable
                  placeholder={filterTopic.length > 0 ? '' : 'Select Topic'}
                  data={topics}
                  value={filterTopic}
                  onChange={setFilterTopic}
                  style={{ width: '300px' }}
                />
              </Stack>
              <Button variant="light" onClick={openMatchingModal}>
                Search
              </Button>
            </Card>
          </Container>
        </AppShell.Main>
      </AppShell>

      <MatchingModal
        isMatchingModalOpened={isMatchingModalOpened}
        closeMatchingModal={closeMatchingModal}
        difficulty={
          filterDifficulty.length > 0 ? filterDifficulty : difficulties
        }
        topics={filterTopic.length > 0 ? filterTopic : topics}
      />
    </>
  );
}

export default Filter;
