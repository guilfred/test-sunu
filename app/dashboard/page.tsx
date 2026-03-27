import { DossierList } from "@/components/DossierList";
import { SideBar } from "@/components/layout/Sidebar";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mes dossiers — SousCover",
};

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function DossiersPage() {
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
            <VStack align="start" spacing={0}>
              <Text
                fontFamily="heading"
                fontSize="xl"
                fontWeight="700"
                color="gray.900"
                letterSpacing="-0.02em"
              >
                Mes dossiers
              </Text>
              <Text fontSize="sm" color="gray.500">
                Suivi de vos demandes de couverture
              </Text>
            </VStack>
            <Link href="/new">
              <Button>Nouvelle demande</Button>
            </Link>
          </Flex>
        </Box>

        {/* Content */}
        <Box px={8} py={6}>
          <DossierList />
        </Box>
      </Box>
    </SideBar>
  );
}
