import { useEffect, useRef } from 'react';

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

function VideoCall({ localStream, remoteStream }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <>
        <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
            width: '245px',  // Fixed width
            height: '160px', // Fixed height
            borderRadius: '8px',
            objectFit: 'cover', // Maintain aspect ratio and fill the box
            border: '1px solid rgba(0, 0, 0, 0.2)', // Optional faint outline
            }}
        />
        <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
            width: '245px',  // Adjusted to match local video for better alignment
            height: '160px', // Fixed height
            borderRadius: '8px',
            objectFit: 'cover', // Maintain aspect ratio and fill the box
            border: '1px solid rgba(0, 0, 0, 0.2)', // Optional faint outline
            }}
        />
    </>
  );
};

export default VideoCall;
