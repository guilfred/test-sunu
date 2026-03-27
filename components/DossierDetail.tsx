"use client";

import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TYPE_LABELS } from "@/lib/labels";
import { getScoreLabel } from "@/lib/scoreCalculator";
import type { Dossier } from "@/types";
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DossierDetailProps {
  dossier: Dossier | null;
  isOpen: boolean;
  onClose: () => void;
}

function MetaField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Text
        fontSize="10px"
        fontWeight="700"
        color="gray.400"
        letterSpacing="0.08em"
        textTransform="uppercase"
        mb={1}
      >
        {label}
      </Text>
      {children}
    </Box>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const pct = `${score}%`;
  const color = score >= 60 ? "#16a34a" : score >= 40 ? "#ea580c" : "#dc2626";
  const bgColor = score >= 60 ? "#dcfce7" : score >= 40 ? "#ffedd5" : "#fee2e2";

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="xs" color="gray.500" fontWeight="500">
          Score de risque
        </Text>
        <Text fontSize="xs" color="gray.500">
          {getScoreLabel(score)}
        </Text>
      </HStack>
      <Box bg={bgColor} borderRadius="full" h="8px" overflow="hidden">
        <Box
          h="full"
          w={pct}
          bg={color}
          borderRadius="full"
          transition="width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
        />
      </Box>
      <HStack justify="space-between" mt={1}>
        <Text fontSize="10px" color="gray.400">
          0 — Risque élevé
        </Text>
        <Text fontSize="10px" color="gray.400">
          100 — Faible risque
        </Text>
      </HStack>
    </Box>
  );
}

export function DossierDetail({
  dossier,
  isOpen,
  onClose,
}: DossierDetailProps) {
  if (!dossier) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay backdropFilter="blur(2px)" bg="blackAlpha.300" />
      <DrawerContent
        borderLeftRadius="2xl"
        mx={2}
        my={2}
        h="calc(100vh - 16px)"
        boxShadow="xl"
      >
        <DrawerCloseButton top={4} right={4} borderRadius="full" />

        <DrawerHeader borderBottom="1px solid" borderColor="gray.100" pb={4}>
          <VStack align="start" spacing={1}>
            <Text
              fontFamily="mono"
              fontSize="sm"
              fontWeight="700"
              color="brand.700"
              letterSpacing="-0.01em"
            >
              {dossier.reference}
            </Text>
            <Text fontSize="xs" color="gray.400" fontFamily="body">
              Détail du dossier
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Score gauge */}
            <Box
              p={5}
              borderRadius="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack justify="space-between" mb={4}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  Évaluation du risque
                </Text>
                <ScoreBadge score={dossier.score} showLabel size="md" />
              </HStack>
              <ScoreGauge score={dossier.score} />
            </Box>

            <Divider borderColor="gray.100" />

            <Grid templateColumns="1fr 1fr" gap={5}>
              <MetaField label="Type de demande">
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  {TYPE_LABELS[dossier.type]}
                </Text>
              </MetaField>

              <MetaField label="Statut">
                <StatusBadge statut={dossier.statut} />
              </MetaField>

              <MetaField label="Date de dépôt">
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  {format(new Date(dossier.dateDePot), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })}
                </Text>
              </MetaField>

              <MetaField label="Identifiant">
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.500"
                  fontFamily="mono"
                >
                  {dossier.id}
                </Text>
              </MetaField>
            </Grid>

            <Divider borderColor="gray.100" />

            {/* Status description */}
            <Box
              p={4}
              borderRadius="lg"
              bg={
                dossier.statut === "ACCEPTE"
                  ? "green.50"
                  : dossier.statut === "REFUSE"
                    ? "red.50"
                    : dossier.statut === "EN_COURS"
                      ? "blue.50"
                      : "yellow.50"
              }
              border="1px solid"
              borderColor={
                dossier.statut === "ACCEPTE"
                  ? "green.100"
                  : dossier.statut === "REFUSE"
                    ? "red.100"
                    : dossier.statut === "EN_COURS"
                      ? "blue.100"
                      : "yellow.100"
              }
            >
              <Text
                fontSize="xs"
                color={
                  dossier.statut === "ACCEPTE"
                    ? "green.700"
                    : dossier.statut === "REFUSE"
                      ? "red.700"
                      : dossier.statut === "EN_COURS"
                        ? "blue.700"
                        : "yellow.700"
                }
                lineHeight="1.6"
              >
                {dossier.statut === "ACCEPTE" &&
                  "Ce dossier a été examiné et accepté par le service de souscription. La couverture est en cours de mise en place."}
                {dossier.statut === "REFUSE" &&
                  "Ce dossier a été refusé suite à l'analyse du profil de risque. Vous pouvez soumettre une nouvelle demande avec un montant ou une durée différents."}
                {dossier.statut === "EN_COURS" &&
                  "Ce dossier est en cours d'examen par notre équipe. Vous serez notifié dès qu'une décision sera rendue."}
                {dossier.statut === "EN_ATTENTE" &&
                  "Ce dossier est en attente de traitement. Il sera pris en charge prochainement par le service de souscription."}
              </Text>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
