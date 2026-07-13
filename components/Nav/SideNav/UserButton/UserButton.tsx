import {
  IconChevronUp,
  IconChevronRight,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import {
  Avatar,
  Group,
  Menu,
  Skeleton,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './UserButton.module.css';
import { useAuth, useUser } from '@clerk/nextjs';

export function UserButton() {
  const { signOut, isSignedIn } = useAuth();
  const { isLoaded, user } = useUser();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();

  const handleSignOut = () => {
    if (isSignedIn) {
      void signOut?.();
    }
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
  };

  if (!isLoaded || !user) {
    return (
      <UnstyledButton className={classes.user} disabled>
        <Group>
          <Skeleton height={38} circle />

          <div style={{ flex: 1 }}>
            <Skeleton height={8} radius="xl" />

            <Skeleton height={8} radius="xl" mt={10} />
          </div>

          <IconChevronRight size={14} stroke={1.5} />
        </Group>
      </UnstyledButton>
    );
  }

  return (
    <Menu width={220} position="top" withArrow shadow="md">
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            {user.imageUrl ? (
              <Avatar src={user.imageUrl} radius="xl" />
            ) : (
              <Avatar radius="xl" name={user.fullName ?? ''} />
            )}
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user.fullName}
              </Text>

              <Text c="dimmed" size="xs">
                {user.emailAddresses[0].emailAddress.length > 25
                  ? user.emailAddresses[0].emailAddress.slice(0, 22) + '...'
                  : user.emailAddresses[0].emailAddress}
              </Text>
            </div>

            <IconChevronUp size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Preferences</Menu.Label>
        <Menu.Item
          leftSection={
            computedColorScheme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />
          }
          onClick={toggleColorScheme}
        >
          {computedColorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Account</Menu.Label>
        <Menu.Item leftSection={<IconLogout size={16} />} onClick={handleSignOut} color="red">
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
