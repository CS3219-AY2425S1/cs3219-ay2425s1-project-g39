import { Button, Group, Loader, Modal, Stack, Text, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff } from '@tabler/icons-react';
import { ViewUpdate } from '@uiw/react-codemirror';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import { executeCode } from '../apis/CodeExecutionApi';
import { getQuestionById } from '../apis/QuestionApi';
import CodeEditorLayout from '../components/layout/codeEditorLayout/CodeEditorLayout';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import { ChatMessage } from '../components/tabs/ChatBoxTab';
import CodeOutputTabs from '../components/tabs/CodeOutputTabs';
import RoomTabs from '../components/tabs/RoomTabs';
import VideoCall from '../components/videoCall/VideoCall';
import config from '../config';
import { useAuth } from '../hooks/AuthProvider';
import {
  CodeExecutionInput,
  CodeOutput,
  SupportedLanguage,
} from '../types/CodeExecutionType';
import { Question } from '../types/QuestionType';

function Room() {
  const [loading, setLoading] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [codeOutput, setCodeOutput] = useState<CodeOutput | undefined>(
    undefined,
  );

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const isRoomJoinedRef = useRef<boolean>(false);

  const [
    isLeaveSessionModalOpened,
    { open: openLeaveSessionModal, close: closeLeaveSessionModal },
  ] = useDisclosure(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [modalOpened, { close: closeModal, open: openModal }] =
    useDisclosure(false);

  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;
  const { userId } = useAuth();

  // Refs for two sockets
  const collaborationSocketRef = useRef<Socket | null>(null);
  const communicationSocketRef = useRef<Socket | null>(null);
  const isRemoteUpdateRef = useRef(false);
  const viewUpdateRef = useRef<ViewUpdate | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const configServer = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    const requestMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
        setPermissionsGranted(true);
        setLoading(false);
      } catch (error) {
        console.error('Permissions not granted:', error);
        openModal();
      }
    };

    requestMediaPermissions();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      peerConnectionRef.current = null;
      stopRemoteStream();
      // Disconnect sockets
      if (collaborationSocketRef.current) {
        collaborationSocketRef.current.disconnect();
        collaborationSocketRef.current = null;
      }
      if (communicationSocketRef.current) {
        communicationSocketRef.current.disconnect();
        communicationSocketRef.current = null;
        isRoomJoinedRef.current = false;
      }
    };
  }, []);

  // Toggle mute
  const handleMuteUnmute = () => {
    if (localStream) {
      const audioTrack = localStream
        .getTracks()
        .find((track) => track.kind === 'audio');
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  // Toggle video
  const handleCameraToggle = () => {
    if (localStream) {
      const videoTrack = localStream
        .getTracks()
        .find((track) => track.kind === 'video');
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  useEffect(() => {
    const initializeCall = async () => {
      if (!loading && localStream && communicationSocketRef !== null && communicationSocketRef.current !== null && isRoomJoinedRef.current) {
        
        // Wait a moment to ensure everything is stable
        setTimeout(() => {
          if (communicationSocketRef.current) {
          console.log('Emitting ready-to-call');
          communicationSocketRef.current.emit('ready-to-call');
          }
        }, 500);
      }
    };
    
    initializeCall();
  }, [loading, localStream, communicationSocketRef.current, isRoomJoinedRef.current]);

  useEffect(() => {
    if (!permissionsGranted || !sessionData) {
      return;
    }

    const { sessionId, matchedUserId, questionId } = sessionData;

    connectCollaborationSocket(sessionId, matchedUserId, questionId);
    connectCommunicationSocket(sessionId);

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
  }, [permissionsGranted, sessionData]);

  // Connect Collaboration Socket
  const connectCollaborationSocket = (
    sessionId: string,
    matchedUserId: string,
    questionId: number,
  ) => {
    if (collaborationSocketRef.current) {
      collaborationSocketRef.current.disconnect();
      collaborationSocketRef.current = null;
      isRoomJoinedRef.current = false;
    }

    const token = localStorage.getItem('token');

    collaborationSocketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/collab/socket.io',
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    collaborationSocketRef.current.on('connect', () => {
      collaborationSocketRef.current?.emit('join-session', {
        sessionId,
        matchedUserId,
        questionId,
      });
    });

    collaborationSocketRef.current.on('load-code', (newCode) =>
      setCode(newCode),
    );

    collaborationSocketRef.current.on('code-updated', (newCode) => {
      // Capture the current cursor position as line and column
      let cursorLine = 0;
      let cursorColumn = 0;
      if (viewUpdateRef.current) {
        const { head } = viewUpdateRef.current.view.state.selection.main;
        const pos = viewUpdateRef.current.view.state.doc.lineAt(head);
        cursorLine = pos.number - 1; // Adjusting for 0-based index
        cursorColumn = head - pos.from;
      }

      // Update the code with the new content
      isRemoteUpdateRef.current = true;
      setCode(newCode);

      // Restore line and column position after the code has been updated
      setTimeout(() => {
        if (viewUpdateRef.current) {
          const line = viewUpdateRef.current.view.state.doc.line(
            cursorLine + 1,
          ); // Adjusting back to 1-based
          const newPos = line.from + cursorColumn;
          viewUpdateRef.current.view.dispatch({
            selection: { anchor: newPos, head: newPos },
          });
        }
      }, 5); // the delay to be set may vary from device to device
    });

    collaborationSocketRef.current.on('load-language', (newLanguage) => {
      setLanguage(newLanguage);
    });

    collaborationSocketRef.current.on('language-updated', (newLanguage) => {
      setLanguage(newLanguage);
    });

    collaborationSocketRef.current.on('codex-output', (newOutput) => {
      setCodeOutput(newOutput);
    });

    collaborationSocketRef.current.on('user-joined', () => {
      notifications.show({
        title: 'Partner connected',
        message: 'Your practice partner has joined the room.',
        color: 'green',
      });
    });

    collaborationSocketRef.current.on('user-left', () => {
      notifications.show({
        title: 'Partner disconnected',
        message: 'Your practice partner has disconnected from the room.',
        color: 'red',
      });
    });

    collaborationSocketRef.current.on('disconnect', handleLeaveSession);
  };

  // Connect Communication Socket
  const connectCommunicationSocket = (roomId: string) => {
    const token = localStorage.getItem('token');

    communicationSocketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/comm/socket.io',
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    communicationSocketRef.current.on('connect', () => {
      communicationSocketRef.current?.emit('joinRoom', roomId);
    });

    communicationSocketRef.current.on(
      'loadPreviousMessages',
      (pastMessages: ChatMessage[]) => {
        setMessages(pastMessages);
      },
    );

    communicationSocketRef.current.on('chatMessage', (msg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    communicationSocketRef.current.on('roomJoined', () => {
      isRoomJoinedRef.current = true;
    })

    communicationSocketRef.current.on('offer', handleReceiveOffer);
    communicationSocketRef.current.on('answer', handleReceiveAnswer);
    communicationSocketRef.current.on('candidate', handleReceiveCandidate);
    communicationSocketRef.current.on('ready-to-call', handleReadyToCall);
    communicationSocketRef.current.on('user-left', handleUserLeft);

    setupPeerConnection();
  };

  // To prevent remote updates from emitting 'edit-code', avoiding the loop
  useEffect(() => {
    if (!isRemoteUpdateRef.current) {
      collaborationSocketRef.current?.emit('edit-code', code);
    }
    isRemoteUpdateRef.current = false;
  }, [code]);

  const stopRemoteStream = () => {
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null); // Set remoteStream to null after stopping its tracks
    }
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    collaborationSocketRef.current?.emit('edit-language', newLanguage);
  };

  const handleLeaveSession = () => {
    collaborationSocketRef.current?.disconnect();
    collaborationSocketRef.current = null;
    communicationSocketRef.current?.disconnect();
    communicationSocketRef.current = null;
    isRoomJoinedRef.current = false;
    navigate('/dashboard');
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    const codeExecutionInput: CodeExecutionInput = {
      code,
      language,
    };
    executeCode(codeExecutionInput).then(
      (codeOutput: CodeOutput) => {
        setCodeOutput(codeOutput);
        collaborationSocketRef.current?.emit('codex-output', codeOutput);
        setIsRunningCode(false);
      },
      (error: any) => {
        notifications.show({
          title: 'Code Execution Error',
          message:
            'We were unable to execute your code. Please try again later.',
          color: 'red',
        });
        console.log(error);
        setIsRunningCode(false);
      },
    );
  };

  const sendMessage = () => {
    if (input.trim() !== '' && communicationSocketRef.current) {
      communicationSocketRef.current.emit('chatMessage', { body: input });
      setInput('');
    }
  };

  const setupPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(configServer);

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && communicationSocketRef.current) {
        communicationSocketRef.current.emit('candidate', event.candidate);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    localStream
      ?.getTracks()
      .forEach((track) =>
        peerConnectionRef.current?.addTrack(track, localStream),
      );
  };

  const handleReadyToCall = async (user: string) => {
    console.log('handling ready to call');
    if (
      peerConnectionRef.current &&
      communicationSocketRef.current &&
      user !== userId
    ) {
      console.log('Creating offer');
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      communicationSocketRef.current.emit('offer', offer);
    }
  };

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      communicationSocketRef.current?.emit('answer', answer);
    }
  };

  const handleReceiveAnswer = (answer: RTCSessionDescriptionInit) => {
    peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
  };

  const handleReceiveCandidate = (candidate: RTCIceCandidateInit) => {
    peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleUserLeft = () => {
    stopRemoteStream();
  };

  const handleCloseModal = () => {
    closeModal();
    navigate('/dashboard'); // Redirect to dashboard when modal is closed
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <VideoCall localStream={localStream} remoteStream={remoteStream} />
          </Group>
          <Group  justify="center">
            <ActionIcon onClick={handleMuteUnmute} size="xl" variant="outline">
              {isMuted ? <IconMicrophoneOff size={24} /> : <IconMicrophone size={24} />}
            </ActionIcon>
            <ActionIcon onClick={handleCameraToggle} size="xl" variant="outline" style={{ marginLeft: 10 }}>
              {isVideoOff ? <IconVideoOff size={24} /> : <IconVideo size={24} />}
            </ActionIcon>
          </Group>
          <RoomTabs
            question={question}
            sessionId={sessionData.sessionId}
            token={localStorage.getItem('token') || ''}
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </Stack>

        <Stack h="100%" w="calc(100% - 510px)" gap="10px">
          <CodeEditorLayout
            openLeaveSessionModal={openLeaveSessionModal}
            code={code}
            setCode={setCode}
            language={language}
            handleLanguageChange={handleLanguageChange}
            isRunningCode={isRunningCode}
            handleRunCode={handleRunCode}
            viewUpdateRef={viewUpdateRef}
          />
          <CodeOutputTabs
            codeOutput={codeOutput}
            testCases={question?.testCases}
          />
        </Stack>
      </Group>

      <ConfirmationModal
        isConfirmationModalOpened={isLeaveSessionModalOpened}
        closeConfirmationModal={closeLeaveSessionModal}
        handleConfirmation={handleLeaveSession}
        description="Are you sure you want to leave this session?"
        confirmationButtonLabel="Leave"
        confirmationButtonColor="red"
      />

      <Modal
        opened={modalOpened}
        onClose={handleCloseModal} // Close modal and navigate on close
        title="Permissions Required"
      >
        <Text size="lg">
          Camera and microphone permissions are required to access this room.
          Please refresh the page and grant access.
        </Text>
        <Button
          onClick={() => window.location.reload()}
          style={{ marginTop: '20px' }}
        >
          Refresh
        </Button>
      </Modal>
    </>
  );
}

export default Room;
