import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Button, Card, SectionLabel } from './primitives';
import { useEquipmentMap } from '../hooks/useEquipmentMap';
import { buildEquipmentMapZones, type FloorName, type EquipmentMapZoneSummary } from '../data/equipmentMap';

const FLOORS: FloorName[] = ['1st floor', '2nd floor'];

function statusPalette(status: EquipmentMapZoneSummary['status'], color: string) {
  if (status === 'free') {
    return {
      fill: withAlpha(color, 0.26),
      border: withAlpha(color, 0.92),
      text: color,
      label: 'Open',
    };
  }

  if (status === 'occupied') {
    return {
      fill: withAlpha('#FF8A65', 0.22),
      border: withAlpha('#FF8A65', 0.92),
      text: '#FF8A65',
      label: 'Busy',
    };
  }

  return {
    fill: 'rgba(128,128,140,0.18)',
    border: 'rgba(180,180,190,0.55)',
    text: '#B0B0BA',
    label: 'Unknown',
  };
}

function floorSummaryLabel(zones: EquipmentMapZoneSummary[]) {
  const total = zones.reduce((sum, zone) => sum + zone.totalCount, 0);
  const available = zones.reduce((sum, zone) => sum + zone.availableCount, 0);
  return `${available} of ${total} mapped stations currently open`;
}

export function EquipmentAvailabilityMap() {
  const t = useTheme();
  const { equipment, statuses, globalState, refresh } = useEquipmentMap();
  const [floor, setFloor] = useState<FloorName>('1st floor');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const zones = useMemo(() => buildEquipmentMapZones(equipment, statuses), [equipment, statuses]);
  const floorZones = useMemo(() => zones.filter((zone) => zone.floor === floor), [floor, zones]);
  const selectedZone = useMemo(
    () => floorZones.find((zone) => zone.id === selectedZoneId) ?? floorZones[0] ?? null,
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

        <View style={{ position: 'relative', height: 240, borderRadius: Radius.xl, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border, overflow: 'hidden' }}>
          {floorZones.map((zone) => {
            const palette = statusPalette(zone.status, zone.color);
            return zone.areas.map((area, index) => (
              <Pressable
                key={`${zone.id}:${index}`}
                onPress={() => setSelectedZoneId(zone.id)}
                style={{
                  position: 'absolute',
                  left: `${area.left}%`,
                  top: `${area.top}%`,
                  width: `${area.width}%`,
                  height: `${area.height}%`,
                  padding: 8,
                  borderRadius: Radius.md,
                  backgroundColor: palette.fill,
                  borderWidth: 1,
                  borderColor: zone.totalCount === 0 ? withAlpha(t.textMuted, 0.35) : palette.border,
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: zone.totalCount === 0 ? t.textSecondary : palette.text, fontSize: 12, fontWeight: '800' }} numberOfLines={2}>
                  {zone.name}
                </Text>
                <View>
                  <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '800' }}>{zone.availableCount}/{zone.totalCount || 0}</Text>
                  <Text style={{ color: zone.totalCount === 0 ? t.textSecondary : palette.text, fontSize: 12, fontWeight: '700' }}>
                    {zone.totalCount === 0 ? 'No data yet' : palette.label}
                  </Text>
                </View>
              </Pressable>
            ));
          })}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm }}>
          {[
            { label: 'Open', color: '#4BC08A' },
            { label: 'Busy', color: '#FF8A65' },
            { label: 'Unknown', color: '#B0B0BA' },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: item.color }} />
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, fontWeight: '700' }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {selectedZone ? (
        <Card style={{ gap: Space.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>{selectedZone.name}</Text>
              <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>
                {selectedZone.availableCount} open · {selectedZone.totalCount} mapped stations
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: withAlpha(selectedZone.color, 0.14) }}>
              <Text style={{ color: selectedZone.color, fontSize: Size.sm, fontWeight: '800' }}>{floor}</Text>
            </View>
          </View>

          {selectedZone.equipment.length === 0 ? (
            <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
              No live equipment rows are mapped to this zone yet. For v1, this zone stays visible as a grey fallback.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Space.sm }}>
              {selectedZone.equipment.map((item) => {
                const status = statuses[item.id] ?? 'unknown';
                const palette = statusPalette(status, selectedZone.color);
                return (
                  <View key={item.id} style={{ minWidth: 168, padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}>
                    <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '800' }}>{item.name}</Text>
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
      ) : null}
    </View>
  );
}
