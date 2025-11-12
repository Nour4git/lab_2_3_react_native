import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
};

export default App;