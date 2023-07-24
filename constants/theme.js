import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const COLORS = {
  primary: "#f2f7fe",
  secondary: "#d2e3fe",
  accent: "#015be2",
  black: "#020202",
  gray: "#83829A",
  gray2: "#C1C0C8",
  
  main: "#191919",
  border: "#D9D9D9",

  theme1: "#5c5ec4",
  theme2:"#f0f0fc",
  btnGreen: "#4c79a1",
  btnSea: "#4c64a1",
  white: "#F3F4F8",
  lightGrey: 'rgba(247, 247, 247, 1)',
  lightWhite: "#FAFAFC",
  transparentBlack1: 'rgba(2, 2, 2, 0.1)',
  transparentBlack3: 'rgba(2, 2, 2, 0.3)',
  transparentBlack5: 'rgba(2, 2, 2, 0.5)',
  transparentBlack7: 'rgba(2, 2, 2, 0.7)',
  transparentBlack9: 'rgba(2, 2, 2, 0.9)',
  transparent: 'transparent'
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  padding: 24,
  width,
  height,
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
