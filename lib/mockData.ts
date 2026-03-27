import type { Dossier } from "@/types";

export const mockDossiers: Dossier[] = [
  {
    id: "d001",
    reference: "DOS-2025-001",
    type: "COUVERTURE_FACULTATIVE",
    dateDePot: "2025-05-10",
    statut: "EN_COURS",
    score: 72,
  },
  {
    id: "d002",
    reference: "DOS-2025-002",
    type: "PLACEMENT_REAS",
    dateDePot: "2025-05-12",
    statut: "ACCEPTE",
    score: 85,
  },
  {
    id: "d003",
    reference: "DOS-2025-003",
    type: "COTATION",
    dateDePot: "2025-05-14",
    statut: "REFUSE",
    score: 28,
  },
  {
    id: "d004",
    reference: "DOS-2025-004",
    type: "COUVERTURE_FACULTATIVE",
    dateDePot: "2025-05-15",
    statut: "EN_ATTENTE",
    score: 55,
  },
  {
    id: "d005",
    reference: "DOS-2025-005",
    type: "PLACEMENT_REAS",
    dateDePot: "2025-05-16",
    statut: "EN_COURS",
    score: 43,
  },
];

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchDossiers(): Promise<Dossier[]> {
  await delay(600);
  return [...mockDossiers];
}

export async function fetchDossierById(id: string): Promise<Dossier | null> {
  await delay(200);
  return mockDossiers.find((d) => d.id === id) ?? null;
}

export async function postDossier(
  payload: Omit<Dossier, "id" | "reference" | "dateDePot" | "score"> & {
    montant: number;
    duree: number;
    antecedentSinistre: boolean;
    description: string;
    scoreEstime: number;
  },
): Promise<{ reference: string }> {
  await delay(800);

  const year = new Date().getFullYear();
  const ref = `DOS-${year}-${String(mockDossiers.length + 1).padStart(3, "0")}`;

  return { reference: ref };
}
