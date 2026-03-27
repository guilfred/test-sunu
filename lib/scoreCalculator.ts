import type { ScoreCalculatorParams } from "@/types";

export function calculateScore(params: ScoreCalculatorParams): number {
  let score = 100;

  if (params.montant > 500000) score -= 30;
  if (params.duree > 12) score -= 20;
  if (params.antecedentSinistre) score -= 25;

  return Math.max(0, score);
}

export function getScoreLabel(score: number): string {
  if (score >= 60) return "Accepté";
  if (score >= 40) return "En";
  return "Refusé";
}

export function getScoreColorScheme(score: number): string {
  if (score >= 60) return "green";
  if (score >= 40) return "orange";
  return "red";
}
