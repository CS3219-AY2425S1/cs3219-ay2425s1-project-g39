import {
  ActionIcon,
  Group,
  Modal,
  Stack,
  Table,
  Tabs,
  Title,
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { langs } from '@uiw/codemirror-extensions-langs';
import { useEffect, useState } from 'react';

import { getQuestionById } from '../../apis/QuestionApi';
import { SupportedLanguage } from '../../types/CodeExecutionType';
import { PracticeHistoryItem } from '../../types/History';
import { Question } from '../../types/QuestionType';
import CodeEditor from '../codeEditor/CodeEditor';
import DescriptionTab from '../tabs/DescriptionTab';

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function QuestionTab({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | undefined>(undefined);

  useEffect(() => {
    if (questionId) {
      getQuestionById(questionId).then(
        (response: Question[]) => {
          setQuestion(response[0]);
        },
        (error: any) => {
          console.log(error);
        },
      );
    }
  }, [questionId]);

  return (
    <Tabs
      defaultValue="description"
      h="100%"
      bg="slate.9"
      p="10px"
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab question={question} />
      </Tabs.Panel>
    </Tabs>
  );
}

function PracticeRoom({ practiceData }: { practiceData: PracticeHistoryItem }) {
  const programmingLanguage =
    practiceData.programmingLanguage.toLowerCase() as SupportedLanguage;

  return (
    <>
      <Group h="90vh" bg="slate.8" gap="10px" p="10px" align="flex-start">
        <Stack h="100%" w="500px" gap="10px">
          <QuestionTab questionId={practiceData.questionId.toString()} />
        </Stack>

        <Stack
          h="100%"
          w="calc(100% - 510px)"
          gap={0}
          bg="slate.9"
          style={{ borderRadius: '4px' }}
        >
          <CodeEditor
            code={practiceData.textWritten}
            setCode={() => {}}
            extensions={[langs[programmingLanguage]()]}
            readOnly
          />
        </Stack>
      </Group>
    </>
  );
}

function PracticeHistoryTable({
  attempts,
}: {
  attempts: PracticeHistoryItem[];
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<PracticeHistoryItem | null>(null);

  const openModal = (attempt: PracticeHistoryItem) => {
    setSelectedAttempt(attempt);
    setModalOpen(true);
  };

  const rows = attempts.map((attempt, i) => (
    <Table.Tr key={i}>
      <Table.Td>{attempt.questionName}</Table.Td>
      <Table.Td>{attempt.questionDifficulty}</Table.Td>
      <Table.Td>{attempt.programmingLanguage}</Table.Td>
      <Table.Td>{formatDate(attempt.datetime)}</Table.Td>
      <Table.Td>
        <ActionIcon
          variant="light"
          color="gray"
          aria-label="View"
          onClick={() => {
            openModal(attempt);
          }}
        >
          <IconEye />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack p="20px" bg="slate.8" gap="20px" style={{ borderRadius: '4px' }}>
        <Title order={2}>Practice History</Title>
        <Table
          verticalSpacing="sm"
          highlightOnHover
          highlightOnHoverColor="slate.9"
          borderColor="dark.4"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Question</Table.Th>
              <Table.Th>Difficulty</Table.Th>
              <Table.Th>Language</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Stack>

      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={
          selectedAttempt
            ? `Review: ${selectedAttempt.questionName} on ${formatDate(selectedAttempt.datetime)} in ${selectedAttempt.programmingLanguage}.`
            : 'Review'
        }
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        {selectedAttempt && <PracticeRoom practiceData={selectedAttempt} />}
      </Modal>
    </>
  );
}

export default PracticeHistoryTable;
