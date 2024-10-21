import { Box, Button, Group, Select, Space, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { useState } from 'react';

import classes from './CodeEditor.module.css';

interface CodeEditorProps {
  openLeaveSessionModal: () => void;
}

const languages = ['Python 3', 'Java', 'TypeScript'];

function CodeEditor({ openLeaveSessionModal }: CodeEditorProps) {
  const [language, setLanguage] = useState<string | null>('Python 3');

  return (
    <Stack h="100%" w="calc(100% - 510px)" gap={0} bg="slate.9" p="10px">
      <Group
        pb="10px"
        style={{
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottom: 'solid 2px var(--mantine-color-dark-4)',
        }}
      >
        <Select
          variant="unstyled"
          data={languages}
          value={language}
          onChange={setLanguage}
          defaultValue="Python 3"
          allowDeselect={false}
          withCheckIcon={false}
          comboboxProps={{
            shadow: 'md',
            offset: 0,
            transitionProps: { transition: 'fade-down', duration: 200 },
          }}
          classNames={{
            input: classes.input,
            dropdown: classes.dropdown,
            option: classes.option,
          }}
        />
        <Button
          variant="light"
          leftSection={<IconPlayerPlayFilled size={14} />}
        >
          Run Code
        </Button>
        <Space style={{ flexGrow: 1 }} />
        <Button variant="light" color="red" onClick={openLeaveSessionModal}>
          End Session
        </Button>
      </Group>

      {/* TODO: Replace with code editor */}
      <Box
        h="100%"
        style={{
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        }}
      ></Box>
    </Stack>
  );
}

export default CodeEditor;
