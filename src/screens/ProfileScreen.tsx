import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const mockProfile = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@email.com',
  city: 'Paris',
  postalCode: '75011',
  conversationCount: 3,
  lastConversation: 'Aujourd\'hui',
};

export const ProfileScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Card variant="elevated">
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {mockProfile.firstName[0]}{mockProfile.lastName[0]}
            </Text>
          </View>
          <Text style={styles.name}>{mockProfile.firstName} {mockProfile.lastName}</Text>
          <Text style={styles.email}>{mockProfile.email}</Text>
          <Text style={styles.location}>{mockProfile.city} ({mockProfile.postalCode})</Text>
        </View>
      </Card>

      {/* Stats */}
      <Card variant="elevated">
        <Text style={styles.sectionTitle}>Activité</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockProfile.conversationCount}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Orientation</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockProfile.lastConversation}</Text>
            <Text style={styles.statLabel}>Dernière session</Text>
          </View>
        </View>
      </Card>

      {/* Settings */}
      <Card variant="elevated">
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.gray200, true: Colors.doctolibBlue }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mode sombre</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.gray200, true: Colors.doctolibBlue }}
          />
        </View>
      </Card>

      {/* Privacy */}
      <Card variant="elevated">
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <Text style={styles.privacyText}>
          Vos conversations sont stockées localement sur votre appareil. Aucune donnée personnelle
          n'est partagée avec des tiers. Vous pouvez supprimer toutes vos données à tout moment.
        </Text>
        <View style={styles.deleteSection}>
          <Button
            title="Supprimer toutes mes données"
            onPress={() => {}}
            variant="crisis"
          />
        </View>
      </Card>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>EquiLib v1.0.0</Text>
        <Text style={styles.footerText}>En cas d'urgence, contactez le 3114</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.doctolibBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.white,
  },
  name: {
    ...Typography.h2,
    color: Colors.deepNightBlue,
  },
  email: {
    ...Typography.body,
    color: Colors.gray700,
    marginTop: Spacing.xs,
  },
  location: {
    ...Typography.caption,
    color: Colors.gray700,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.deepNightBlue,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.doctolibBlue,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.gray700,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray200,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.gray900,
  },
  privacyText: {
    ...Typography.body,
    color: Colors.gray700,
    lineHeight: 24,
  },
  deleteSection: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerText: {
    ...Typography.small,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
});
