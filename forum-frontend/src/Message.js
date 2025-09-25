import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export default function Message() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div style={{ padding: 20 }}>
      <h2>Auth Context Test</h2>
      <p>Current user: {user ? JSON.stringify(user) : 'No user set'}</p>
      <button onClick={() => setUser('Demo User')}>
        Set Demo User
      </button>
    </div>
  );
}
