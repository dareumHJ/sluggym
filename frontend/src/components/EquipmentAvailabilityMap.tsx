import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Button, Card, SectionLabel } from './primitives';
import { useEquipmentMap } from '../hooks/useEquipmentMap';
import { buildEquipmentMapZones, type FloorName, type EquipmentMapZoneSummary } from '../data/equipmentMap';

const FLOORS: FloorName[] = ['1st floor', '2nd floor'];

function statusPalette(status: EquipmentMapZoneSummary['status'], color: string) {
  if (status === 'free') {
    return { border: color, text: color, label: 'Open' };
  }

  if (status === 'occupied') {
    return { border: '#FF8A65', text: '#FF8A65', label: 'Busy' };
  }

  return { border: 'rgba(180,180,190,0.75)', text: '#B0B0BA', label: 'Unknown' };
}

function floorSummaryLabel(zones: EquipmentMapZoneSummary[]) {
  const total = zones.reduce((sum, zone) => sum + zone.totalCount, 0);
  const available = zones.reduce((sum, zone) => sum + zone.availableCount, 0);
  return `${available} of ${total} mapped stations currently open`;
}

function floorLegend(zones: EquipmentMapZoneSummary[]) {
  return [...zones].sort((a, b) => a.zoneNumber - b.zoneNumber);
}

export function EquipmentAvailabilityMap() {
  const t = useTheme();
  const { equipment, statuses, globalState, refresh } = useEquipmentMap();
  const [floor, setFloor] = useState<FloorName>('1st floor');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const zones = useMemo(() => buildEquipmentMapZones(equipment, statuses), [equipment, statuses]);
  const floorZones = useMemo(() => zones.filter((zone) => zone.floor === floor), [floor, zones]);
  const selectedZone = useMemo(
    () => floorZones.find((zone) => zone.id === selectedZoneId) ?? null,
    [floorZones, selectedZoneId],
  );

  const renderState = () => {
    if (globalState === 'loading') {
      return (
        <Card style={{ alignItems: 'center', gap: Space.sm }}>
          <ActivityIndicator color={t.primary} />
          <Text style={{ color: t.textSecondary, fontSize: Size.sm }}>Loading the equipment map…</Text>
        </Card>
      );
    }

    if (globalState === 'error') {
      return (
        <Card style={{ gap: Space.sm }}>
          <Text style={{ color: t.error, fontSize: Size.md, fontWeight: '800' }}>Could not load the equipment map</Text>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
            The live equipment feed is unavailable right now. Retry to refresh the map data.
          </Text>
          <Button title="Retry" variant="secondary" onPress={() => void refresh()} />
        </Card>
      );
    }

    if (globalState === 'empty') {
      return (
        <Card style={{ gap: Space.sm }}>
          <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>No mapped equipment is available yet</Text>
          <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
            Once live equipment rows are available, the map will show zone coverage and status at a glance.
          </Text>
          <Button title="Reload" variant="secondary" onPress={() => void refresh()} />
        </Card>
      );
    }

    return null;
  };

  if (globalState !== 'ready') {
    return (
      <View style={{ gap: Space.sm }}>
        <SectionLabel>Equipment Availability Map</SectionLabel>
        {renderState()}
      </View>
    );
  }

  return (
    <View style={{ gap: Space.md }}>
      <SectionLabel
        action={
          <Pressable onPress={() => void refresh()}>
            <Text style={{ color: t.primary, fontSize: Size.sm, fontWeight: '800' }}>Refresh</Text>
          </Pressable>
        }
      >
        Equipment Availability Map
      </SectionLabel>

      <View style={{ flexDirection: 'row', gap: Space.sm }}>
        {FLOORS.map((value) => {
          const active = floor === value;
          return (
            <Pressable
              key={value}
              onPress={() => {
                setFloor(value);
                setSelectedZoneId(null);
              }}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: Radius.full,
                backgroundColor: active ? t.primary : t.surface2,
                borderWidth: 1,
                borderColor: active ? t.primary : t.borderLight,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: active ? t.onPrimary : t.text, fontSize: Size.sm, fontWeight: '800' }}>{value}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={{ gap: Space.md }}>
        <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
          {floorSummaryLabel(floorZones)}
        </Text>

        <View style={{ position: 'relative', height: 420, borderRadius: Radius.xl, backgroundColor: t.bg, borderWidth: 2, borderColor: t.text, overflow: 'hidden' }}>
          {floorZones.map((zone) => {
            return zone.areas.map((area, index) => (
              <Pressable
                key={`${zone.id}:${index}`}
                accessibilityRole="button"
                accessibilityLabel={`Open ${zone.name} equipment popup`}
                onPress={() => setSelectedZoneId(zone.id)}
                style={{
                  position: 'absolute',
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                  borderRadius: 2,
                  backgroundColor: zone.color,
                  borderWidth: 1,
                  borderColor: withAlpha('#111111', 0.55),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', backgroundColor: withAlpha(zone.color, 0.82) }}>
                  <Text style={{ color: '#FFFFFF', fontSize: Size['2xl'], fontWeight: '900', lineHeight: 28 }}>{zone.zoneNumber}</Text>
                </View>
              </Pressable>
            ));
          })}
        </View>

        <View style={{ gap: Space.sm }}>
          {floorLegend(floorZones).map((zone) => {
            const palette = statusPalette(zone.status, zone.color);
            return (
              <Pressable
                key={zone.id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${zone.name} equipment popup`}
                onPress={() => setSelectedZoneId(zone.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Space.sm }}
              >
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: zone.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: Size.sm, fontWeight: '900' }}>{zone.zoneNumber}</Text>
                </View>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800', flex: 1 }}>{zone.name}</Text>
                <Text style={{ color: zone.totalCount === 0 ? t.textMuted : palette.text, fontSize: Size.xs, fontWeight: '800' }}>
                  {zone.totalCount === 0 ? 'No data' : `${zone.availableCount}/${zone.totalCount} · ${palette.label}`}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {selectedZone ? (
        <Modal
          transparent
          animationType="fade"
          visible={selectedZone !== null}
          onRequestClose={() => setSelectedZoneId(null)}
        >
          <View style={{ flex: 1, padding: Space.lg, backgroundColor: withAlpha('#000000', 0.62), justifyContent: 'center' }}>
            <Card style={{ maxHeight: '78%', gap: Space.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>{selectedZone.name}</Text>
                  <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>
                    {selectedZone.availableCount} open · {selectedZone.totalCount} mapped stations
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close equipment zone popup"
                  onPress={() => setSelectedZoneId(null)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: t.surface2 }}
                >
                  <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '900' }}>✕</Text>
                </Pressable>
              </View>

              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, alignSelf: 'flex-start', backgroundColor: withAlpha(selectedZone.color, 0.14) }}>
                <Text style={{ color: selectedZone.color, fontSize: Size.sm, fontWeight: '800' }}>{floor}</Text>
              </View>

              {selectedZone.equipment.length === 0 ? (
                <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                  No live equipment rows are mapped to this zone yet. For v1, this zone stays visible as a grey fallback.
                </Text>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: Space.sm }}>
                  {selectedZone.equipment.map((item) => {
                    const status = statuses[item.id] ?? 'unknown';
                    const palette = statusPalette(status, selectedZone.color);
                    return (
                      <View key={item.id} style={{ padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}>
                        <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{item.name}</Text>
                        <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4, lineHeight: 18 }}>{item.category}</Text>
                        {item.description ? (
                          <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 8, lineHeight: 18 }}>{item.description}</Text>
                        ) : null}
                        <Text style={{ color: palette.text, fontSize: Size.sm, fontWeight: '800', marginTop: 10 }}>
                          {status === 'free' ? 'Available now' : status === 'occupied' ? 'Currently occupied' : 'Status unavailable'}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </Card>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
