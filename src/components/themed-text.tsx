import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'default'
  | 'display'
  | 'title'
  | 'subtitle'
  | 'small'
  | 'smallBold'
  | 'label'
  | 'muted';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  color?: string;
};

export function ThemedText({ style, type = 'default', color, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: color ?? theme.ink },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: 56,
    letterSpacing: -2,
  },
  title: {
    fontFamily: Fonts.displayBold,
    fontSize: 40,
    letterSpacing: -1.4,
    lineHeight: 40 * 0.95,
  },
  subtitle: {
    fontFamily: Fonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  default: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  muted: {
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
});
