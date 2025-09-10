export const colors = {
  primary: {
    main: "#008485",
    dark: "#006b6b",
    light: "#00a0a0",
    toastBg: "#E5F7F7",
  },
  secondary: {
    main: "#4a90e2",
    dark: "#357abd",
    light: "#6ba4e7",
  },
  success: {
    main: "#2ecc71",
    dark: "#27ae60",
    light: "#4cdd8c",
  },
  warning: {
    main: "#f1c40f",
    dark: "#f39c12",
    light: "#f4d03f",
  },
  danger: {
    main: "#e74c3c",
    dark: "#c0392b",
    light: "#e57373",
  },
  gray: {
    main: "#95a5a6",
    dark: "#7f8c8d",
    light: "#bdc3c7",
  },
  point: {
    main: "#e05274",
    dark: "#c73e5d",
    light: "#e5738b",
  },
  // 하나은행 브랜드 색상 팔레트
  hana: {
    mint: {
      main: "#00C9AB",
      dark: "#00A88C",
      light: "#33D4BC",
    },
    blue: {
      main: "#647FF4",
      dark: "#4A5FD1",
      light: "#8A9FF7",
    },
    red: {
      main: "#F0426B",
      dark: "#D62E55",
      light: "#F36B8A",
    },
    yellow: {
      main: "#FFBC4E",
      dark: "#E6A93F",
      light: "#FFC971",
    },
    purple: {
      main: "#B168E1",
      dark: "#9A4FC8",
      light: "#C189E8",
    },
    brown: {
      main: "#A77458",
      dark: "#8B5F47",
      light: "#B8907A",
    },
    green: {
      main: "#2ECC71",
      dark: "#27AE60",
      light: "#4CDD8C",
    },
  },
} as const;

export type ColorKey = keyof typeof colors;
export type ColorVariant = "main" | "dark" | "light";

export const getGradient = (
  color: ColorKey,
  direction: "to right" | "to bottom" = "to right"
) => {
  const colorObj = colors[color];
  if ("main" in colorObj && "dark" in colorObj) {
    return `linear-gradient(${direction}, ${colorObj.main}, ${colorObj.dark})`;
  }
  return `linear-gradient(${direction}, #008485, #006b6b)`;
};

// 하나은행 색상용 그라디언트 함수
export const getHanaGradient = (
  hanaColor: keyof typeof colors.hana,
  direction: "to right" | "to bottom" = "to right"
) => {
  const colorObj = colors.hana[hanaColor];
  return `linear-gradient(${direction}, ${colorObj.main}, ${colorObj.dark})`;
};
