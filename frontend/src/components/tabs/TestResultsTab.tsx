import { Center, Code, ScrollArea, Stack, Tabs, Title } from '@mantine/core';

import { TestResult } from '../../types/CodeExecutionType';

interface TestResultsTabProps {
  testResults?: TestResult[];
}

function TestResultsTab({ testResults }: TestResultsTabProps) {
  const testResultPanel = (testResult: TestResult) => {
    const isCorrect = testResult.answer.trim() === testResult.output.trim();

    return (
      <Stack p="16px" pb={0} gap="16px">
        {isCorrect ? (
          <Title order={3} c="green.6">
            Accepted
          </Title>
        ) : (
          <Title order={3} c="red.5">
            {testResult.isError ? 'Error' : 'Wrong Answer'}
          </Title>
        )}
        <Title order={5}>Input</Title>
        <Code block color="gray.9">
          {testResult.input}
        </Code>
        <Title order={5}>Actual Output</Title>
        <Code
          block
          color={
            testResult.isError ? 'var(--mantine-color-red-light)' : 'gray.9'
          }
        >
          {testResult.output}
        </Code>
        <Title order={5}>Expected Output</Title>
        <Code block color="gray.9">
          {testResult.answer}
        </Code>
      </Stack>
    );
  };

  return (
    <>
      {testResults ? (
        <ScrollArea h="100%" offsetScrollbars>
          <Tabs variant="pills" color="gray.9" defaultValue="1" p="10px">
            <Tabs.List>
              {testResults.map((_, i) => (
                <Tabs.Tab value={(i + 1).toString()}>Case {i + 1}</Tabs.Tab>
              ))}
            </Tabs.List>

            {testResults.map((testResult: TestResult, i: number) => (
              <Tabs.Panel value={(i + 1).toString()}>
                {testResultPanel(testResult)}
              </Tabs.Panel>
            ))}
          </Tabs>
        </ScrollArea>
      ) : (
        <Center h="100%">Run your code first the see the test results.</Center>
      )}
    </>
  );
}

export default TestResultsTab;
