// controllers/sessionController.js

const codeSessions = {};

const sessionsForUser = {};

// Handle user joining a session
const joinSession = (socket, io) => {
  socket.on('join-session', (details) => {
    const { sessionId, matchedUserId, questionId } = details;
    const userId = socket.data.user.userId;

    // Input validation
    if (!sessionId) {
      return socket.emit('error', 'Session ID is required.');
    }
    if (!userId) {
      return socket.emit('error', 'User ID is required.');
    }
    if (!matchedUserId) {
      return socket.emit('error', 'Matched User ID is required.');
    }
    if (userId == matchedUserId) {
      return socket.emit('error', 'User cannot be matched to him/herself.');
    }
    if (!questionId) {
      return socket.emit('error', 'Question ID is required.');
    }

    if (!codeSessions[sessionId]) {
      // Initialize session
      codeSessions[sessionId] = {
        code: '',
        users: new Set([userId, matchedUserId]),
        activeConnections: 0,
        questionId: questionId,
        programmingLanguage: 'python',
      };
    } else if (
      !codeSessions[sessionId].users.has(userId) ||
      !codeSessions[sessionId].users.has(matchedUserId)
    ) {
      return socket.emit('error', 'Invalid user/match Id for this session ID.');
    } else if (codeSessions[sessionId].questionId != questionId) {
      return socket.emit('error', 'Invalid question Id for this session ID.');
    }


    if (codeSessions[sessionId].activeConnections >= 2) {
      return socket.emit('error', 'Room is full.');
    }

    socket.join(sessionId);
    codeSessions[sessionId].activeConnections += 1;
    delete codeSessions[sessionId].timeoutStart;

    sessionsForUser[userId] = {
      sessionId: sessionId,
      matchedUserId: matchedUserId,
      questionId: questionId
    };

    console.log(`User ${userId} joined session ${sessionId}`);

    // Send the current code state to the newly joined user
    socket.emit('load-code', codeSessions[sessionId].code);
    
    // Send the current programming language to the newly joined user
    socket.emit('load-language', codeSessions[sessionId].programmingLanguage);

    // Listen for code changes in this session
    socket.on('edit-code', (newCode) => {
      codeSessions[sessionId].code = newCode;
      socket.to(sessionId).emit('code-updated', newCode);
    });

    // Listen for language changes in this session
    socket.on('edit-language', (newLanguage) => {
      codeSessions[sessionId].programmingLanguage = newLanguage;
      socket.to(sessionId).emit('language-updated', newLanguage);
    });

    // Notify other users in the session about the new user
    socket.to(sessionId).emit('user-joined', userId);

    socket.on('disconnect', () => {
      const codeSession = codeSessions[sessionId];

      if (!codeSession) {
        return;
      }

      socket.to(sessionId).emit('user-left', userId);

      codeSession.activeConnections -= 1;
      console.log(`User ${userId} disconnected from session ${sessionId}`);

      if (codeSession.activeConnections <= 0) {
        const timeoutStart = Date.now();

        codeSession.timeoutStart = timeoutStart;

        setTimeout(async () => {
          if (codeSession && codeSession.timeoutStart == timeoutStart) {
            delete codeSessions[sessionId];
            if (
              sessionsForUser[userId] &&
              sessionsForUser[userId].sessionId == sessionId
            ) {
              delete sessionsForUser[userId];
            }
            if (
              sessionsForUser[matchedUserId] &&
              sessionsForUser[matchedUserId].sessionId == sessionId
            ) {
              delete sessionsForUser[matchedUserId];
            }

            // make api call to history service to save the session
            await fetch("http://nginx/api/history", {
              method: 'POST',
              headers: {
                'Authorization': socket.handshake.auth.token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userIdOne: userId,
                userIdTwo: matchedUserId,
                textWritten: codeSession.code,
                questionId: codeSession.questionId,
                programmingLanguage: codeSession.programmingLanguage,
              }),
            });

            console.log(`Session ${sessionId} deleted.`);
          }
        }, 360000); // 5 minutes
      }
    });
  });
};

const checkSessionForUser = (userId) => {
  const sessionForUser = sessionsForUser[userId];
  if (sessionForUser == undefined) {
    return {
      sessionId: null,
      matchedUserId: null,
      questionId: null
    };
  } else {
    return sessionForUser;
  }
};

module.exports = {
  joinSession,
  checkSessionForUser,
};
