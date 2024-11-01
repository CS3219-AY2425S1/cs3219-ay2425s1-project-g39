import { Button, Group, Select, Space, Stack } from '@mantine/core';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { langs } from '@uiw/codemirror-extensions-langs';
import { Extension, ViewUpdate } from '@uiw/react-codemirror';
import { useState } from 'react';
import CodeEditor from '../../codeEditor/CodeEditor';
import classes from './CodeEditorLayout.module.css';

interface CodeEditorLayoutProps {
  openLeaveSessionModal: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  viewUpdateRef: React.MutableRefObject<ViewUpdate | null>;
  fakeCursorPositionRef: React.MutableRefObject<number>;
}

type SupportedLanguage = Extract<keyof typeof langs, 'python' | 'java'>;
const supportedLanguages: SupportedLanguage[] = ['python', 'java'];

function CodeEditorLayout({
  openLeaveSessionModal,
  code,
  setCode,
  viewUpdateRef,
  fakeCursorPositionRef, 
}: CodeEditorLayoutProps) {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [extensions, setExtensions] = useState<Extension[]>([
    langs['python'](),
  ]);

  const handleLanguageChange = (language: SupportedLanguage) => {
    if (langs[language]) {
      setExtensions([langs[language]()]);
      setLanguage(language);
    }
  };

  return (
    <Stack
      h="100%"
      w="calc(100% - 510px)"
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
          onChange={(e) => handleLanguageChange(e as SupportedLanguage)}
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
        <Button leftSection={<IconPlayerPlayFilled size={14} />}>
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
        fakeCursorPositionRef={fakeCursorPositionRef} // Pass fakeCursorPosition to CodeEditor
      />
    </Stack>
  );
}

export default CodeEditorLayout;
