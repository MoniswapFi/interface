import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'btn-primary': '#F59855',
        'btn-black': '#222121',
        'content-gray': '#808080',
        'arrow-yellow': '#FE910A',
      },
      backgroundColor: {
        primary: '#000000',
        secondary: '#00B2FF',
        header: '#496347',
        footer: '#161616',
        black1: '#100F0F',
        navItemBackground: '#212121',
        navBackground: '#120F0F',
        navDefault: '#ABABAB',
        navSelected: '#FC8415',
      },
      fontFamily: {
        minecraft: 'Minecraft',
        luckiestGuy: 'LuckiestGuy',
        barlow: 'Barlow',
      },
      borderColor: {
        swapBox: '#494646',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
