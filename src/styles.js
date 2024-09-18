import { StyleSheet } from "react-native";

// DARK MODE
export const COLORS = {
  BACKGROUND: "#1e1e1e",
  BACKGROUND_RGB: "30, 30, 30,",
  BACKGROUND_HIGHLIGHT: "#252627",
  BACKGROUND_HIGHLIGHT_RGB: "39, 39, 39,",
  FOREGROUND: "#D8DEE9",
  ACCENT: "#5E81AC",
  SUBFOREGROUND: "#b1b7bf",
  SUBFOREGROUND_RGB: "216, 222, 233,",
  GREEN: "#A3DF95",
  YELLOW: "#FFDA61",
  RED: "#F75D55",
};

export const BACKGROUND = "#1e1e1e";
export const BACKGROUND_HIGHLIGHT = "#252627";
export const FOREGROUND = "#D8DEE9";
export const SUBFOREGROUND = "#cbd1db";
export const ACCENT = "#5E81AC";

export const FONT = "IBMPlexSans_500Medium";
export const REGULAR_FONT = "IBMPlexSans_500Medium";
export const BOLD_FONT = "IBMPlexSans_500Medium";

export const TIME_OPTIONS = {
  hours: "2-digit",
  minute: "2-digit",
};

export const BOTTOM_BAR_HEIGHT = 65;
export const TOP_BAR_HEIGHT = 50;

export const main = StyleSheet.create({
  flexHorizontal: {
    display: "flex",
    flexDirection: "column",
  },
});
