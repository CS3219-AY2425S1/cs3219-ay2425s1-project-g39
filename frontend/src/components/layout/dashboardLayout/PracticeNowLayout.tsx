import { Button, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import { checkSession } from '../../../apis/CollaborationApi';
import config from '../../../config';
import { useAuth } from '../../../hooks/AuthProvider';
import { SessionResponse } from '../../../types/CollaborationType';
import HelpModal from '../../modal/HelpModal';
import MatchingCriteriaModal from '../../modal/MatchingCriteriaModal';
import MatchingModal from '../../modal/MatchingModal';
import RejoinSessionModal from '../../modal/RejoinSessionModal';

function PracticeLayout() {
  const [isHelpModalOpened, { open: openHelpModal, close: closeHelpModal }] =
    useDisclosure(false);
  const [
    isMatchingCriteriaModalOpen,
    { open: openMatchingCriteriaModal, close: closeMatchingCriteriaModal },
  ] = useDisclosure(false);
  const [
    isMatchingModalOpen,
    { open: openMatchingModal, close: closeMatchingModal },
  ] = useDisclosure(false);
  const [
    isRejoinSessionModalOpen,
    { open: openRejoinSessionModal, close: closeRejoinSessionModal },
  ] = useDisclosure(false);

  const [existingSession, setExistingSession] =
    useState<SessionResponse | null>(null);
  const [displayTimer, setDisplayTimer] = useState(0);
  const timerRef = useRef(0);
  const hasTimedOut = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const timeoutTime = 30;

  const auth = useAuth();
  const navigate = useNavigate();

  const handleTimeout = () => {
    if (!hasTimedOut.current) {
      hasTimedOut.current = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      notifications.show({
        title: 'Matching Timeout',
        message: 'We could not find a partner for you. Please try again later.',
        color: 'red',
        autoClose: 3000,
      });
      closeMatchingModal();
    }
  };

  useEffect(() => {
    let interval: number;
    if (isMatchingModalOpen) {
      timerRef.current = 0;
      setDisplayTimer(0);
      hasTimedOut.current = false;

      interval = window.setInterval(() => {
        timerRef.current += 1;
        setDisplayTimer(timerRef.current);
        if (timerRef.current >= timeoutTime) {
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
  }, [isMatchingModalOpen]);

  const connectSocket = (difficulties: string[], topics: string[]) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/matching-notification/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('register', auth.userId, difficulties, topics, localStorage.getItem('token'));
    });

    socketRef.current.on('match_found', (session) => {
      console.log(session);
      notifications.show({
        title: 'Match found!',
        message: 'Creating a practice room...',
        color: 'green',
        autoClose: 3000,
      });
      handleCancelMatching();
      navigate('/room', { state: session });
    });

    socketRef.current.on('disconnect', handleCancelMatching);
    socketRef.current.on('existing_search', handleCancelMatching);
  };

  const handleCancelMatching = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    closeMatchingModal();
  };

  const handleStartMatching = () => {
    checkSession().then(
      (response: SessionResponse) => {
        const { sessionId, matchedUserId, questionId } = response;
        if (!sessionId || !matchedUserId || !questionId) {
          openMatchingCriteriaModal();
          return;
        }
        setExistingSession(response);
        openRejoinSessionModal();
      },
      (error: any) => {
        console.log(error);
      },
    );
  };

  const rejoinSession = () => {
    if (existingSession) {
      notifications.show({
        title: 'Success',
        message: 'Rejoining existing room.',
        color: 'green',
        autoClose: 3000,
      });
      navigate('/room', { state: existingSession });
    }
  };

  const findMatch = (difficulties: string[], topics: string[]) => {
    openMatchingModal();
    connectSocket(difficulties, topics);
  };

  return (
    <>
      <Stack
        justify="space-between"
        p="20px"
        bg="slate.8"
        style={{ borderRadius: '4px' }}
      >
        <Title order={2} ta="start">
          Practice Now
        </Title>
        <Button onClick={handleStartMatching}>Start Interview</Button>
        <Text ta="center">
          Not sure how this works?{' '}
          <UnstyledButton fw={700} onClick={openHelpModal}>
            Learn now
          </UnstyledButton>
        </Text>
      </Stack>

      <HelpModal
        isHelpModalOpened={isHelpModalOpened}
        closeHelpModal={closeHelpModal}
      />
      <MatchingCriteriaModal
        isMatchingCriteriaModalOpened={isMatchingCriteriaModalOpen}
        closeMatchingCriteriaModal={closeMatchingCriteriaModal}
        findMatch={findMatch}
      />
      <MatchingModal
        isMatchingModalOpened={isMatchingModalOpen}
        closeMatchingModal={handleCancelMatching}
        displayTimer={displayTimer}
        timeoutTime={timeoutTime}
      />
      <RejoinSessionModal
        isOpen={isRejoinSessionModalOpen}
        closeModal={closeRejoinSessionModal}
        rejoinSession={rejoinSession}
        startNewMatch={openMatchingCriteriaModal}
      />
    </>
  );
}

export default PracticeLayout;
