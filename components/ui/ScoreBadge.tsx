import { Box, HStack, Text, Circle } from "@chakra-ui/react";
import { getScoreColorScheme, getScoreLabel } from "@/lib/scoreCalculator";

interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<string, { dot: string; text: string; bg: string }> = {
  green: { dot: "#16a34a", text: "#15803d", bg: "#f0fdf4" },
  orange: { dot: "#ea580c", text: "#c2410c", bg: "#fff7ed" },
  red: { dot: "#dc2626", text: "#b91c1c", bg: "#fef2f2" },
};

export function ScoreBadge({ score, showLabel = false, size = "md" }: ScoreBadgeProps) {
  const colorScheme = getScoreColorScheme(score);
  const colors = colorMap[colorScheme];
  const label = getScoreLabel(score);

  const fontSizeMap = { sm: "11px", md: "13px", lg: "15px" };
  const fontSize = fontSizeMap[size];

  return (
    <HStack
      spacing={2}
      display="inline-flex"
      bg={colors.bg}
      px={size === "sm" ? 2 : 3}
      py={size === "sm" ? 0.5 : 1}
      borderRadius="full"
    >
      <Circle size="6px" bg={colors.dot} />
      <Text
        fontSize={fontSize}
        fontWeight="700"
        color={colors.text}
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {score}
      </Text>
      {showLabel && (
        <Text fontSize={fontSize} color={colors.text} fontWeight="500">
          — {label}
        </Text>
      )}
    </HStack>
  );
}
