import { Code, ScrollArea, Stack, Textarea, Title } from '@mantine/core';

import { CodeOutput } from '../../types/CodeExecutionType';

interface CustomInputTabProps {
  inputValue: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  codeOutput?: CodeOutput;
}

function CustomInputTab({
  inputValue,
  setInput,
  codeOutput,
}: CustomInputTabProps) {
  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Stack p="16px" pb={0} gap="16px">
        <Title order={5}>Custom Input</Title>
        <Textarea
          value={inputValue}
          onChange={(event) => setInput(event.currentTarget.value)}
        />
        <Title order={5}>Output</Title>
        {codeOutput ? (
          <Code
            block
            color={
              codeOutput.isError ? 'var(--mantine-color-red-light)' : 'gray.9'
            }
          >
            {codeOutput.output}
          </Code>
        ) : (
          <Code block p="15px" color="gray.9"></Code>
        )}
      </Stack>
    </ScrollArea>
  );
}

export default CustomInputTab;
