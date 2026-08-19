import { useAuth } from "@clerk/nextjs";

type Permissions = NonNullable<
  CustomJwtSessionClaims["metadata"]["permissions"]
>;

/** Reads an app's permissions object from the AarAuth Clerk session. */
export function useAppPermission<App extends keyof Permissions>(
  app: App,
): Permissions[App] | undefined {
  const { sessionClaims } = useAuth();
  return sessionClaims?.metadata?.permissions?.[app];
}
