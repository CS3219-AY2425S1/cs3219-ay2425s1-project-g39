import { Tabs } from '@mantine/core';

import { Question } from '../../types/QuestionType';
import ChatBoxTab from './ChatBoxTab';
import { ChatMessage } from './ChatBoxTab';
import DescriptionTab from './DescriptionTab';

interface RoomTabsProps {
  question?: Question;
  sessionId: string;
  token: string;
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

function RoomTabs({
  question,
  sessionId,
  token,
  messages,
  input,
  setInput,
  sendMessage,
}: RoomTabsProps) {
  return (
    <Tabs
      defaultValue="description"
      h="calc(100% - 160px)"
      bg="slate.9"
      p="10px"
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
        <Tabs.Tab value="chat">Chat</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab question={question} />
      </Tabs.Panel>
      <Tabs.Panel value="chat" h="calc(100% - 36px)">
        <ChatBoxTab
          roomId={sessionId}
          token={token}
          messages={messages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </Tabs.Panel>
    </Tabs>
  );
}

export default RoomTabs;
