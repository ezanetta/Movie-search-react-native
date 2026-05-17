import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useAccent } from '@/context/ThemeContext';

const PARTICLES = 8;
const RING_RADIUS = 22;

interface Particle {
  x: ReturnType<typeof useSharedValue<number>>;
  y: ReturnType<typeof useSharedValue<number>>;
  alpha: ReturnType<typeof useSharedValue<number>>;
  scale: ReturnType<typeof useSharedValue<number>>;
}

interface Props {
  filled: boolean;
  onToggle: () => void;
  size?: number;
  bgColor?: string;
}

function createParticle(): Particle {
  return {
    x: useSharedValue(0),
    y: useSharedValue(0),
    alpha: useSharedValue(0),
    scale: useSharedValue(0.4),
  };
}

export function StarButton({ filled, onToggle, size = 36, bgColor = 'rgba(255,255,255,0.92)' }: Props) {
  const accent = useAccent();

  const starScale = useSharedValue(1);
  const ringScale = useSharedValue(0);
  const ringAlpha = useSharedValue(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const particles: Particle[] = Array.from({ length: PARTICLES }, () => createParticle());

  const animatedStar = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }],
  }));

  const animatedRing = useAnimatedStyle(() => ({
    opacity: ringAlpha.value,
    transform: [{ scale: ringScale.value }],
  }));

  const handlePress = useCallback(() => {
    starScale.value = withSequence(
      withTiming(1.35, { duration: 100 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );

    if (!filled) {
      ringScale.value = 0;
      ringAlpha.value = 1;
      ringScale.value = withTiming(1.8, { duration: 600 });
      ringAlpha.value = withTiming(0, { duration: 600 });

      particles.forEach((p, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2;
        const dx = Math.cos(angle) * RING_RADIUS;
        const dy = Math.sin(angle) * RING_RADIUS;
        p.x.value = 0;
        p.y.value = 0;
        p.alpha.value = 0;
        p.scale.value = 0.4;
        p.x.value = withTiming(dx, { duration: 600 });
        p.y.value = withTiming(dy, { duration: 600 });
        p.alpha.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 450 }),
        );
        p.scale.value = withTiming(0.6, { duration: 600 });
      });
    }

    onToggle();
  }, [filled, onToggle, starScale, ringScale, ringAlpha, particles]);

  return (
    <Pressable onPress={handlePress} hitSlop={8} style={[styles.container, { width: size, height: size }]}>
      {/* Expanding ring */}
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: accent },
          animatedRing,
        ]}
      />

      {/* Confetti dots */}
      {particles.map((p, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const style = useAnimatedStyle(() => ({
          opacity: p.alpha.value,
          transform: [
            { translateX: p.x.value },
            { translateY: p.y.value },
            { scale: p.scale.value },
          ],
        }));
        return (
          <Animated.View
            key={i}
            style={[styles.particle, { backgroundColor: accent }, style]}
          />
        );
      })}

      {/* Button background + star */}
      <View style={[styles.bg, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
        <Animated.Text style={[styles.star, { color: filled ? accent : '#aaa', fontSize: size * 0.44 }, animatedStar]}>
          {filled ? '★' : '☆'}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    lineHeight: undefined,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
