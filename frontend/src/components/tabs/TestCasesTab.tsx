import { Code, ScrollArea, Stack, Tabs, Title } from '@mantine/core';

import { TestCase } from '../../types/QuestionType';

interface TestCasesTabProps {
  testCases: TestCase[];
}

function TestCasesTab({ testCases }: TestCasesTabProps) {
  const testCasePanel = (testCase: TestCase) => (
    <Stack p="16px" pb={0} gap="16px">
      <Title order={5}>Input</Title>
      <Code block color="gray.9">
        {testCase.input}
      </Code>
      <Title order={5}>Expected Output</Title>
      <Code block color="gray.9">
        {testCase.answer}
      </Code>
    </Stack>
  );

  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Tabs variant="pills" color="gray.9" defaultValue="1" p="10px">
        <Tabs.List>
          {testCases.map((_, i) => (
            <Tabs.Tab value={(i + 1).toString()}>Case {i + 1}</Tabs.Tab>
          ))}
        </Tabs.List>

        {testCases.map((testCase: TestCase, i: number) => (
          <Tabs.Panel value={(i + 1).toString()}>
            {testCasePanel(testCase)}
          </Tabs.Panel>
        ))}
      </Tabs>
    </ScrollArea>
  );
}

export default TestCasesTab;
