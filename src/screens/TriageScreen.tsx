import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../styles';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockTriageResult } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';

export const TriageScreen: React.FC = () => {
  const navigation = useNavigation();
  const result = mockTriageResult;

  return (
    <ScrollView style={styles.container}>
      <Card variant="elevated">
        <Text style={styles.title}>🎯 Votre Orientation</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Préoccupation principale:</Text>
          <Text style={styles.value}>{result.primaryConcern}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Spécialiste recommandé:</Text>
          <Text style={styles.value}>{result.recommendedSpecialist}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Niveau de priorité:</Text>
          <View style={styles.severityBar}>
            {[...Array(10)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.severityDot,
                  i < result.severityLevel && styles.severityDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.summary}>{result.summary}</Text>
        </View>

        <Button
          title="Voir les praticiens"
          onPress={() => navigation.navigate('Practitioners' as never)}
          variant="primary"
        />

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Ceci est une orientation, pas un diagnostic médical
          </Text>
        </View>
      </Card>

      <View style={styles.emergency}>
        <Text style={styles.emergencyText}>
          En cas d'urgence, contactez le 3114
        </Text>
        <Text style={styles.emergencySubtext}>
          Numéro National de Prévention du Suicide - 24h/24, 7j/7
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.deepNightBlue,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.caption,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.gray900,
  },
  severityBar: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  severityDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray200,
  },
  severityDotActive: {
    backgroundColor: Colors.doctolibBlue,
  },
  summary: {
    ...Typography.body,
    color: Colors.gray900,
    lineHeight: 24,
  },
  disclaimer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.gray700,
    textAlign: 'center',
  },
  emergency: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.crisis,
    borderRadius: 12,
  },
  emergencyText: {
    ...Typography.h3,
    color: Colors.white,
    textAlign: 'center',
  },
  emergencySubtext: {
    ...Typography.caption,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
