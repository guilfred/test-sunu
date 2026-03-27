import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Sora', sans-serif`,
    body: `'DM Sans', sans-serif`,
  },
  colors: {
    brand: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    navy: {
      700: "#0f1729",
      800: "#0b1120",
      900: "#060c16",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        solid: {
          fontWeight: "600",
          letterSpacing: "0.01em",
        },
      },
    },
    Badge: {
      baseStyle: {
        fontWeight: "600",
        letterSpacing: "0.05em",
        textTransform: "none",
        borderRadius: "full",
        px: 3,
        py: 1,
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "xl",
          boxShadow: "sm",
          border: "1px solid",
          borderColor: "gray.100",
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
  },
});

export default theme;
