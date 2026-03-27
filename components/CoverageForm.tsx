"use client";

import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { ALL_TYPES, TYPE_LABELS } from "@/lib/labels";
import { postDossier } from "@/lib/mockData";
import {
  calculateScore,
  getScoreColorScheme,
  getScoreLabel,
} from "@/lib/scoreCalculator";
import type { DossierType } from "@/types";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Tag,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["COUVERTURE_FACULTATIVE", "PLACEMENT_REAS", "COTATION"], {
    required_error: "Veuillez sélectionner un type de demande.",
  }),
  montant: z
    .number({ invalid_type_error: "Montant invalide." })
    .positive("Le montant doit être un nombre positif.")
    .max(10_000_000, "Le montant ne peut pas dépasser 10 000 000 €."),
  duree: z
    .number({ invalid_type_error: "Durée invalide." })
    .int("La durée doit être un nombre entier.")
    .min(1, "La durée minimale est de 1 mois.")
    .max(60, "La durée maximale est de 60 mois."),
  antecedentSinistre: z.boolean(),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères.")
    .optional()
    .default(""),
});

type FormValues = z.infer<typeof schema>;

function InfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

interface ScorePreviewProps {
  score: number | null;
}

function ScorePreview({ score }: ScorePreviewProps) {
  if (score === null) {
    return (
      <Box
        p={5}
        borderRadius="xl"
        bg="gray.50"
        border="1px dashed"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="sm" color="gray.400">
          Renseignez les champs ci-dessus pour voir le score estimé.
        </Text>
      </Box>
    );
  }

  const colorScheme = getScoreColorScheme(score);
  const label = getScoreLabel(score);
  const bgColors: Record<string, string> = {
    green: "#f0fdf4",
    orange: "#fff7ed",
    red: "#fef2f2",
  };
  const borderColors: Record<string, string> = {
    green: "#bbf7d0",
    orange: "#fed7aa",
    red: "#fecaca",
  };
  const textColors: Record<string, string> = {
    green: "#166534",
    orange: "#9a3412",
    red: "#991b1b",
  };

  return (
    <Box
      p={5}
      borderRadius="xl"
      bg={bgColors[colorScheme]}
      border="1px solid"
      borderColor={borderColors[colorScheme]}
    >
      <HStack justify="space-between" mb={3}>
        <VStack align="start" spacing={0}>
          <Text
            fontSize="xs"
            fontWeight="700"
            color={textColors[colorScheme]}
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            Score estimé
          </Text>
          <Text fontSize="xs" color={textColors[colorScheme]} opacity={0.8}>
            {label}
          </Text>
        </VStack>
        <ScoreBadge score={score} size="lg" />
      </HStack>
      <Box
        bg={`${textColors[colorScheme]}22`}
        borderRadius="full"
        h="6px"
        overflow="hidden"
      >
        <Box
          h="full"
          w={`${score}%`}
          bg={textColors[colorScheme]}
          borderRadius="full"
          transition="width 0.5s cubic-bezier(0.4,0,0.2,1)"
          opacity={0.7}
        />
      </Box>
      <Text
        mt={3}
        fontSize="xs"
        color={textColors[colorScheme]}
        opacity={0.7}
        lineHeight="1.6"
      >
        Ce score est une estimation locale. Le score final sera calculé après
        validation par le service de souscription.
      </Text>
    </Box>
  );
}

interface SuccessStateProps {
  reference: string;
  onReset: () => void;
}

function SuccessState({ reference, onReset }: SuccessStateProps) {
  return (
    <Box textAlign="center" py={10}>
      <Box
        w={16}
        h={16}
        borderRadius="full"
        bg="green.50"
        border="2px solid"
        borderColor="green.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        mb={5}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </Box>
      <Text
        fontFamily="heading"
        fontSize="xl"
        fontWeight="700"
        color="gray.800"
        mb={2}
      >
        Demande soumise avec succès
      </Text>
      <Text fontSize="sm" color="gray.500" mb={1}>
        Votre dossier a été créé sous la référence
      </Text>
      <Text
        fontFamily="mono"
        fontSize="lg"
        fontWeight="700"
        color="brand.700"
        mb={8}
        letterSpacing="-0.01em"
      >
        {reference}
      </Text>
      <Button
        onClick={onReset}
        colorScheme="brand"
        borderRadius="full"
        size="sm"
        px={6}
      >
        Soumettre une nouvelle demande
      </Button>
    </Box>
  );
}

export function CoverageForm() {
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [estimatedScore, setEstimatedScore] = useState<number | null>(null);

  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      antecedentSinistre: false,
      description: "",
    },
  });

  const watchType = watch("type");
  const watchMontant = watch("montant");
  const watchDuree = watch("duree");
  const watchAntecedent = watch("antecedentSinistre");
  const watchDesc = watch("description") ?? "";

  useEffect(() => {
    if (watchType && watchMontant > 0 && watchDuree >= 1) {
      const score = calculateScore({
        type: watchType as DossierType,
        montant: watchMontant,
        duree: watchDuree,
        antecedentSinistre: watchAntecedent ?? false,
      });
      setEstimatedScore(score);
    } else {
      setEstimatedScore(null);
    }
  }, [watchType, watchMontant, watchDuree, watchAntecedent]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const score = calculateScore({
        type: values.type as DossierType,
        montant: values.montant,
        duree: values.duree,
        antecedentSinistre: values.antecedentSinistre,
      });

      const result = await postDossier({
        type: values.type as DossierType,
        montant: values.montant,
        duree: values.duree,
        antecedentSinistre: values.antecedentSinistre,
        description: values.description ?? "",
        statut: "EN_ATTENTE",
        scoreEstime: score,
      });

      setSuccessRef(result.reference);
    } catch {
      toast({
        title: "Erreur lors de la soumission",
        description: "Une erreur est survenue. Veuillez réessayer.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSuccessRef(null);
    setEstimatedScore(null);
    reset();
  }

  if (successRef) {
    return <SuccessState reference={successRef} onReset={handleReset} />;
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate w={"full"}>
      <Grid templateColumns={{ base: "1fr" }} gap={8} alignItems="start">
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.type} isRequired>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              Type de demande
            </FormLabel>
            <Select
              placeholder="Sélectionnez un type…"
              bg="white"
              borderColor="gray.200"
              borderRadius="lg"
              {...register("type")}
            >
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
            <FormErrorMessage fontSize="xs">
              {errors.type?.message}
            </FormErrorMessage>
          </FormControl>

          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl isInvalid={!!errors.montant} isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Montant demandé
              </FormLabel>
              <Controller
                name="montant"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <NumberInput
                    min={1}
                    max={10_000_000}
                    value={value ?? ""}
                    onChange={(_, val) =>
                      onChange(isNaN(val) ? undefined : val)
                    }
                    {...rest}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      borderRadius="lg"
                      placeholder="ex: 150 000"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormErrorMessage fontSize="xs">
                {errors.montant?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.duree} isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                Durée (mois)
              </FormLabel>
              <Controller
                name="duree"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <NumberInput
                    min={1}
                    max={60}
                    value={value ?? ""}
                    onChange={(_, val) =>
                      onChange(isNaN(val) ? undefined : val)
                    }
                    {...rest}
                  >
                    <NumberInputField
                      bg="white"
                      borderColor="gray.200"
                      borderRadius="lg"
                      placeholder="1 à 60"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormHelperText fontSize="xs" color="gray.400">
                Entre 1 et 60 mois
              </FormHelperText>
              <FormErrorMessage fontSize="xs">
                {errors.duree?.message}
              </FormErrorMessage>
            </FormControl>
          </Grid>

          {/* Antécédent sinistre */}
          <FormControl>
            <Box
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={watchAntecedent ? "orange.200" : "gray.200"}
              bg={watchAntecedent ? "orange.50" : "white"}
              transition="all 0.15s"
            >
              <Checkbox
                colorScheme="orange"
                {...register("antecedentSinistre")}
              >
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  Antécédent de sinistre
                </Text>
              </Checkbox>
              <Text fontSize="xs" color="gray.500" mt={1} ml={6}>
                Cochez cette case si vous avez déjà eu un sinistre déclaré.
                {watchAntecedent && (
                  <Text as="span" color="orange.600" fontWeight="500">
                    {" "}
                    Impact négatif sur le score (−30 pts).
                  </Text>
                )}
              </Text>
            </Box>
          </FormControl>

          {/* Description */}
          <FormControl isInvalid={!!errors.description}>
            <HStack justify="space-between" mb={1}>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.700" mb={0}>
                Description
              </FormLabel>
              <Text
                fontSize="xs"
                color={watchDesc.length > 450 ? "orange.500" : "gray.400"}
              >
                {watchDesc.length}/500
              </Text>
            </HStack>
            <Textarea
              rows={4}
              bg="white"
              borderColor="gray.200"
              borderRadius="lg"
              placeholder="Décrivez votre demande de couverture…"
              resize="vertical"
              {...register("description")}
            />
            <FormErrorMessage fontSize="xs">
              {errors.description?.message}
            </FormErrorMessage>
          </FormControl>

          <Divider borderColor="gray.100" />

          {/* Submit */}
          <HStack justify="flex-end" spacing={3}>
            <Button
              variant="ghost"
              colorScheme="gray"
              size="md"
              borderRadius="lg"
              onClick={handleReset}
              isDisabled={submitting}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              size="md"
              borderRadius="lg"
              px={8}
              isLoading={submitting}
              loadingText="Soumission…"
            >
              Soumettre
            </Button>
          </HStack>
        </VStack>

        {/* Right — score preview (sticky on lg+) */}
        <Box position={{ lg: "sticky" }} top={{ lg: "24px" }}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={2} color="gray.500">
              <InfoIcon />
              <Text
                fontSize="xs"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                Score estimé
              </Text>
            </HStack>
            <ScorePreview score={estimatedScore} />

            {/* Score breakdown hints */}
            <Box
              p={4}
              borderRadius="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
            >
              <Text
                fontSize="xs"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.06em"
                textTransform="uppercase"
                mb={3}
              >
                Règles de calcul
              </Text>
              <VStack spacing={2} align="stretch">
                {[
                  { label: "Base", value: "+100" },
                  { label: "Antécédent sinistre", value: "−30" },
                  { label: "Montant > 500k€", value: "−20" },
                  { label: "Montant > 100k€", value: "−10" },
                  { label: "Montant > 50k€", value: "−5" },
                  { label: "Durée > 48 mois", value: "−15" },
                  { label: "Durée > 24 mois", value: "−8" },
                  { label: "Durée > 12 mois", value: "−3" },
                  { label: "Type PLACEMENT_REAS", value: "+5" },
                ].map((rule) => (
                  <HStack key={rule.label} justify="space-between">
                    <Text fontSize="xs" color="gray.500">
                      {rule.label}
                    </Text>
                    <Tag
                      size="sm"
                      colorScheme={
                        rule.value.startsWith("+")
                          ? "green"
                          : rule.value === "−30"
                            ? "red"
                            : "orange"
                      }
                      variant="subtle"
                      fontWeight="700"
                      fontFamily="mono"
                      fontSize="10px"
                    >
                      {rule.value}
                    </Tag>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}
