import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { Radius, useTheme } from '../constants/theme';
import { getExerciseImageFrameUrls } from '../lib/exerciseImages';

type Theme = ReturnType<typeof useTheme>;

type ExerciseThumbnailProps = {
  name: string;
  frameTick?: number;
  size?: number;
  theme?: Theme;
};

export function useExerciseImageFrameTick(exerciseNames: string[], enabled = true) {
  const [frameTick, setFrameTick] = useState(0);
  const hasAnimatedExerciseImages = useMemo(
    () => enabled && exerciseNames.some((name) => getExerciseImageFrameUrls(name).length > 1),
    [enabled, exerciseNames],
  );

  useEffect(() => {
    if (!hasAnimatedExerciseImages) return undefined;

    const interval = setInterval(() => {
      setFrameTick((current) => current + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, [hasAnimatedExerciseImages]);

  return frameTick;
}

export function ExerciseThumbnail({ name, frameTick = 0, size = 58, theme }: ExerciseThumbnailProps) {
  const fallbackTheme = useTheme();
  const t = theme ?? fallbackTheme;
  const previousName = useRef(name);
  const frameUrls = useMemo(() => getExerciseImageFrameUrls(name), [name]);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({});
  const availableFrameUrls = useMemo(() => frameUrls.filter((url) => !failedUrls[url]), [failedUrls, frameUrls]);
  const preferredImageUrl = availableFrameUrls.length > 0 ? availableFrameUrls[frameTick % availableFrameUrls.length] : null;
  const fallbackLoadedUrl = availableFrameUrls.find((url) => loadedUrls[url]) ?? null;
  const visibleImageUrl = preferredImageUrl && loadedUrls[preferredImageUrl]
    ? preferredImageUrl
    : fallbackLoadedUrl ?? preferredImageUrl;

  useEffect(() => {
    if (previousName.current === name) return;
    previousName.current = name;
    setFailedUrls({});
    setLoadedUrls({});
  }, [name]);

  useEffect(() => {
    let cancelled = false;

    for (const imageUrl of frameUrls) {
      const prefetchResult = Image.prefetch?.(imageUrl);
      if (!prefetchResult || typeof prefetchResult.then !== 'function') continue;

      void prefetchResult
        .then((loaded) => {
          if (cancelled) return;
          if (loaded) {
            setLoadedUrls((current) => (current[imageUrl] ? current : { ...current, [imageUrl]: true }));
          } else {
            setFailedUrls((current) => (current[imageUrl] ? current : { ...current, [imageUrl]: true }));
          }
        })
        .catch(() => {
          if (cancelled) return;
          setFailedUrls((current) => (current[imageUrl] ? current : { ...current, [imageUrl]: true }));
        });
    }

    return () => {
      cancelled = true;
    };
  }, [frameUrls]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Radius.md,
        backgroundColor: t.surface2,
        borderWidth: 1,
        borderColor: t.borderLight,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {visibleImageUrl ? (
        <Image
          source={{ uri: visibleImageUrl, cache: 'force-cache' }}
          accessibilityLabel={`${name} exercise image`}
          onLoad={() => setLoadedUrls((current) => (current[visibleImageUrl] ? current : { ...current, [visibleImageUrl]: true }))}
          onError={() => setFailedUrls((current) => (current[visibleImageUrl] ? current : { ...current, [visibleImageUrl]: true }))}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}
    </View>
  );
}
