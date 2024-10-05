import { Accordion, AppShell, Button, Card, Container, Group, Modal, MultiSelect, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { useEffect, useMemo, useState } from 'react';


interface Question {
  id: string;
  _id: string;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  images: string[];
}

const API_BASE_URL = 'http://localhost/api/questions';

const difficulties = ['Easy', 'Medium', 'Hard'];
const topics = [
  'Strings',
  'Algorithms',
  'Bit Manipulation',
  'Data Structures',
  'Recursion',
  'Databases',
  'Arrays',
  'Brainteaser',
];

function QuestionEditor() {
  const [questions, questionsHandlers] = useListState<Question>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string[]>([]);
  // const [newImageFiles, setImageFiles] = useState<File[]>([]);
  const [newImageNames, setImageNames] = useState<string[]>([]);
  // const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    const records = await response.json();
    questionsHandlers.setState(records);
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

  const addQuestion = async () => {
    if (newTitle.trim() === '') {
      notifications.show({
        title: 'Error',
        message: 'Title cannot be empty',
        color: 'red',
      });
      return;
    }

    if (!isTitleUnique(newTitle)) {
      notifications.show({
        title: 'Error',
        message: 'A question with this title already exists',
        color: 'red',
      });
      return;
    }

    if (
      newTitle.trim() &&
      newDescription.trim() &&
      newDifficulty &&
      newTopic.length > 0
    ) {
      const newQuestion = {
        title: newTitle,
        description: newDescription,
        difficulty: newDifficulty,
        topics: newTopic,
        images: newImageNames,
      };
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });
      if (!response.ok) {
        throw new Error('Failed to add question');
      }
      const data = await response.json();
      questionsHandlers.append(data);
      resetForm();
      setIsAddModalOpen(false);
      notifications.show({
        title: 'Success',
        message: 'Question added successfully',
        color: 'green',
      });
    }
  };

  const deleteQuestion = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete question');
    }
    questionsHandlers.filter((item) => item.id !== id);
    notifications.show({
      title: 'Success',
      message: 'Question deleted successfully',
      color: 'green',
    });
  };

  const startEditing = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      setEditingId(id);
      setNewTitle(question.title);
      setNewDescription(question.description);
      setNewDifficulty(question.difficulty);
      setNewTopic(question.topics);
      setIsUpdateModalOpen(true);
    }
  };

  const updateQuestion = async () => {
    if (newTitle.trim() === '') {
      notifications.show({
        title: 'Error',
        message: 'Title cannot be empty',
        color: 'red',
      });
      return;
    }

    if (!isTitleUnique(newTitle, editingId)) {
      notifications.show({
        title: 'Error',
        message: 'A question with this title already exists',
        color: 'red',
      });
      return;
    }

    if (
      editingId &&
      newTitle.trim() &&
      newDescription.trim() &&
      newDifficulty &&
      newTopic.length > 0
    ) {
      const updatedQuestion = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
        difficulty: newDifficulty,
        topics: newTopic,
        images: newImageNames,
      };

      const response = await fetch(`${API_BASE_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      });
      if (!response.ok) {
        throw new Error('Failed to update question');
      }
      const data = await response.json();
      questionsHandlers.applyWhere(
        (item) => item.id === editingId,
        () => data,
      );
      resetForm();
      setIsUpdateModalOpen(false);
      notifications.show({
        title: 'Success',
        message: 'Question updated successfully',
        color: 'blue',
      });
    }
  };

  const renderDescription = (description: string) => {
    return description.split('\n').map((paragraph, index) => (
      <Text
        key={index}
        mb={index < description.split('\n').length - 1 ? 'md' : 0}
      >
        {paragraph}
      </Text>
    ));
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(
      (question) =>
        (!filterDifficulty || question.difficulty === filterDifficulty) &&
        (filterTopic.length === 0 ||
          filterTopic.some((topic) => question.topics.includes(topic))),
    );
  }, [questions, filterDifficulty, filterTopic]);

  const resetForm = () => {
    setEditingId(undefined);
    setNewTitle('');
    setNewDescription('');
    setNewDifficulty(null);
    setNewTopic([]);
    setImageNames([]);
    // setImageFiles([]);
  };

  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <AppShell.Header px="40px" py="16px" bg="slate.8">
        <Group justify="space-between">
          <a href="." className="logo">
            <Title c="white">PeerPrep</Title>
          </a>
          <Button>Log in</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main
        h="calc(100vh - 80px)"
        w="100%"
        bg="slate.9"
        style={{ overflowY: 'auto' }}
      >
        <Notifications position="top-right" zIndex={9000} autoClose={2000} />
        <Container mt="xl" size="90%">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="apart" mb="md">
              <Title order={2}>Question Manager</Title>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Question
              </Button>
            </Group>
            <Group justify="apart" mb="md">
              <Select
                description="Difficulty"
                placeholder="Select Difficulty"
                clearable
                data={difficulties}
                value={filterDifficulty}
                onChange={setFilterDifficulty}
                style={{ width: '300px' }}
              />
              <MultiSelect
                description="Topic"
                clearable
                placeholder={filterTopic.length > 0 ? '' : 'Select Topic'}
                data={topics}
                value={filterTopic}
                onChange={setFilterTopic}
                style={{ width: '300px' }}
              />
            </Group>
            <Accordion
              styles={{
                root: {
                  width: '100%',
                },
                item: {
                  marginBottom: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                },
                control: {
                  padding: '10px',
                },
                content: {
                  padding: '10px',
                },
              }}
            >
              {filteredQuestions.map((question) => (
                <Accordion.Item key={question._id} value={question._id}>
                  <Accordion.Control>
                    <Stack justify="apart">
                      <Text>{question.title}</Text>
                      <Group>
                        <Text size="sm">
                          {'Difficulty: ' + question.difficulty}
                        </Text>
                        <Text size="sm">
                          {'Topics: ' + question.topics.join(' | ')}
                        </Text>
                      </Group>
                    </Stack>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {renderDescription(question.description)}
                    {/* {question.images.map((image, index) => (
                      <MantineImage
                        key={index}
                        src={getImage(image)}
                        alt={`Image ${index + 1}`}
                        mt="md"
                      />
                    ))} */}
                    <Group>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => startEditing(question.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        color="red"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>

          <Modal
            opened={isAddModalOpen || isUpdateModalOpen}
            onClose={() => {
              resetForm();
              setIsAddModalOpen(false);
              setIsUpdateModalOpen(false);
            }}
            title={isAddModalOpen ? 'Add New Question' : 'Update Question'}
            size="lg"
            centered
            closeButtonProps={{ size: 'xs' }}
          >
            <Stack>
              <TextInput
                label="Title"
                placeholder="Enter question title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.currentTarget.value)}
              />
              <Group>
                <Select
                  label="Difficulty"
                  placeholder="Select difficulty"
                  data={difficulties}
                  value={newDifficulty}
                  onChange={setNewDifficulty}
                />
                <MultiSelect
                  label="Topic"
                  placeholder="Select topic"
                  data={topics}
                  value={newTopic}
                  onChange={setNewTopic}
                />
              </Group>
              <Textarea
                label="Description"
                placeholder="Enter question description"
                autosize
                minRows={1}
                value={newDescription}
                onChange={(event) =>
                  setNewDescription(event.currentTarget.value)
                }
              />
              {/* <FileInput
                placeholder="Choose Images"
                multiple
                value={newImageFiles}
                onChange={setImageFiles}
              />
              <Button onClick={uploadImages}>Upload Image</Button> */}
              <Button onClick={isAddModalOpen ? addQuestion : updateQuestion}>
                {isAddModalOpen ? 'Add Question' : 'Update Question'}
              </Button>
            </Stack>
          </Modal>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default QuestionEditor;