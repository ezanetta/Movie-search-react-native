import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  surface?: 'paper' | 'card';
};

export function ThemedView({ style, surface = 'paper', ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  return (
    <View style={[{ backgroundColor: theme[surface] }, style]} {...otherProps} />
  );
}
