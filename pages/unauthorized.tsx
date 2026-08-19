import { Container, Group, Card, Text, Button, Loader } from "@mantine/core";
import { useSession, useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const RETRY_INTERVAL_MS = 3000;
const MAX_RETRIES = 5;

export default function Unauthorized() {
  const router = useRouter();
  const { session } = useSession();
  const { sessionClaims } = useAuth();
  const [checking, setChecking] = useState(true);
  const attemptsRef = useRef(0);

  const redirectUrlParam = router.query.redirect_url;
  const redirectUrl =
    (typeof redirectUrlParam === "string"
      ? redirectUrlParam
      : Array.isArray(redirectUrlParam)
        ? redirectUrlParam[0]
        : undefined) ?? "/";

  useEffect(() => {
    if (sessionClaims?.metadata?.appAccess?.template) {
      router.replace(redirectUrl);
      return;
    }

    if (attemptsRef.current >= MAX_RETRIES) {
      setChecking(false);
      return;
    }

    const timer = setTimeout(async () => {
      attemptsRef.current += 1;
      await session?.reload();
    }, RETRY_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [sessionClaims, session, router, redirectUrl]);

  return (
    <Container size="xl">
      <Group justify="center" mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder w={400}>
          <Text fw={500} mb="xs">
            No access
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            {checking
              ? "Your account isn't in a group that has access to this app yet. If you were just given access, checking again automatically..."
              : "Your account isn't in a group that has access to this app. If you believe this is wrong, contact IT."}
          </Text>
          {checking ? (
            <Group justify="center">
              <Loader size="sm" />
            </Group>
          ) : (
            <Button
              fullWidth
              radius="md"
              onClick={() => {
                attemptsRef.current = 0;
                setChecking(true);
                session?.reload();
              }}
            >
              Try again
            </Button>
          )}
        </Card>
      </Group>
    </Container>
  );
}
