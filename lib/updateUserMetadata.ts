import { useEffect } from 'react';
// import * as Sentry from "@sentry/nextjs";
import type { UserResource } from '@clerk/types';

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error('Unknown error updating user metadata');
  }
}

const LAST_METADATA_UPDATE_KEY = 'nav:lastMetadataUpdate';
const METADATA_UPDATE_LOCK_KEY = 'nav:metadataUpdateLock';
const THROTTLE_INTERVAL_MS = 60 * 1000;
const SESSION_UPDATE_WINDOW_MS = 15 * 1000;
const METADATA_UPDATE_TIMEOUT_MS = 10 * 1000;

function buildMetadataEndpoint(email: string) {
  if (typeof window === 'undefined') {
    return `/api/updateUserMetadata?user=${encodeURIComponent(email)}`;
  }

  const url = new URL('/api/updateUserMetadata', window.location.origin);
  url.searchParams.set('user', email);
  return url.toString();
}

export async function updateUserMetadata(user: UserResource | null | undefined) {
  if (!user?.primaryEmailAddress?.emailAddress) {
    return;
  }

  let timeoutId: number | null = null;
  let abortController: AbortController | null = null;

  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      // Skip network work entirely when the browser knows it is offline.
      return;
    }

    const email = user.primaryEmailAddress.emailAddress;
    const endpoint = buildMetadataEndpoint(email);
    abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    timeoutId =
      typeof window !== 'undefined'
        ? window.setTimeout(
            () => abortController?.abort('metadata_update_timeout'),
            METADATA_UPDATE_TIMEOUT_MS,
          )
        : null;

    const response = await fetch(endpoint, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: abortController?.signal,
    });

    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      const error = new Error(
        `Failed to update user metadata: ${response.status} ${response.statusText}`,
      );
      // Sentry.captureException(error);
      console.error(error);
      return;
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.startsWith('image/')) {
      return;
    }

    const data = await response.blob();

    if (data.size === 0) {
      return;
    }

    await user.setProfileImage({ file: data });
  } catch (error) {
    const normalisedError = toError(error);

    // Network interruptions, aborts, and offline scenarios are expected and
    // shouldn't be reported as actionable errors.
    if (normalisedError.name === 'AbortError' || normalisedError.message === 'Failed to fetch') {
      return;
    }

    normalisedError.name = 'UserMetadataUpdateError';
    // Sentry.captureException(normalisedError);
    console.error(normalisedError);
  } finally {
    if (timeoutId !== null && typeof window !== 'undefined') {
      window.clearTimeout(timeoutId);
    }
  }
}

type UseThrottledUserMetadataUpdateOptions = {
  isLoaded: boolean;
  sessionUpdatedAt: Date | string | null | undefined;
  user: UserResource | null | undefined;
};

export function useThrottledUserMetadataUpdate({
  isLoaded,
  sessionUpdatedAt,
  user,
}: UseThrottledUserMetadataUpdateOptions) {
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const sessionStorage = window.sessionStorage;
    const hasLastUpdate = sessionStorage.getItem(LAST_METADATA_UPDATE_KEY) !== null;

    if (!hasLastUpdate) {
      const now = Date.now();
      sessionStorage.setItem(METADATA_UPDATE_LOCK_KEY, String(now));
      sessionStorage.setItem(LAST_METADATA_UPDATE_KEY, String(now));
      updateUserMetadata(user).finally(() => {
        sessionStorage.removeItem(METADATA_UPDATE_LOCK_KEY);
        sessionStorage.setItem(LAST_METADATA_UPDATE_KEY, String(Date.now()));
      });
      return;
    }

    const sessionUpdatedAtTime = sessionUpdatedAt ? new Date(sessionUpdatedAt).getTime() : 0;

    if (!sessionUpdatedAtTime) {
      return;
    }

    const now = Date.now();
    const updatedRecently = now - sessionUpdatedAtTime < SESSION_UPDATE_WINDOW_MS;

    if (!updatedRecently) {
      return;
    }

    const rawLastUpdate = Number(sessionStorage.getItem(LAST_METADATA_UPDATE_KEY) ?? '0');
    const rawActiveLock = Number(sessionStorage.getItem(METADATA_UPDATE_LOCK_KEY) ?? '0');
    const lastUpdate = Number.isFinite(rawLastUpdate) ? rawLastUpdate : 0;
    const activeLock = Number.isFinite(rawActiveLock) ? rawActiveLock : 0;

    if (now - lastUpdate < THROTTLE_INTERVAL_MS) {
      return;
    }

    if (now - activeLock < THROTTLE_INTERVAL_MS) {
      return;
    }

    sessionStorage.setItem(METADATA_UPDATE_LOCK_KEY, String(now));
    sessionStorage.setItem(LAST_METADATA_UPDATE_KEY, String(now));
    updateUserMetadata(user).finally(() => {
      sessionStorage.removeItem(METADATA_UPDATE_LOCK_KEY);
      sessionStorage.setItem(LAST_METADATA_UPDATE_KEY, String(Date.now()));
    });
  }, [isLoaded, sessionUpdatedAt, user]);
}
