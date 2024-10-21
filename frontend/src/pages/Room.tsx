import { Group, Skeleton, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';

import CodeEditor from '../components/layout/codeEditor/CodeEditor';
import LeaveSessionModal from '../components/modal/LeaveSessionModal';
import RoomTabs from '../components/tabs/RoomTabs';

function Room() {
  const [
    isLeaveSessionModalOpened,
    { open: openLeaveSessionModal, close: closeLeaveSessionModal },
  ] = useDisclosure(false);

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <Skeleton h="150px" w="calc(50% - 5px)" />
            <Skeleton h="150px" w="calc(50% - 5px)" />
          </Group>
          <RoomTabs />
        </Stack>

        <CodeEditor openLeaveSessionModal={openLeaveSessionModal} />
      </Group>

      <LeaveSessionModal
        isLeaveSessionModalOpened={isLeaveSessionModalOpened}
        closeLeaveSessionModal={closeLeaveSessionModal}
      />
    </>
  );
}

export default Room;
