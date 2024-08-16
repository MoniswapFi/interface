import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "btn-primary": "#F59855",
                "btn-black": "#222121",
                "content-gray": "#808080",
                "arrow-yellow": "#FE910A",
                yellow1: "#FFDF36",
                swapBox: "#494646",
                textlightgray: "#9A9888",
                textgray: "#A3A3A3",
                green1: "#2FFF0D",
                gold: "#FFC700",
                darkGold: "#7E3603",
                footer: "#161616",
                navDefault: "#ABABAB",
                navSelected: "#FC8415",
                gray1: "#CFCFCF",
                gray2: "#5A5B5A",
                lightblue: "#00B2FF",
            },
            backgroundColor: {
                primary: "#000000",
                secondary: "#00B2FF",
                header: "#496347",
                black1: "#100F0F",
                navItemBackground: "#212121",
                navBackground: "#120F0F",
                brightBlack: "#1E1E1E",
                darkBlack: "#000004",
                darkgray: "#47473F",
            },
            fontFamily: {
                minecraft: "Minecraft",
                luckiestGuy: "LuckiestGuy",
                barlow: "Barlow",
            },
            borderColor: {
                lightGray: "#33332D",
            },
        },
    },
    plugins: [nextui()],
};
export default config;
