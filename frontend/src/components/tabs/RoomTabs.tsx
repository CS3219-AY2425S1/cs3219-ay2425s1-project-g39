import { Container, Tabs } from '@mantine/core';
import '@mantine/core/styles.css';

function RoomTabs() {
  return (
    <Tabs
      defaultValue="description"
      h="calc(100% - 160px)"
      bg="slate.9"
      p="10px"
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
        <Tabs.Tab value="notes">Notes</Tabs.Tab>
        <Tabs.Tab value="output">Output</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description">
        <Container p="16px">description</Container>
      </Tabs.Panel>
      <Tabs.Panel value="notes">
        <Container p="16px">Notes</Container>
      </Tabs.Panel>
      <Tabs.Panel value="output">
        <Container p="16px">Output</Container>
      </Tabs.Panel>
    </Tabs>
  );
}

export default RoomTabs;
