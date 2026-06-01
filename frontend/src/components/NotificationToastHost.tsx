// src/components/NotificationToastHost.tsx
// Renders the in-app upper toast queue from NotificationContext.
// Mount this once near the root of the app so toasts appear regardless of
// which tab the user is on.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, Space, Radius, Size, withAlpha } from '../constants/theme';
import { useNotifications } from '../contexts/NotificationContext';

export function NotificationToastHost() {
  const { toasts, onToastTap } = useNotifications();
  const t = useTheme();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 56, // below the status bar / safe area on most devices
        left: 0,
        right: 0,
        paddingHorizontal: Space.lg,
        gap: Space.sm,
        zIndex: 1000,
      }}
    >
      {toasts.map((toast) => (
        <Pressable
          key={toast.id}
          onPress={() => onToastTap(toast)}
          style={{
            backgroundColor: t.surface,
            borderRadius: Radius.lg,
            paddingHorizontal: Space.lg,
            paddingVertical: Space.md,
            borderWidth: 1,
            borderColor: withAlpha(t.success, 0.4),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: Space.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: t.success,
                fontSize: Size.xs,
                fontWeight: '900',
                letterSpacing: 1.0,
                textTransform: 'uppercase',
              }}
            >
              Now available
            </Text>
            <Text
              style={{
                color: t.text,
                fontSize: Size.md,
                fontWeight: '800',
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {toast.equipmentName}
            </Text>
          </View>
          <Text style={{ color: t.textMuted, fontSize: Size.xs, fontWeight: '700' }}>Tap →</Text>
        </Pressable>
      ))}
    </View>
  );
}
