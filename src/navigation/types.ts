/**
 * Navigation type definitions
 * Defines the structure of the navigation stack and tab navigators
 */

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  TriageResult: { resultId: string };
  PractitionerDetail: { practitionerId: string };
  BookingConfirmation: { practitionerId: string };
  CrisisEmergency: undefined;
};

export type MainTabParamList = {
  Chat: undefined;
  Triage: undefined;
  Practitioners: { triageResultId?: string };
  Profile: undefined;
};
