import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { DossierList } from "@/components/DossierList";
import * as mockDataModule from "@/lib/mockData";
import type { Dossier } from "@/types";

// Mock the data fetching so tests run without real network
vi.mock("@/lib/mockData", async (importOriginal) => {
  const actual = await importOriginal<typeof mockDataModule>();
  return {
    ...actual,
    fetchDossiers: vi.fn(),
  };
});

const sampleDossiers: Dossier[] = [
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
];

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("DossierList", () => {
  beforeEach(() => {
    vi.mocked(mockDataModule.fetchDossiers).mockResolvedValue([...sampleDossiers]);
  });

  it("shows a skeleton loader while fetching", () => {
    renderWithChakra(<DossierList />);
    // Skeletons render immediately before data resolves
    const skeletons = document.querySelectorAll(".chakra-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders all dossiers after loading", async () => {
    renderWithChakra(<DossierList />);

    await waitFor(() => {
      expect(screen.getByText("DOS-2025-001")).toBeTruthy();
      expect(screen.getByText("DOS-2025-002")).toBeTruthy();
      expect(screen.getByText("DOS-2025-003")).toBeTruthy();
    });
  });

  it("filters dossiers by statut", async () => {
    renderWithChakra(<DossierList />);

    await waitFor(() => screen.getByText("DOS-2025-001"));

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "ACCEPTE");

    expect(screen.queryByText("DOS-2025-001")).toBeNull();
    expect(screen.getByText("DOS-2025-002")).toBeTruthy();
    expect(screen.queryByText("DOS-2025-003")).toBeNull();
  });

  it("filters dossiers by reference search", async () => {
    renderWithChakra(<DossierList />);

    await waitFor(() => screen.getByText("DOS-2025-001"));

    const input = screen.getByPlaceholderText(/rechercher/i);
    await userEvent.type(input, "002");

    expect(screen.queryByText("DOS-2025-001")).toBeNull();
    expect(screen.getByText("DOS-2025-002")).toBeTruthy();
    expect(screen.queryByText("DOS-2025-003")).toBeNull();
  });

  it("shows empty state when no dossiers match the filter", async () => {
    renderWithChakra(<DossierList />);

    await waitFor(() => screen.getByText("DOS-2025-001"));

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "EN_ATTENTE");

    expect(screen.getByText(/aucun dossier trouvé/i)).toBeTruthy();
  });

  it("displays an error message when fetch fails", async () => {
    vi.mocked(mockDataModule.fetchDossiers).mockRejectedValueOnce(
      new Error("Network error")
    );

    renderWithChakra(<DossierList />);

    await waitFor(() => {
      expect(screen.getByText(/impossible de charger/i)).toBeTruthy();
    });
  });

  it("renders the correct count label", async () => {
    renderWithChakra(<DossierList />);

    await waitFor(() => {
      expect(screen.getByText(/3 dossiers affichés/i)).toBeTruthy();
    });
  });
});
