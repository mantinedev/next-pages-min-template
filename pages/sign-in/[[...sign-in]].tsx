import { Button, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  clearStoredSignInIdentifier,
  getStoredSignInIdentifier,
} from "@/lib/signInIdentifierCookie";
import classes from "@/components/SignInPanel/SignInPanel.module.css";

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
    <div className={classes.page}>
      <div className={classes.shell}>
        <div className={classes.card}>
          <div className={classes.brand}>
            <span className={classes.name}>AarTemplate</span>
            <span className={classes.org}>Aarsleff</span>
          </div>

          <div className={classes.form}>
            <Title order={2}>Sign in</Title>

            <Button
              fullWidth
              size="lg"
              classNames={{ root: classes.signIn }}
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
            {enterpriseSsoIdentifier && (
              <div>
                <Button
                  variant="transparent"
                  size="compact-sm"
                  p={0}
                  classNames={{ root: classes.link }}
                  onClick={clearStoredEmail}
                >
                  Use a different email
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
