import { Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { useAuth } from '../../hooks/AuthProvider';

interface MatchingModalProps {
  isMatchingModalOpened: boolean;
  closeMatchingModal: () => void;
  difficulty: string[];
  topics: string[];
}

function MatchingModal({
  isMatchingModalOpened,
  closeMatchingModal,
  difficulty,
  topics,
}: MatchingModalProps) {
  const [displayTimer, setDisplayTimer] = useState(0);
  const timerRef = useRef(0);
  const [matchFound, setMatchFound] = useState<any | null>(null);
  const hasTimedOut = useRef(false);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const auth = useAuth();

  const handleTimeout = useCallback(() => {
    if (!hasTimedOut.current) {
      hasTimedOut.current = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      notifications.show({
        title: 'Timeout',
        message: 'We could not find a match... Exiting',
        color: 'red',
      });
      closeMatchingModal();
    }
  }, [closeMatchingModal]);

  const connectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    setIsConnecting(true);

    socketRef.current = io('http://localhost:4001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnecting(false);
      console.log('Registering user:', auth.userId);
      socketRef.current?.emit('register', auth.userId, difficulty, topics);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnecting(false);
      notifications.show({
        title: 'Connection Error',
        message: 'Failed to connect to the matching service. Please try again.',
        color: 'red',
      });
    });

    socketRef.current.on('match_found', (match) => {
      setMatchFound(match);
      notifications.show({
        title: 'Match found',
        message: 'We found a perfect match for you!',
        color: 'green',
      });
      socketRef.current?.close();
      handleCancel();
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketRef.current.on('existing_search', () => {
      notifications.show({
        title: 'Existing search',
        message: 'There is already an existing matching session. Please try again later.',
        color: 'red',
      });
      socketRef.current?.close();
      handleCancel();
    });
  }, [difficulty, topics, matchFound, isConnecting, navigate, closeMatchingModal]);

  useEffect(() => {
    if (isMatchingModalOpened) {
      connectSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isMatchingModalOpened]);

  useEffect(() => {
    let interval: number;
    if (isMatchingModalOpened) {
      timerRef.current = 0;
      setDisplayTimer(0);
      hasTimedOut.current = false;

      interval = setInterval(() => {
        timerRef.current += 1;
        setDisplayTimer(timerRef.current);
        if (timerRef.current >= 30) {
          handleTimeout();
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      timerRef.current = 0;
      setDisplayTimer(0);
      hasTimedOut.current = false;
    };
  }, [isMatchingModalOpened, handleTimeout]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    closeMatchingModal();
  };

  return (
    <>
      <Notifications position="top-right" />
      <Modal
        opened={isMatchingModalOpened}
        onClose={handleCancel}
        title="Finding Your Perfect Match"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack justify="xl" align="center">
          <Group justify="center" mt="md">
            <Loader size="md" />
            <Text size="lg">{formatTime(displayTimer)}</Text>
          </Group>
          <Button variant="light" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default MatchingModal;
