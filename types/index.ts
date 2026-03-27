export type DossierStatut = "EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE";

export type DossierType =
  | "COUVERTURE_FACULTATIVE"
  | "PLACEMENT_REAS"
  | "COTATION";

export interface Dossier {
  id: string;
  reference: string;
  type: DossierType;
  dateDePot: string;
  statut: DossierStatut;
  score: number;
}

export interface DossierFilters {
  statut: DossierStatut | "TOUS";
  search: string;
  sortBy: "date" | "score" | null;
  sortOrder: "asc" | "desc";
}

export interface CoverageFormValues {
  type: DossierType;
  montant: number;
  duree: number;
  antecedentSinistre: boolean;
  description: string;
}

export interface ScoreCalculatorParams {
  type: DossierType;
  montant: number;
  duree: number;
  antecedentSinistre: boolean;
}
