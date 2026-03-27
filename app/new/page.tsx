import { CoverageForm } from "@/components/CoverageForm";
import { SideBar } from "@/components/layout/Sidebar";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { Metadata } from "next";
import { default as Link } from "next/link";

export const metadata: Metadata = {
  title: "Nouvelle demande — SousCover",
};

function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function NouvelleDemandePage() {
  return (
    <SideBar>
      <Box minH="100vh" bg="gray.50">
        {/* Page header */}
        <Box
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.100"
          px={8}
          py={6}
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={0.5}>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#94a3b8",
                  fontWeight: 500,
                  marginBottom: "4px",
                  textDecoration: "none",
                }}
              >
                <ArrowLeftIcon />
                Retour aux tableau de bord
              </Link>
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="700"
                color="gray.900"
                letterSpacing="-0.02em"
              >
                Nouvelle demande
              </Text>
              <Text fontSize="sm" color="gray.500">
                Soumettez une demande de couverture
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* Content */}
        <Box px={8} py={6} w={"full"}>
          <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            p={8}
            boxShadow="sm"
          >
            <CoverageForm />
          </Box>
        </Box>
      </Box>
    </SideBar>
  );
}
