import { ActionIcon, AppShell, Badge, Button, Container, Group, MultiSelect, Select, Stack, Table, Title } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { checkResponse } from '../apis/CheckResponse';
import { createNewQuestion, deleteQuestionById, getAllQuestions, updateQuestionById } from '../apis/QuestionApi';
import Header from '../components/header/Header';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import UpdateQuestionModal from '../components/modal/UpdateQuestionModal';
import ViewQuestionModal from '../components/modal/ViewQuestionModal';
import { difficulties, topics } from '../constants/Question';
import {
  AddQuestionInput,
  Question,
  UpdateQuestionInput,
} from '../types/QuestionType';

function QuestionEditor() {
  const [
    isAddQuestionModalOpened,
    { open: openAddQuestionModal, close: closeAddQuestionModal },
  ] = useDisclosure(false);
  const [
    isViewQuestionModalOpened,
    { open: openViewQuestionModal, close: closeViewQuestionModal },
  ] = useDisclosure(false);
  const [
    isUpdateQuestionModalOpened,
    { open: openUpdateQuestionModal, close: closeUpdateQuestionModal },
  ] = useDisclosure(false);
  const [
    isDeleteQuestionModalOpened,
    { open: openDeleteQuestionModal, close: closeDeleteQuestionModal },
  ] = useDisclosure(false);

  const [questions, questionsHandlers] = useListState<Question>([]);
  const [questionInView, setQuestionInView] = useState<Question | null>(null);
  const [questionToUpdate, setQuestionToUpdate] = useState<Question | null>(
    null,
  );
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string[]>([]);
  const navigate = useNavigate();
  // const [newImageFiles, setImageFiles] = useState<File[]>([]);
  // const [newImageNames, setImageNames] = useState<string[]>([]);
  // const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const records = await getAllQuestions();
      questionsHandlers.setState(records);
    } catch (error: any) {
      checkResponse(error, navigate);
      const message = `An error occurred: ${error.message}`;
      console.error(message);
      return;
    }
  };

  const isTitleUnique = (title: string, excludeId?: string) => {
    return !questions.some(
      (q) =>
        q.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        q.id !== excludeId,
    );
  };

  // const uploadImages = async () => {
  //   const formData = new FormData();
  //   newImageFiles.forEach((file) => {
  //     formData.append('img', file);
  //   });

  //   const response = await fetch(`${API_BASE_URL}/img`, {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const data = await response.json();

  //   if (!response.ok) {
  //     console.error('Failed to upload image');
  //   } else {
  //     setImageNames([...newImageNames, data.filename]);
  //   }
  // };

  // const getImage = async (filename: string) => {
  //   const response = await fetch(`${API_BASE_URL}/img/${filename}`);
  //   if (!response.ok) {
  //     console.error('Failed to fetch image');
  //   } else {
  //     const blob = await response.blob();
  //     // Create an object URL from the blob
  //     const url = URL.createObjectURL(blob);
  //     setImageSrc(url);
  //   }
  // };

  const addQuestion = async (values: AddQuestionInput) => {
    const { title } = values;
    if (!isTitleUnique(title)) {
      notifications.show({
        title: 'Error',
        message: 'A question with this title already exists.',
        color: 'red',
      });
      return;
    }
    try {
      const data = await createNewQuestion(values);
      questionsHandlers.append(data);
    } catch (error: any) {
      checkResponse(error, navigate);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add question.',
        color: 'red',
      });
      throw new Error('Failed to add question');
    }
    closeAddQuestionModal();
    notifications.show({
      title: 'Success',
      message: 'Question added successfully.',
      color: 'green',
    });
  };

  const deleteQuestion = async (id: string) => {
    try {
      await deleteQuestionById(id);
      questionsHandlers.filter((item) => item.id !== id);
      notifications.show({
        title: 'Success',
        message: 'Question deleted successfully.',
        color: 'green',
      });
    } catch (error: any) {
      checkResponse(error, navigate);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete question.',
        color: 'red',
      });
      throw new Error('Failed to delete question');
    }
  };

  const updateQuestion = async (values: UpdateQuestionInput) => {
    const { id, title } = values;

    if (!isTitleUnique(title, id)) {
      notifications.show({
        title: 'Error',
        message: 'A question with this title already exists',
        color: 'red',
      });
      return;
    }
    try {
      const data = await updateQuestionById(id, values);
      questionsHandlers.applyWhere(
        (item) => item.id === id,
        () => data,
      );
      closeUpdateQuestionModal();
      notifications.show({
        title: 'Success',
        message: 'Question updated successfully.',
        color: 'green',
      });
    } catch (error: any) {
      checkResponse(error, navigate);
      notifications.show({
        title: 'Error',
        message: 'Failed to update question.',
        color: 'red',
      });
      throw new Error('Failed to update question');
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(
      (question) =>
        (!filterDifficulty || question.difficulty === filterDifficulty) &&
        (filterTopic.length === 0 ||
          filterTopic.some((topic) => question.topics.includes(topic))),
    );
  }, [questions, filterDifficulty, filterTopic]);

  const rows = filteredQuestions.map((question, i) => (
    <Table.Tr key={i}>
      <Table.Td>{question.title}</Table.Td>
      <Table.Td>{question.difficulty}</Table.Td>
      <Table.Td>
        <Group gap="5px">
          {question.topics.map((topic, i) => (
            <Badge key={i} variant="light" color="gray" size="sm">
              {topic}
            </Badge>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="5px">
          <ActionIcon
            variant="light"
            color="gray"
            aria-label="View"
            onClick={() => {
              setQuestionInView(question);
              openViewQuestionModal();
            }}
          >
            <IconEye />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="gray"
            aria-label="Edit"
            onClick={() => {
              setQuestionToUpdate(question);
              openUpdateQuestionModal();
            }}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            aria-label="Delete"
            onClick={() => {
              setQuestionToDelete(question);
              openDeleteQuestionModal();
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <Header />

        <AppShell.Main
          h="calc(100vh - 80px)"
          w="100%"
          bg="slate.9"
          style={{ overflowY: 'auto' }}
        >
          <Container size="xl">
            <Stack
              p="20px"
              bg="slate.8"
              gap="20px"
              style={{ borderRadius: '4px' }}
            >
              <Group justify="space-between" align="center">
                <Title order={2}>Question Manager</Title>
                <Button
                  leftSection={<IconPlus />}
                  onClick={openAddQuestionModal}
                >
                  Add Question
                </Button>
              </Group>

              <Group>
                <Select
                  description="Difficulty Filter"
                  clearable
                  data={difficulties}
                  value={filterDifficulty}
                  onChange={setFilterDifficulty}
                  miw="200px"
                  styles={{
                    input: { background: 'var(--mantine-color-slate-9)' },
                  }}
                />
                <MultiSelect
                  description="Topics Filter"
                  clearable
                  data={topics}
                  value={filterTopic}
                  onChange={setFilterTopic}
                  miw="200px"
                  styles={{
                    input: { background: 'var(--mantine-color-slate-9)' },
                  }}
                />
              </Group>

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
                    <Table.Th>Topics</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>

      <UpdateQuestionModal
        isUpdateQuestionModalOpened={isAddQuestionModalOpened}
        closeUpdateQuestionModal={closeAddQuestionModal}
        handleAddQuestion={addQuestion}
      />
      {questionInView && (
        <ViewQuestionModal
          isViewQuestionModalOpened={isViewQuestionModalOpened}
          closeViewQuestionModal={closeViewQuestionModal}
          question={questionInView}
        />
      )}
      {questionToUpdate && (
        <UpdateQuestionModal
          isUpdateQuestionModalOpened={isUpdateQuestionModalOpened}
          closeUpdateQuestionModal={closeUpdateQuestionModal}
          questionToUpdate={questionToUpdate}
          handleUpdateQuestion={updateQuestion}
        />
      )}
      {questionToDelete && (
        <ConfirmationModal
          isConfirmationModalOpened={isDeleteQuestionModalOpened}
          closeConfirmationModal={closeDeleteQuestionModal}
          handleConfirmation={() => {
            deleteQuestion(questionToDelete.id);
            setQuestionToDelete(null);
          }}
          description="Are you sure you want to delete this question?"
          confirmationButtonLabel="Delete"
          confirmationButtonColor="red"
        />
      )}
    </>
  );
}

export default QuestionEditor;