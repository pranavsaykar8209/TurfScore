import { useState } from 'react';

export const useMatchConsole = () => {
  const [joinCode, setJoinCode] = useState('');

  const handleCreateSession = () => {
    console.log('Navigate to create session');
    // Implement navigation to /create-session
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 6) {
      console.log('Join session with code:', joinCode);
      // Implement navigation to /session/:code
    }
  };

  return {
    joinCode,
    setJoinCode,
    handleCreateSession,
    handleJoinSession
  };
};
