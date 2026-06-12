import { Container, Group } from "@mantine/core";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Login() {
  const { query } = useRouter();
  const redirectUrlParam = query.redirect_url;
  const redirectUrl =
    typeof redirectUrlParam === "string"
      ? redirectUrlParam
      : Array.isArray(redirectUrlParam)
        ? redirectUrlParam[0]
        : undefined;

  return (
    <Container size="xl">
      <Group justify="center" mt="xl">
        <SignIn forceRedirectUrl={redirectUrl} />
      </Group>
    </Container>
  );
}
