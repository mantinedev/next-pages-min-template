const SIGN_IN_IDENTIFIER_COOKIE_NAME = "aar_sign_in_email";
const SIGN_IN_IDENTIFIER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function buildCookieAttributes(maxAgeSeconds?: number) {
  const attributes = ["Path=/", "SameSite=Lax"];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    attributes.push("Secure");
  }

  if (typeof maxAgeSeconds === "number") {
    attributes.push(`Max-Age=${maxAgeSeconds}`);
  }

  return attributes.join("; ");
}

export function getStoredSignInIdentifier() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie.slice(0, separatorIndex);

    if (name !== SIGN_IN_IDENTIFIER_COOKIE_NAME) {
      continue;
    }

    const value = cookie.slice(separatorIndex + 1);

    return value ? decodeURIComponent(value) : null;
  }

  return null;
}

export function storeSignInIdentifier(identifier: string) {
  if (typeof document === "undefined" || !identifier) {
    return;
  }

  document.cookie = `${SIGN_IN_IDENTIFIER_COOKIE_NAME}=${encodeURIComponent(
    identifier
  )}; ${buildCookieAttributes(SIGN_IN_IDENTIFIER_COOKIE_MAX_AGE_SECONDS)}`;
}

export function clearStoredSignInIdentifier() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SIGN_IN_IDENTIFIER_COOKIE_NAME}=; ${buildCookieAttributes(
    0
  )}`;
}
