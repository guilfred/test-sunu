import { calculateScore } from "@/lib/scoreCalculator";
import { describe, expect, it } from "vitest";

describe("calculateScore", () => {
  it("returns 100 for an ideal profile", () => {
    expect(
      calculateScore({
        type: "COUVERTURE_FACULTATIVE",
        montant: 10_000,
        duree: 6,
        antecedentSinistre: false,
      }),
    ).toBe(100);
  });

  it("deducts 25 for antécédent de sinistre", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 10_000,
      duree: 6,
      antecedentSinistre: true,
    });
    expect(score).toBe(75);
  });

  it("deducts 30 for montant > 500k€", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 600_000,
      duree: 6,
      antecedentSinistre: false,
    });
    expect(score).toBe(70);
  });

  it("does not deduct for montant between 100k€ and 500k€", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 200_000,
      duree: 6,
      antecedentSinistre: false,
    });
    expect(score).toBe(100);
  });

  it("deducts 20 for durée > 12 mois", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 10_000,
      duree: 60,
      antecedentSinistre: false,
    });
    expect(score).toBe(80);
  });

  it("does not apply a bonus for PLACEMENT_REAS type", () => {
    const score = calculateScore({
      type: "PLACEMENT_REAS",
      montant: 10_000,
      duree: 6,
      antecedentSinistre: false,
    });
    expect(score).toBe(100);
  });

  it("never returns below 0", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 1_000_000,
      duree: 60,
      antecedentSinistre: true,
    });
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("cumulates all penalties correctly", () => {
    const score = calculateScore({
      type: "COUVERTURE_FACULTATIVE",
      montant: 1_000_000,
      duree: 60,
      antecedentSinistre: true,
    });
    expect(score).toBe(25);
  });

  it("never returns above 100", () => {
    const score = calculateScore({
      type: "PLACEMENT_REAS",
      montant: 1_000,
      duree: 1,
      antecedentSinistre: false,
    });
    expect(score).toBeLessThanOrEqual(100);
  });
});
