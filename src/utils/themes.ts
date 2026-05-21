export const THEMES = [
  { id: "chrono", label: "Chrono Trigger" },
  { id: "8bit", label: "8-Bit (Super Mario Bros.)" },
] as const;

export type Theme = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: Theme = "chrono";

export function isTheme(value: string): value is Theme {
  return THEMES.some((theme) => theme.id === value);
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}
