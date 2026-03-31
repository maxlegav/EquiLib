import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockPractitioners } from '../data/mockData';
import { Practitioner } from '../types/models';

const availabilityLabels: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponible', color: Colors.success },
  limited: { label: 'Disponibilité limitée', color: Colors.warning },
  unavailable: { label: 'Non disponible', color: Colors.error },
};

const PractitionerCard: React.FC<{ practitioner: Practitioner }> = ({ practitioner }) => {
  const availability = availabilityLabels[practitioner.availabilityStatus] ?? availabilityLabels.unavailable;
  const nextSlot = practitioner.nextAvailableSlot
    ? new Date(practitioner.nextAvailableSlot).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <Card variant="elevated">
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {practitioner.firstName[0]}{practitioner.lastName[0]}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{practitioner.name}</Text>
          <Text style={styles.specialty}>{practitioner.specialty}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{'★'.repeat(Math.round(practitioner.rating))}</Text>
            <Text style={styles.ratingNumber}>{practitioner.rating} ({practitioner.reviewCount} avis)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{practitioner.profileDescription}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Adresse:</Text>
        <Text style={styles.detailValue}>
          {practitioner.address.street}, {practitioner.address.postalCode} {practitioner.address.city}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Langues:</Text>
        <Text style={styles.detailValue}>{practitioner.languages.join(', ')}</Text>
      </View>

      <View style={styles.availabilityRow}>
        <View style={[styles.availabilityDot, { backgroundColor: availability.color }]} />
        <Text style={styles.availabilityText}>{availability.label}</Text>
        {nextSlot && (
          <Text style={styles.nextSlot}> — prochain RDV: {nextSlot}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Prendre RDV sur Doctolib"
          onPress={() => Alert.alert(
            'Rendez-vous',
            `La prise de RDV avec ${practitioner.name} sera disponible prochainement via Doctolib.`,
          )}
          variant="primary"
        />
      </View>
    </Card>
  );
};

export const PractitionersScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Praticiens recommandés</Text>
      <Text style={styles.subtitle}>
        Basé sur votre orientation, voici les professionnels qui peuvent vous aider
      </Text>
      {mockPractitioners.map(p => (
        <PractitionerCard key={p.id} practitioner={p} />
      ))}
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
  title: {
    ...Typography.h2,
    color: Colors.deepNightBlue,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.doctolibBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.deepNightBlue,
  },
  specialty: {
    ...Typography.caption,
    color: Colors.doctolibBlue,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    color: Colors.warning,
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  ratingNumber: {
    ...Typography.small,
    color: Colors.gray700,
  },
  description: {
    ...Typography.body,
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.gray700,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  detailValue: {
    ...Typography.caption,
    color: Colors.gray900,
    flex: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.xs,
  },
  availabilityText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  nextSlot: {
    ...Typography.caption,
    color: Colors.gray700,
  },
  buttonRow: {
    marginTop: Spacing.xs,
  },
});
