# EquiLib - Mental Health Navigation iOS App

EquiLib is a voice-first mental health navigation iOS application that helps users navigate the French healthcare system. The app uses AI-powered conversation to understand user concerns, perform intelligent triage, and connect users with appropriate mental health practitioners via Doctolib integration.

## Features

- 🎤 Voice-first interface with on-device speech recognition (Whisper.cpp)
- 🤖 AI-powered empathetic conversation (Mistral Large)
- 🏥 Intelligent triage and specialist recommendations
- 🚨 Real-time crisis detection and emergency response
- 👨‍⚕️ Practitioner recommendations with Doctolib integration
- 🔒 Privacy-first with encrypted data storage (RGPD compliant)
- 🎨 Professional medical UI inspired by Doctolib

## Tech Stack

- **Framework**: Expo + React Native (TypeScript)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Speech-to-Text**: Whisper.cpp via whisper.rn (on-device)
- **AI/LLM**: Mistral Large via La Plateforme API
- **Text-to-Speech**: Moshi (Kyutai TTS)
- **Audio**: expo-av
- **Storage**: AsyncStorage + expo-secure-store
- **Network**: @react-native-community/netinfo

## Project Structure

```
app-psy-vocale/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── services/       # Business logic and API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── navigation/     # Navigation configuration
│   └── config/         # App configuration
├── assets/             # Images, icons, fonts
└── App.tsx            # Main app entry point
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Mistral API key
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_API_URL=https://api.mistral.ai/v1
NODE_ENV=development
```

## Development

- **Lint code**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`
- **Format code**: `npm run format`
- **Type check**: `npm run type-check`

## Requirements

- Node.js 18+
- iOS 13.0+
- Expo CLI
- Mistral API key

## License

ISC

## Status

🚧 **In Development** - Task 1 (Project Setup) Complete
