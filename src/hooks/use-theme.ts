import { darkTheme, lightTheme, Theme } from '@/constants/theme';
import { useTheme as useThemeContext } from '@/context/ThemeContext';

export function useTheme(): Theme & { accent: string } {
  const { dark, accent } = useThemeContext();
  return { ...(dark ? darkTheme : lightTheme), accent };
}
