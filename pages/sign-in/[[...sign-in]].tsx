import { Box, Button, Card, Container, Group, Image, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  clearStoredSignInIdentifier,
  getStoredSignInIdentifier,
} from "@/lib/signInIdentifierCookie";

export default function Login() {
  const { signIn, fetchStatus } = useSignIn();
  const { query } = useRouter();
  const redirectUrlParam = query.redirect_url;
  const redirectUrl =
    (typeof redirectUrlParam === "string"
      ? redirectUrlParam
      : Array.isArray(redirectUrlParam)
        ? redirectUrlParam[0]
        : undefined) ?? "/";

  const enterpriseConnectionId =
    process.env.NEXT_PUBLIC_CLERK_ENTERPRISE_CONNECTION_ID;
  const [enterpriseSsoIdentifier, setEnterpriseSsoIdentifier] = useState<
    string | null
  >(null);

  useEffect(() => {
    setEnterpriseSsoIdentifier(
      getStoredSignInIdentifier() ??
        process.env.NEXT_PUBLIC_CLERK_ENTERPRISE_SSO_IDENTIFIER ??
        null
    );
  }, []);

  const clearStoredEmail = () => {
    clearStoredSignInIdentifier();
    setEnterpriseSsoIdentifier(
      process.env.NEXT_PUBLIC_CLERK_ENTERPRISE_SSO_IDENTIFIER ?? null
    );
    notifications.show({
      title: "Saved email cleared",
      message: "The stored sign-in email cookie has been deleted.",
      color: "green",
    });
  };

  return (
    <Container size="xl">
      <Group justify="center" mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
          <Card.Section>
            <Box
              component="button"
              type="button"
              onClick={clearStoredEmail}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Clear saved sign-in email"
            >
              <Image
                src="/secure.svg"
                width="auto"
                height={300}
                fit="contain"
                alt="Secure Login"
                p={20}
              />
            </Box>
          </Card.Section>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>Please sign in!</Text>
          </Group>

          <Text size="sm" c="dimmed">
            This app is only accessible to authenticated users. Please sign
            in to continue.
          </Text>

          <Button
            fullWidth
            mt="md"
            radius="md"
            disabled={
              !enterpriseConnectionId ||
              !enterpriseSsoIdentifier ||
              fetchStatus === "fetching"
            }
            onClick={() =>
              signIn?.sso({
                strategy: "enterprise_sso",
                enterpriseConnectionId,
                identifier: enterpriseSsoIdentifier ?? undefined,
                redirectUrl,
                redirectCallbackUrl: redirectUrl,
              })
            }
          >
            Sign in with Microsoft
          </Button>
          {(!enterpriseConnectionId || !enterpriseSsoIdentifier) && (
            <Text mt="xs" size="xs" c="red">
              No saved sign-in email was found. Sign in once with the fallback
              Clerk identifier env var, or restore the cookie.
            </Text>
          )}
          <Text
            mt={20}
            c="dimmed"
            size="xs"
            component="a"
            href="https://storyset.com/online"
          >
            Online illustrations by Storyset
          </Text>
        </Card>
      </Group>
    </Container>
  );
}
