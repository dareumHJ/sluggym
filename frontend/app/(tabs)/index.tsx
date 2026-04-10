import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>SlugGym</Text>
          <Text style={styles.subtitle}>UCSC Fitness Center</Text>
        </View>

        {/* Live Occupancy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Live Occupancy</Text>
          <View style={styles.occupancyRow}>
            <Text style={styles.occupancyNumber}>--</Text>
            <Text style={styles.occupancyCapacity}> / 120</Text>
          </View>
          <Text style={styles.occupancyLabel}>people right now</Text>
        </View>

        {/* Popular Times */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Popular Times</Text>
          <Text style={styles.placeholder}>Chart coming soon</Text>
        </View>

        {/* Equipment Availability */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipment</Text>
          <Text style={styles.placeholder}>Browse equipment catalog</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  occupancyNumber: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.primary,
  },
  occupancyCapacity: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  occupancyLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  placeholder: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
