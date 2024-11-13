import { AppShell, Center, Group, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthProvider';

import Header from '../components/header/Header';
import FavoriteTopicsLayout from '../components/layout/dashboardLayout/FavoriteTopicsLayout';
import PracticeLayout from '../components/layout/dashboardLayout/PracticeNowLayout';
import ProgressLayout from '../components/layout/dashboardLayout/ProgressLayout';
import PracticeHistoryTable from '../components/table/PracticeHistoryTable';

import { PracticeHistoryItem, Progress } from '../types/History';
import { getPracticeHistory, getProgress } from '../apis/HistoryApis';

function Dashboard() {
  const auth = useAuth();
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryItem[]>([]);
  const [progress, setProgress] = useState<Progress>({
    difficultyCount: {
      Easy: { completed: 0, total: 0 },
      Medium: { completed: 0, total: 0 },
      Hard: { completed: 0, total: 0 },
    },
    topTopics: [],
  });

  useEffect(() => {
    // Fetch practice history
    if (!auth.userId) {
      return;
    }
    
    getPracticeHistory(auth.userId)
      .then((data: PracticeHistoryItem[]) => {
        setPracticeHistory(data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch progress
    getProgress(auth.userId)
      .then((data: Progress) => {
        setProgress(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);
  
  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <Header />

        <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
          <Center>
            <Stack h="100%" gap="20px" p="20px">
              <Group gap="20px" align="stretch">
                <ProgressLayout progress={progress}/>
                <FavoriteTopicsLayout progress={progress}/>
                <PracticeLayout />
              </Group>
              <PracticeHistoryTable attempts={practiceHistory}/>
            </Stack>
          </Center>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default Dashboard;