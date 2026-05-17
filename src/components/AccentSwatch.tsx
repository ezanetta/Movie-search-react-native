import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme, Fonts, lightTheme } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  color: string;
  name: string;
  selected: boolean;
  onSelect: (color: string) => void;
}

export function AccentSwatch({ color, name, selected, onSelect }: Props) {
  const { dark } = useTheme();
  const theme = dark ? darkTheme : lightTheme;

  return (
    <Pressable onPress={() => onSelect(color)} style={styles.wrapper}>
      {/* Outer ring: card-color gap then swatch-color border */}
      <View
        style={[
          styles.ring,
          {
            borderColor: selected ? color : 'transparent',
            backgroundColor: selected ? theme.card : 'transparent',
          },
        ]}>
        <View style={[styles.swatch, { backgroundColor: color }]}>
          {selected && <Text style={styles.check}>✓</Text>}
        </View>
      </View>
      <Text
        style={[
          styles.name,
          {
            color: selected ? theme.ink : theme.muted,
            fontFamily: selected ? Fonts.bodyBold : Fonts.bodyRegular,
          },
        ]}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  ring: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  name: {
    fontSize: 11,
  },
});
