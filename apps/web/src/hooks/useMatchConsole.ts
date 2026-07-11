import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useMatchConsole = () => {
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  const handleCreateSession = () => {
    navigate('/create-session');
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 6) {
      console.log('Join session with code:', joinCode);
      navigate(`/session/${joinCode}/matches`);
    }
  };

  return {
    joinCode,
    setJoinCode,
    handleCreateSession,
    handleJoinSession
  };
};
