"use client";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function FolderIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { label: "Mes dossiers", href: "/dashboard", icon: <FolderIcon /> },
  { label: "Nouvelle demande", href: "/new", icon: <PlusCircleIcon /> },
];

function SidebarLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      style={{ textDecoration: "none" }}
      key={item.href}
      //item={item}
    >
      <HStack
        px={4}
        py={3}
        borderRadius="lg"
        spacing={3}
        bg={isActive ? "whiteAlpha.200" : "transparent"}
        color={isActive ? "white" : "whiteAlpha.700"}
        transition="all 0.15s"
        _hover={{
          bg: "whiteAlpha.100",
          color: "white",
        }}
        cursor="pointer"
      >
        <Box opacity={isActive ? 1 : 0.7}>{item.icon}</Box>
        <Text fontSize="sm" fontWeight={isActive ? "600" : "400"}>
          {item.label}
        </Text>
        {isActive && (
          <Box ml="auto" w="4px" h="4px" borderRadius="full" bg="indigo.300" />
        )}
      </HStack>
    </Link>
  );
}

export function SideBar({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh">
      <Box
        w="240px"
        minH="100vh"
        bg="#0f1729"
        flexShrink={0}
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        py={6}
        px={3}
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        {/* Logo */}
        <HStack px={4} mb={8} spacing={2}>
          <Box color="indigo.400">
            <ShieldIcon />
          </Box>
          <Text
            fontFamily="heading"
            fontSize="lg"
            fontWeight="700"
            color="white"
            letterSpacing="-0.02em"
          >
            Test Sunu
          </Text>
        </HStack>

        {/* Nav */}
        <VStack spacing={1} align="stretch" flex={1}>
          <Text
            px={4}
            mb={2}
            fontSize="10px"
            fontWeight="700"
            color="whiteAlpha.400"
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            Navigation
          </Text>
          {navItems.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
        </VStack>
      </Box>

      {/* Main content */}
      <Box flex={1} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
