import {
  Button,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';

import { difficulties, topics } from '../../constants/Question';
import {
  AddQuestionInput,
  Question,
  UpdateQuestionInput,
} from '../../types/QuestionType';

interface UpdateQuestionModalProps {
  isUpdateQuestionModalOpened: boolean;
  closeUpdateQuestionModal: () => void;
  questionToUpdate?: Question;
  handleUpdateQuestion?: (values: UpdateQuestionInput) => Promise<void>;
  handleAddQuestion?: (values: AddQuestionInput) => Promise<void>;
}

function UpdateQuestionModal({
  isUpdateQuestionModalOpened,
  closeUpdateQuestionModal,
  questionToUpdate,
  handleUpdateQuestion,
  handleAddQuestion,
}: UpdateQuestionModalProps) {
  const isAddQuestion = !questionToUpdate;
  const isUpdateQuestion = questionToUpdate;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      difficulty: '',
      topics: [] as string[],
      description: '',
      images: [] as string[],
    },
    validate: {
      title: isNotEmpty('Title cannot be empty'),
      difficulty: isNotEmpty('Difficulty cannot be empty'),
      topics: isNotEmpty('Topics cannot be empty'),
      description: isNotEmpty('Description cannot be empty'),
    },
  });

  useEffect(() => {
    if (!questionToUpdate) {
      return;
    }
    form.setValues({
      title: questionToUpdate.title,
      difficulty: questionToUpdate.difficulty,
      topics: questionToUpdate.topics,
      description: questionToUpdate.description,
      images: questionToUpdate.images,
    });
  }, [questionToUpdate]);

  const handleSubmitClick = (values: typeof form.values) => {
    if (isAddQuestion && handleAddQuestion) {
      handleAddQuestion(values);
    } else if (isUpdateQuestion && handleUpdateQuestion) {
      const { id } = questionToUpdate;
      handleUpdateQuestion({ id, ...values });
    }
  };

  return (
    <Modal
      opened={isUpdateQuestionModalOpened}
      onClose={() => {
        closeUpdateQuestionModal();
        form.reset();
      }}
      size="xl"
      withCloseButton={false}
      centered
      overlayProps={{
        blur: 4,
      }}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <form onSubmit={form.onSubmit(handleSubmitClick)}>
        <Stack p="16px" gap="16px">
          <Title order={2} ta="center">
            {isAddQuestion ? 'Add Question' : 'Update Question'}
          </Title>
          <TextInput
            {...form.getInputProps('title')}
            key={form.key('title')}
            label="Title"
          />
          <Select
            {...form.getInputProps('difficulty')}
            key={form.key('difficulty')}
            label="Difficulty"
            data={difficulties}
          ></Select>
          <MultiSelect
            {...form.getInputProps('topics')}
            key={form.key('topics')}
            label="Topics"
            data={topics}
          />
          <Textarea
            {...form.getInputProps('description')}
            key={form.key('description')}
            label="Description"
            autosize
            minRows={1}
          />
          {/* <FileInput
                placeholder="Choose Images"
                multiple
                value={newImageFiles}
                onChange={setImageFiles}
              />
              <Button onClick={uploadImages}>Upload Image</Button> */}
          <Button type="submit">{isAddQuestion ? 'Add' : 'Update'}</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default UpdateQuestionModal;
