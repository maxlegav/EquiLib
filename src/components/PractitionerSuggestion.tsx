import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles';
import { Practitioner } from '../types/models';
import { mockPractitioners } from '../data/mockData';

const availabilityColor: Record<string, string> = {
  available: Colors.success,
  limited: Colors.warning,
  unavailable: Colors.error,
};

const availabilityLabel: Record<string, string> = {
  available: 'Available',
  limited: 'Limited slots',
  unavailable: 'Unavailable',
};

const PractitionerModal: React.FC<{
  practitioner: Practitioner;
  onClose: () => void;
}> = ({ practitioner, onClose }) => {
  const nextSlot = practitioner.nextAvailableSlot
    ? new Date(practitioner.nextAvailableSlot).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose}>
            <Text style={modal.closeText}>✕</Text>
          </TouchableOpacity>

          <Image source={{ uri: practitioner.photo }} style={modal.photo} />
          <Text style={modal.name}>{practitioner.name}</Text>
          <Text style={modal.specialty}>{practitioner.specialty}</Text>

          <View style={modal.ratingRow}>
            <Text style={modal.stars}>{'★'.repeat(Math.round(practitioner.rating))}</Text>
            <Text style={modal.ratingText}>{practitioner.rating} ({practitioner.reviewCount} reviews)</Text>
          </View>

          <Text style={modal.description}>{practitioner.profileDescription}</Text>

          <View style={modal.infoRow}>
            <Text style={modal.infoLabel}>Address</Text>
            <Text style={modal.infoValue}>
              {practitioner.address.street}, {practitioner.address.postalCode} {practitioner.address.city}
            </Text>
          </View>

          <View style={modal.infoRow}>
            <Text style={modal.infoLabel}>Languages</Text>
            <Text style={modal.infoValue}>{practitioner.languages.join(', ')}</Text>
          </View>

          {nextSlot && (
            <View style={modal.infoRow}>
              <Text style={modal.infoLabel}>Next slot</Text>
              <Text style={modal.infoValue}>{nextSlot}</Text>
            </View>
          )}

          <View style={modal.buttonGroup}>
            <TouchableOpacity
              style={[modal.button, modal.buttonPrimary]}
              onPress={() =>
                Alert.alert('Doctolib', `Booking with ${practitioner.name} via Doctolib — coming soon.`)
              }
            >
              <Text style={modal.buttonPrimaryText}>Book on Doctolib</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modal.button, modal.buttonSecondary]}
              onPress={() =>
                Alert.alert('In-app booking', `Your appointment request with ${practitioner.name} has been sent.`)
              }
            >
              <Text style={modal.buttonSecondaryText}>Book here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const PractitionerSuggestion: React.FC = () => {
  const [selected, setSelected] = useState<Practitioner | null>(null);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Suggested for you</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {mockPractitioners.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => setSelected(p)}>
            <Image source={{ uri: p.photo }} style={styles.avatar} />
            <View style={[styles.dot, { backgroundColor: availabilityColor[p.availabilityStatus] }]} />
            <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
            <Text style={styles.specialty} numberOfLines={2}>{p.specialty}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{p.rating}</Text>
            </View>
            <Text style={styles.availability}>{availabilityLabel[p.availabilityStatus]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected && (
        <PractitionerModal practitioner={selected} onClose={() => setSelected(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.gray700,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  row: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  card: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    padding: Spacing.sm,
    alignItems: 'center',
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.gray100,
  },
  dot: {
    position: 'absolute',
    top: 52,
    right: 44,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.deepNightBlue,
    textAlign: 'center',
  },
  specialty: {
    ...Typography.small,
    color: Colors.doctolibBlue,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    color: Colors.warning,
    fontSize: 12,
  },
  rating: {
    ...Typography.small,
    color: Colors.gray700,
  },
  availability: {
    ...Typography.small,
    color: Colors.gray700,
    marginTop: 2,
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: Spacing.xs,
  },
  closeText: {
    fontSize: 18,
    color: Colors.gray700,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray100,
  },
  name: {
    ...Typography.h3,
    color: Colors.deepNightBlue,
    textAlign: 'center',
  },
  specialty: {
    ...Typography.caption,
    color: Colors.doctolibBlue,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  stars: {
    color: Colors.warning,
    fontSize: 14,
  },
  ratingText: {
    ...Typography.small,
    color: Colors.gray700,
  },
  description: {
    ...Typography.body,
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  infoLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.gray700,
    width: 80,
  },
  infoValue: {
    ...Typography.caption,
    color: Colors.gray900,
    flex: 1,
  },
  buttonGroup: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.doctolibBlue,
  },
  buttonPrimaryText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  buttonSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.doctolibBlue,
  },
  buttonSecondaryText: {
    ...Typography.bodyBold,
    color: Colors.doctolibBlue,
  },
});
