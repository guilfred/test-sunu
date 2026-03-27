"use client";

import { DossierDetail } from "@/components/DossierDetail";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ALL_STATUTS, STATUT_LABELS, TYPE_LABELS } from "@/lib/labels";
import { fetchDossiers } from "@/lib/mockData";
import type { Dossier, DossierStatut } from "@/types";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

type SortKey = "date" | "score";
type SortOrder = "asc" | "desc";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "currentColor" : "#94a3b8"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {order === "asc" || !active ? (
        <path d="M12 5l-7 7h14l-7-7z" />
      ) : (
        <path d="M12 19l7-7H5l7 7z" />
      )}
    </svg>
  );
}

function TableRowSkeleton() {
  return (
    <Tr>
      {[...Array(5)].map((_, i) => (
        <Td key={i}>
          <Skeleton h="18px" borderRadius="md" />
        </Td>
      ))}
    </Tr>
  );
}

export function DossierList() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [statutFilter, setStatutFilter] = useState<DossierStatut | "TOUS">(
    "TOUS",
  );
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchDossiers()
      .then((data) => {
        if (!cancelled) setDossiers(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Impossible de charger les dossiers. Veuillez réessayer.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = [...dossiers];

    if (statutFilter !== "TOUS") {
      result = result.filter((d) => d.statut === statutFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.reference.toLowerCase().includes(q));
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal =
          sortKey === "date" ? new Date(a.dateDePot).getTime() : a.score;
        const bVal =
          sortKey === "date" ? new Date(b.dateDePot).getTime() : b.score;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [dossiers, statutFilter, search, sortKey, sortOrder]);

  function handleRowClick(dossier: Dossier) {
    setSelectedDossier(dossier);
    onOpen();
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  }

  return (
    <>
      <Box>
        <Flex
          gap={3}
          mb={5}
          flexWrap="wrap"
          align="center"
          justify="space-between"
        >
          <HStack spacing={3} flexWrap="wrap">
            <InputGroup maxW="260px" size="sm">
              <InputLeftElement pointerEvents="none" color="gray.400">
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder="Rechercher une référence…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="white"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                borderRadius="lg"
              />
            </InputGroup>

            {/* Status filter */}
            <Select
              size="sm"
              maxW="180px"
              value={statutFilter}
              onChange={(e) =>
                setStatutFilter(e.target.value as DossierStatut | "TOUS")
              }
              bg="white"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              borderRadius="lg"
              fontWeight="500"
            >
              <option value="TOUS">Tous les statuts</option>
              {ALL_STATUTS.map((s) => (
                <option key={s} value={s}>
                  {STATUT_LABELS[s]}
                </option>
              ))}
            </Select>
          </HStack>

          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Trier par
            </Text>
            <Button
              size="xs"
              variant={sortKey === "date" ? "solid" : "outline"}
              colorScheme={sortKey === "date" ? "brand" : "gray"}
              onClick={() => handleSort("date")}
              borderRadius="full"
              rightIcon={
                sortKey === "date" ? (
                  <SortIcon active order={sortOrder} />
                ) : undefined
              }
            >
              Date
            </Button>
            <Button
              size="xs"
              variant={sortKey === "score" ? "solid" : "outline"}
              colorScheme={sortKey === "score" ? "brand" : "gray"}
              onClick={() => handleSort("score")}
              borderRadius="full"
              rightIcon={
                sortKey === "score" ? (
                  <SortIcon active order={sortOrder} />
                ) : undefined
              }
            >
              Score
            </Button>
          </HStack>
        </Flex>

        {error && (
          <Alert status="error" borderRadius="xl" mb={4}>
            <AlertIcon />
            <AlertDescription fontSize="sm">{error}</AlertDescription>
          </Alert>
        )}

        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          overflow="hidden"
          boxShadow="sm"
        >
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="gray.50">
                  <Th
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color="gray.500"
                    py={3}
                    borderColor="gray.100"
                  >
                    Référence
                  </Th>
                  <Th
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color="gray.500"
                    py={3}
                    borderColor="gray.100"
                  >
                    Type
                  </Th>
                  <Th
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color="gray.500"
                    py={3}
                    borderColor="gray.100"
                    cursor="pointer"
                    onClick={() => handleSort("date")}
                    _hover={{ color: "gray.700" }}
                  >
                    <HStack spacing={1}>
                      <span>Date de dépôt</span>
                      <SortIcon active={sortKey === "date"} order={sortOrder} />
                    </HStack>
                  </Th>
                  <Th
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color="gray.500"
                    py={3}
                    borderColor="gray.100"
                  >
                    Statut
                  </Th>
                  <Th
                    fontSize="10px"
                    letterSpacing="0.08em"
                    color="gray.500"
                    py={3}
                    borderColor="gray.100"
                    cursor="pointer"
                    onClick={() => handleSort("score")}
                    _hover={{ color: "gray.700" }}
                  >
                    <HStack spacing={1}>
                      <span>Score</span>
                      <SortIcon
                        active={sortKey === "score"}
                        order={sortOrder}
                      />
                    </HStack>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </>
                ) : filtered.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={12} color="gray.400">
                      <VStack spacing={2}>
                        <Text fontSize="sm" fontWeight="500">
                          Aucun dossier trouvé
                        </Text>
                        <Text fontSize="xs" color="gray.300">
                          Modifiez vos filtres ou effectuez une nouvelle
                          demande.
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  filtered.map((dossier) => (
                    <Tr
                      key={dossier.id}
                      cursor="pointer"
                      _hover={{ bg: "gray.50" }}
                      onClick={() => handleRowClick(dossier)}
                      transition="background 0.1s"
                      borderColor="gray.50"
                    >
                      <Td py={3.5} borderColor="gray.50">
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="brand.700"
                          fontFamily="mono"
                          letterSpacing="-0.01em"
                        >
                          {dossier.reference}
                        </Text>
                      </Td>
                      <Td py={3.5} borderColor="gray.50">
                        <Text fontSize="sm" color="gray.600">
                          {TYPE_LABELS[dossier.type]}
                        </Text>
                      </Td>
                      <Td py={3.5} borderColor="gray.50">
                        <Text fontSize="sm" color="gray.500">
                          {format(new Date(dossier.dateDePot), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </Text>
                      </Td>
                      <Td py={3.5} borderColor="gray.50">
                        <StatusBadge statut={dossier.statut} size="sm" />
                      </Td>
                      <Td py={3.5} borderColor="gray.50">
                        <ScoreBadge score={dossier.score} size="sm" />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {!loading && !error && (
          <Text mt={3} fontSize="xs" color="gray.400" textAlign="right">
            {filtered.length} dossier{filtered.length !== 1 ? "s" : ""} affiché
            {filtered.length !== 1 ? "s" : ""}
            {filtered.length !== dossiers.length &&
              ` sur ${dossiers.length} au total`}
          </Text>
        )}
      </Box>

      <DossierDetail
        dossier={selectedDossier}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
