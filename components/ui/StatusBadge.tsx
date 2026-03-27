import { Badge } from "@chakra-ui/react";
import type { DossierStatut } from "@/types";
import { STATUT_COLOR_SCHEME, STATUT_LABELS } from "@/lib/labels";

interface StatusBadgeProps {
  statut: DossierStatut;
  size?: "sm" | "md";
}

export function StatusBadge({ statut, size = "md" }: StatusBadgeProps) {
  return (
    <Badge
      colorScheme={STATUT_COLOR_SCHEME[statut]}
      variant="subtle"
      fontSize={size === "sm" ? "10px" : "11px"}
      fontWeight="600"
      letterSpacing="0.04em"
      px={size === "sm" ? 2 : 3}
      py={0.5}
      borderRadius="full"
      textTransform="none"
    >
      {STATUT_LABELS[statut]}
    </Badge>
  );
}
