import { createTamagui, createTokens } from 'tamagui';

const tokens = createTokens({
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 24,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
  },
  color: {
    shopeeOrange: '#EE4D2D',
    shopeeLight: '#FFF0ED',
    white: '#FFFFFF',
    black: '#1A1A1A',
    grayBg: '#F5F5F7',
    grayText: '#666666',
    borderGray: '#E5E7EB',
  },
});

export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: {
      background: tokens.color.white,
      color: tokens.color.black,
      borderColor: tokens.color.borderGray,
    },
    dark: {
      background: tokens.color.black,
      color: tokens.color.white,
      borderColor: tokens.color.borderGray,
    },
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;