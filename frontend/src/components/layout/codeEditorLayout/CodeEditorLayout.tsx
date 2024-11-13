import { Button, Group, Select, Space, Stack } from '@mantine/core';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { langs } from '@uiw/codemirror-extensions-langs';
import { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useState } from 'react';

import { SupportedLanguage } from '../../../types/CodeExecutionType';
import CodeEditor from '../../codeEditor/CodeEditor';
import classes from './CodeEditorLayout.module.css';

interface CodeEditorLayoutProps {
  openLeaveSessionModal: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  handleLanguageChange: (language: SupportedLanguage) => void;
  handleRunCode: () => void;
  isRunningCode: boolean;
  viewUpdateRef: React.MutableRefObject<ViewUpdate | null>;
}

const supportedLanguages: SupportedLanguage[] = ['python', 'javascript', 'cpp'];

function CodeEditorLayout({
  openLeaveSessionModal,
  code,
  setCode,
  language,
  handleLanguageChange,
  isRunningCode,
  handleRunCode,
  viewUpdateRef,
}: CodeEditorLayoutProps) {
  const [extensions, setExtensions] = useState<Extension[]>([
    langs['python'](),
  ]);

  const handleLanguageSelect = (newLanguage: SupportedLanguage) => {
    if (langs[newLanguage]) {
      setExtensions([langs[newLanguage]()]);
      handleLanguageChange(newLanguage);
    }
  };

  return (
    <Stack
      h="100%"
      w="100%"
      gap={0}
      bg="slate.9"
      style={{ borderRadius: '4px' }}
    >
      <Group
        p="10px"
        style={{
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottom: 'solid 2px var(--mantine-color-dark-4)',
        }}
      >
        <Select
          variant="unstyled"
          data={supportedLanguages}
          value={language}
          onChange={(e) => handleLanguageSelect(e as SupportedLanguage)}
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
          loading={isRunningCode}
          leftSection={<IconPlayerPlayFilled size={14} />}
          onClick={handleRunCode}
        >
          Run Code
        </Button>
        <Space style={{ flexGrow: 1 }} />
        <Button variant="light" color="red" onClick={openLeaveSessionModal}>
          End Session
        </Button>
      </Group>

      <CodeEditor
        code={code}
        setCode={setCode}
        extensions={extensions}
        viewUpdateRef={viewUpdateRef}
      />
    </Stack>
  );
}

export default CodeEditorLayout;
