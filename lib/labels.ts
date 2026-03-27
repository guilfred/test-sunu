import type { DossierStatut, DossierType } from "@/types";

export const STATUT_LABELS: Record<DossierStatut, string> = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  ACCEPTE: "Accepté",
  REFUSE: "Refusé",
};

export const STATUT_COLOR_SCHEME: Record<DossierStatut, string> = {
  EN_ATTENTE: "yellow",
  EN_COURS: "blue",
  ACCEPTE: "green",
  REFUSE: "red",
};

export const TYPE_LABELS: Record<DossierType, string> = {
  COUVERTURE_FACULTATIVE: "Couverture facultative",
  PLACEMENT_REAS: "Placement réassurance",
  COTATION: "Cotation",
};

export const ALL_STATUTS: DossierStatut[] = [
  "EN_ATTENTE",
  "EN_COURS",
  "ACCEPTE",
  "REFUSE",
];

export const ALL_TYPES: DossierType[] = [
  "COUVERTURE_FACULTATIVE",
  "PLACEMENT_REAS",
  "COTATION",
];
