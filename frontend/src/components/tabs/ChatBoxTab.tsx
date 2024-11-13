import { Box, Textarea, ScrollArea, Text, Paper } from '@mantine/core';
import { useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthProvider';

export interface ChatMessage {
  userId: string;
  body: string;
}

interface ChatBoxTabProps {
  roomId: string;
  token: string;
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

const ChatBoxTab = ({ messages, input, setInput, sendMessage }: ChatBoxTabProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px' }}>
      <ScrollArea style={{ flexGrow: 1, marginBottom: '10px', padding: '10px' }} viewportRef={scrollAreaRef}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
              position: 'relative'
            }}
          >
            <Paper
            shadow="sm"
            p="8px 12px"
            style={{
            maxWidth: '350px',
            borderRadius: '16px',
            backgroundColor: msg.userId === userId ? '#964ee2' : '#2c2533',
            color: msg.userId === userId ? '#fff8f9' : '#faf6f9',
            position: 'relative',
            padding: '12px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            }}
            >
              <Text size="sm" style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              }}>
                {msg.body}
              </Text>
            </Paper>
          </Box>
        ))}
      </ScrollArea>
      <Textarea
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        minRows={1}
        maxRows={5}
        autosize
      />
    </Box>
  );
};

export default ChatBoxTab;
