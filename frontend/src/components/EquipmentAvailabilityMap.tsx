import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import { Radius, Size, Space, useTheme, withAlpha } from '../constants/theme';
import { Button, Card, SectionLabel } from './primitives';
import { EquipmentVisual } from './EquipmentVisual';
import { useEquipmentMap } from '../hooks/useEquipmentMap';
import { useNotifications } from '../contexts/NotificationContext';
import { buildEquipmentMapZones, type FloorName, type EquipmentMapZoneSummary } from '../data/equipmentMap';

const FLOORS: FloorName[] = ['1st floor', '2nd floor'];
const SHEET_DISMISS_DISTANCE = 120;
const SHEET_OFFSCREEN_Y = 720;

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
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useNotifications();
  const [floor, setFloor] = useState<FloorName>('1st floor');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const sheetTranslateY = useRef(new Animated.Value(0)).current;

  const zones = useMemo(() => buildEquipmentMapZones(equipment, statuses), [equipment, statuses]);
  const floorZones = useMemo(() => zones.filter((zone) => zone.floor === floor), [floor, zones]);
  const selectedZone = useMemo(
    () => floorZones.find((zone) => zone.id === selectedZoneId) ?? null,
    [floorZones, selectedZoneId],
  );
  const closeSelectedZone = useCallback(() => {
    Animated.timing(sheetTranslateY, {
      toValue: SHEET_OFFSCREEN_Y,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setSelectedZoneId(null);
      sheetTranslateY.setValue(0);
    });
  }, [sheetTranslateY]);
  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_event, gesture) => {
          if (gesture.dy > 0) sheetTranslateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy > SHEET_DISMISS_DISTANCE || gesture.vy > 1.1) {
            closeSelectedZone();
            return;
          }

          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        },
      }),
    [closeSelectedZone, sheetTranslateY],
  );

  useEffect(() => {
    if (selectedZoneId) sheetTranslateY.setValue(0);
  }, [selectedZoneId, sheetTranslateY]);

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
                <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: withAlpha(zone.color, 0.22), borderWidth: 1, borderColor: withAlpha(zone.color, 0.85), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: zone.color, fontSize: Size.xs, fontWeight: '900' }}>{zone.zoneNumber}</Text>
                </View>
                <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800', flex: 1 }}>{zone.name}</Text>
                <Text style={{ color: zone.totalCount === 0 ? t.textMuted : palette.text, fontSize: Size.xs, fontWeight: '800' }}>
                  {zone.totalCount === 0 ? 'No data' : `${zone.availableCount}/${zone.totalCount} · ${palette.label}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ position: 'relative', height: 420, borderRadius: Radius.xl, backgroundColor: t.bg, borderWidth: 1, borderColor: t.borderLight, overflow: 'hidden' }}>
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
                  borderRadius: Radius.md,
                  backgroundColor: withAlpha(zone.color, 0.72),
                  borderWidth: 1.5,
                  borderColor: withAlpha(zone.color, 0.96),
                  shadowColor: zone.color,
                  shadowOpacity: 0.16,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ minWidth: 24, height: 24, paddingHorizontal: 7, borderRadius: 12, backgroundColor: withAlpha('#000000', 0.28), borderWidth: 1, borderColor: withAlpha('#FFFFFF', 0.42), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: Size.xs, fontWeight: '900', lineHeight: 14 }}>{zone.zoneNumber}</Text>
                </View>
              </Pressable>
            ));
          })}
        </View>
      </Card>

      {selectedZone ? (
        <Modal
          transparent
          animationType="fade"
          visible={selectedZone !== null}
          onRequestClose={closeSelectedZone}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: Space.md, paddingTop: Space.xl, paddingBottom: Space.md }}>
            <Pressable
              onPress={closeSelectedZone}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.58)' }}
            />
            <Animated.View style={{ width: '100%', maxWidth: 420, alignSelf: 'center', height: '86%', transform: [{ translateY: sheetTranslateY }] }}>
              <Card style={{ flex: 1, gap: Space.md }}>
                <View style={{ alignItems: 'center', paddingBottom: 2 }} {...sheetPanResponder.panHandlers}>
                  <View style={{ width: 44, height: 5, borderRadius: Radius.full, backgroundColor: t.borderLight }} />
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Space.md }}
                  {...sheetPanResponder.panHandlers}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontSize: Size.lg, fontWeight: '800' }}>{selectedZone.name}</Text>
                    <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4 }}>
                      {selectedZone.availableCount} open · {selectedZone.totalCount} mapped stations
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close equipment zone popup"
                    onPress={closeSelectedZone}
                    style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}
                  >
                    <Text style={{ color: t.text, fontSize: Size.sm, fontWeight: '800' }}>Close</Text>
                  </Pressable>
                </View>

                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, alignSelf: 'flex-start', backgroundColor: withAlpha(selectedZone.color, 0.14) }}>
                  <Text style={{ color: selectedZone.color, fontSize: Size.sm, fontWeight: '800' }}>{floor}</Text>
                </View>

                {selectedZone.equipment.length === 0 ? (
                  <Text style={{ color: t.textSecondary, fontSize: Size.sm, lineHeight: 20 }}>
                    No live equipment rows are mapped to this zone yet.
                  </Text>
                ) : (
                  <ScrollView
                    nestedScrollEnabled
                    style={{ flex: 1 }}
                    contentContainerStyle={{ gap: Space.sm, paddingBottom: Space.md }}
                    showsVerticalScrollIndicator
                  >
                    {selectedZone.equipment.map((item) => {
                      const status = statuses[item.id] ?? 'unknown';
                      const palette = statusPalette(status, selectedZone.color);
                      const watching = isInWatchlist(item.id);
                      const occupied = status === 'occupied' || (item.quantity ?? 0) === 0;
                      return (
                        <View key={item.id} style={{ padding: Space.md, borderRadius: Radius.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.border }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.md }}>
                            <EquipmentVisual name={item.name} category={item.category} size="sm" color={selectedZone.color} />
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: t.text, fontSize: Size.md, fontWeight: '800' }}>{item.name}</Text>
                              <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 4, lineHeight: 18 }}>{item.category}</Text>
                            </View>
                            <Text style={{ color: palette.text, fontSize: Size.sm, fontWeight: '800' }}>
                              {status === 'free' ? 'Available' : status === 'occupied' ? 'Occupied' : 'Unknown'}
                            </Text>
                          </View>
                          {item.description ? (
                            <Text style={{ color: t.textSecondary, fontSize: Size.sm, marginTop: 8, lineHeight: 18 }}>{item.description}</Text>
                          ) : null}
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`${watching ? 'Disable' : 'Enable'} free notification for ${item.name}`}
                            onPress={() => (watching ? removeFromWatchlist(item.id) : addToWatchlist(item.id))}
                            style={{
                              alignSelf: 'flex-start',
                              marginTop: Space.sm,
                              paddingHorizontal: Space.md,
                              paddingVertical: 7,
                              borderRadius: Radius.full,
                              backgroundColor: watching ? t.primary : t.surface2,
                              borderWidth: 1,
                              borderColor: watching ? t.primary : t.borderLight,
                            }}
                          >
                            <Text style={{ color: watching ? t.onPrimary : t.text, fontSize: Size.xs, fontWeight: '800' }}>
                              {watching ? 'Notifying when free' : occupied ? 'Notify when free' : 'Notify if it becomes busy then free'}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </Card>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
