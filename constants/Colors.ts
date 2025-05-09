/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    star: '#FFC107',
    bgPrimary: "#6D4C41",
    active: "#6D4C41",
    inactive: 'transparent',
    success: "#34C759",  // Vert éclatant - Idéal pour succès et validations
    error: "#FF3B30",    // Rouge vif - Idéal pour erreurs et alertes
    purple: "#8E44AD",   // Violet élégant - Pour des éléments distinctifs
    orange: "#FF9500",
    textSecondary: "#9BA1A6",
    primary: "#6D4C41"
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
}
