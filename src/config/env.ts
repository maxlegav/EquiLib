/**
 * Environment configuration
 * Manages API keys and environment variables
 *
 * Note: In React Native/Expo, environment variables need to be configured
 * through app.config.js or passed at build time. For now, we use placeholders.
 */

export const ENV = {
  MISTRAL_API_KEY: '', // Will be configured via app.config.js or build-time env
  MISTRAL_API_URL: 'https://api.mistral.ai/v1',
  NODE_ENV: 'development',
};

/**
 * Validates that all required environment variables are set
 */
export const validateEnv = (): boolean => {
  if (!ENV.MISTRAL_API_KEY) {
    console.warn('Warning: MISTRAL_API_KEY is not set');
    return false;
  }
  return true;
};
