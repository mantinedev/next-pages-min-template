import { AppShell, Group, Burger, Text } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import classes from './Nav.module.css';
import SideNav from './SideNav/SideNav';
import { createLinkData } from './SideNav/SideNav';
// import * as Sentry from "@sentry/nextjs";
import cx from 'clsx';

import confetti from 'canvas-confetti';
import { useAuth, useSession, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { IconTestPipe } from '@tabler/icons-react';
import { useThrottledUserMetadataUpdate } from '@/lib/updateUserMetadata';

type NavigationItem = {
  label: string;
  link?: string;
  links?: { label: string; link: string }[];
};

const normalizePath = (path: string) => {
  const stripped = (path || '').split('#')[0].split('?')[0].replace(/\/+$/, '');
  return stripped === '' ? '/' : stripped;
};

const buildLinkLabelMap = (items: NavigationItem[]) => {
  const map = new Map<string, string>();

  items.forEach((item) => {
    if (item.link) {
      map.set(normalizePath(item.link), item.label);
    }
    item.links?.forEach((child) => {
      if (child.link) {
        map.set(normalizePath(child.link), child.label);
      }
    });
  });

  return map;
};

const resolvePageTitle = (path: string, labelMap: Map<string, string>) => {
  const normalizedPath = normalizePath(path);
  const directMatch = labelMap.get(normalizedPath);

  if (directMatch) {
    return directMatch;
  }

  let bestLabel = '';
  let bestMatchLength = 0;

  labelMap.forEach((label, linkPath) => {
    if (
      linkPath !== '/' &&
      normalizedPath.startsWith(linkPath) &&
      linkPath.length > bestMatchLength
    ) {
      bestLabel = label;
      bestMatchLength = linkPath.length;
    }
  });

  if (bestLabel) {
    return bestLabel;
  }

  if (normalizedPath === '/') {
    return 'Home';
  }

  return normalizedPath
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export default function Nav({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { width } = useViewportSize();
  const { isLoaded, user } = useUser();
  const { sessionClaims } = useAuth();
  const { session } = useSession();
  const router = useRouter();
  const linkData = useMemo(
    () =>
      createLinkData(
        user?.primaryEmailAddress?.emailAddress,
        sessionClaims?.metadata?.admin,
        sessionClaims?.metadata?.user_admin,
      ),
    [user?.primaryEmailAddress?.emailAddress, sessionClaims],
  );
  const labelMap = useMemo(() => buildLinkLabelMap(linkData), [linkData]);
  const pageTitle = useMemo(
    () => resolvePageTitle(router.asPath || router.pathname, labelMap),
    [labelMap, router.asPath, router.pathname],
  );

  // if (isLoaded) {
  //   Sentry.setUser({
  //     email: user?.primaryEmailAddress?.emailAddress,
  //     name: user?.fullName,
  //   });
  // }

  function fireConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  //update usermetadata
  useThrottledUserMetadataUpdate({
    isLoaded,
    sessionUpdatedAt: session?.updatedAt,
    user,
  });

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 270,
        breakpoint: 1024,
        collapsed: { desktop: false, mobile: !opened },
      }}
    >
      <AppShell.Header className={cx(classes.navHeader)}>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap="xl">
              {width! < 1024 && <Burger opened={opened} onClick={toggle} size="sm" />}
              <Text ta="left" fw={500}>
                {pageTitle}
              </Text>
            </Group>
            <Group gap="sm">
              <IconTestPipe width={32} height={32} color="#ffffff" onClick={fireConfetti} />
              <Text ta="left" fw={500} c="white">
                AarTemplate
              </Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
