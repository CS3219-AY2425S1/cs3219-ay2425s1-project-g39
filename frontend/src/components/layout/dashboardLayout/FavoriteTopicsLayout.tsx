import { Badge, Group, Space, Stack, Text, Title } from '@mantine/core';

import { Progress } from '../../../types/History';

function FavoriteTopicsLayout({ progress }: { progress: Progress }) {
  const favoriteTopics = progress.topTopics.map((topTopic, i) => (
    <Group key={i}>
      <Badge variant="light" color="gray">
        {topTopic.topic}
      </Badge>
      <Space style={{ flexGrow: 1 }} />
      <Text>
        <Text span fw={700}>
          {topTopic.count}{' '}
        </Text>
        problems solved
      </Text>
    </Group>
  ));

  return (
    <Group p="20px" bg="slate.8" gap="20px" style={{ borderRadius: '4px' }}>
      <Stack>
        <Title order={2}>Favorite Topics</Title>
        {favoriteTopics}
      </Stack>
    </Group>
  );
}

export default FavoriteTopicsLayout;
