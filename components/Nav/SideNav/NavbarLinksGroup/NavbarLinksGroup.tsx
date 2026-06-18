import { forwardRef, useEffect, useMemo, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';
import { useRouter } from 'next/router';

export interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  forceOpen?: boolean;
  links?: { label: string; link: string }[];
  link?: string;
  onClick?: () => void;
}

export const LinksGroup = forwardRef<HTMLButtonElement, LinksGroupProps>(function LinksGroup(
  { icon: Icon, label, initiallyOpened, forceOpen, links, link, onClick },
  ref,
) {
  const router = useRouter();
  const normalizePath = (path: string) => {
    const stripped = (path || '').split('#')[0].split('?')[0].replace(/\/+$/, '');
    return stripped === '' ? '/' : stripped;
  };
  const currentPath = useMemo(
    () => normalizePath(router.asPath || router.pathname),
    [router.asPath, router.pathname],
  );
  const matchPath = (target: string | undefined) => {
    if (!target) return false;
    const normalizedTarget = normalizePath(target);
    if (normalizedTarget === '/') {
      return currentPath === '/';
    }
    return currentPath === normalizedTarget || currentPath.startsWith(`${normalizedTarget}/`);
  };
  const hasLinks = Array.isArray(links);
  const isDirectActive = matchPath(link);
  const isChildActive = hasLinks ? links?.some((child) => matchPath(child.link)) : false;
  const [opened, setOpened] = useState(initiallyOpened || isDirectActive || isChildActive);

  useEffect(() => {
    if (isDirectActive || isChildActive) {
      setOpened(true);
    }
  }, [isChildActive, isDirectActive]);

  const items = (hasLinks ? links : []).map((link) => {
    const childIsActive = matchPath(link.link);
    return (
      <Text<'a'>
        className={`${classes.link} ${childIsActive ? classes.activeLink : ''}`}
        key={link.label}
        onClick={() => router.push(link.link)}
        style={{ cursor: 'pointer' }}
      >
        {link.label}
      </Text>
    );
  });

  const handleControlClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (link) {
      router.push(link);
      return;
    }
    if (hasLinks) {
      setOpened((o) => !o);
    }
  };

  return (
    <>
      <UnstyledButton
        onClick={handleControlClick}
        className={`${classes.control} ${isDirectActive ? classes.activeControl : ''}`}
        data-active={isDirectActive || undefined}
        ref={ref}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{
                transform: (forceOpen ? true : opened) ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse expanded={forceOpen ? true : opened}>{items}</Collapse> : null}
    </>
  );
});
