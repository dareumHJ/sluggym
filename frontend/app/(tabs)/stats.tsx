import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '../../src/constants/theme';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Stats</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Volume</Text>
          <Text style={styles.bigNumber}>--</Text>
          <Text style={styles.unit}>kg this month</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workouts</Text>
          <Text style={styles.bigNumber}>0</Text>
          <Text style={styles.unit}>sessions this month</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Records</Text>
          <Text style={styles.placeholder}>Complete workouts to track PRs</Text>
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
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '800',
    color: Colors.text,
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
  bigNumber: {
    fontSize: FontSize['4xl'],
    fontWeight: '800',
    color: Colors.primary,
  },
  unit: {
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
