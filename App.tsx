import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { validateEnv } from './src/config/env';

/**
 * Main App Component
 * Entry point for the EquiLib iOS application
 */
export default function App() {
  useEffect(() => {
    // Validate environment variables on app start
    const isValid = validateEnv();
    if (!isValid) {
      console.warn('Some environment variables are missing. Check .env file.');
    }
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}
