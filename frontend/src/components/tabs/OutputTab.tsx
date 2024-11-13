import { Center, Code, ScrollArea } from '@mantine/core';

import { CodeOutput } from '../../types/CodeExecutionType';

interface OutputTabProps {
  codeOutput?: CodeOutput;
}

function OutputTab({ codeOutput }: OutputTabProps) {
  return (
    <>
      {codeOutput ? (
        <ScrollArea h="100%" p="16px" offsetScrollbars>
          <Code
            block
            color={
              codeOutput.isError ? 'var(--mantine-color-red-light)' : 'gray.9'
            }
          >
            {codeOutput.output}
          </Code>
        </ScrollArea>
      ) : (
        <Center h="100%">Run your code first the see the output.</Center>
      )}
    </>
  );
}

export default OutputTab;
