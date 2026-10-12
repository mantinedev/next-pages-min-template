import { Alert, Avatar, Box, Chip, Group, Loader, Paper, Select, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getInitials } from '@/lib/getInitials';
import { type TemplatePermissions, TEMPLATE_PERMISSIONS, pickPermissions } from '@/lib/permissions';
import { CONFIRM_WINDOW_MS, type ArmedPill, pillClick } from '@/lib/permissionPills';
import classes from './UsersList.module.css';

type Person = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  permissions: TemplatePermissions;
  /** Picked from the search and not yet given anything. Lost on reload. */
  isNew?: boolean;
};

type Everyone = Array<{ id: string; name: string; email: string; imageUrl?: string }>;

type Key = keyof TemplatePermissions;

/** The pills, in the order people read them. */
const KEYS = Object.keys(TEMPLATE_PERMISSIONS) as Key[];
const LABEL = Object.fromEntries(
  KEYS.map((key) => [key, TEMPLATE_PERMISSIONS[key].title]),
) as Record<Key, string>;

const cx = (...names: Array<string | false | null | undefined>) =>
  names.filter(Boolean).join(' ');

/**
 * Who has which permission, as one row each. A pill is a permission: dashed is
 * off, green with a tick is on. Click once to propose the change and see what it
 * would do; click again within a few seconds to confirm. Nothing else to save.
 */
export function UsersList({ myId }: { myId: string | null | undefined }) {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [everyone, setEveryone] = useState<Everyone | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [armed, setArmed] = useState<ArmedPill>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: Person[]) => {
        if (!ignore)
          setPeople(data.map((p) => ({ ...p, permissions: pickPermissions(p.permissions) })));
      })
      .catch((err) => {
        console.error('Failed to load users', err);
        if (!ignore) setFailed(true);
      });
    fetch('/api/clerkUsers')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Everyone) => {
        if (!ignore) setEveryone(data);
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  const disarm = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setArmed(null);
  }, []);

  useEffect(() => disarm, [disarm]);

  // Escape takes the proposal back.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') disarm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [disarm]);

  const apply = async (person: Person, key: Key) => {
    const value = !person.permissions[key];
    setBusy(`${person.id}:${key}`);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: person.id, permission: key, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Could not save');
      setPeople((current) =>
        (current ?? []).map((p) =>
          p.id === person.id
            ? {
                ...p,
                isNew: false,
                permissions: pickPermissions(data as TemplatePermissions),
              }
            : p,
        ),
      );
      setSaved(person.id);
      setTimeout(() => setSaved((now) => (now === person.id ? null : now)), 1200);
    } catch (err) {
      console.error('Failed to change permission', err);
      notifications.show({
        color: 'red',
        title: 'Not changed',
        message: err instanceof Error ? err.message : 'Try again.',
      });
    } finally {
      setBusy(null);
    }
  };

  const click = (person: Person, key: Key) => {
    const target = { id: person.id, key };
    const action = pillClick(armed, target, Date.now());
    if (action === 'ignore') return;
    if (action === 'confirm') {
      disarm();
      void apply(person, key);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setArmed({ ...target, at: Date.now() });
    timer.current = setTimeout(() => {
      timer.current = null;
      setArmed(null);
    }, CONFIRM_WINDOW_MS);
  };

  const addPerson = (id: string | null) => {
    if (!id) return;
    const known = (people ?? []).find((p) => p.id === id);
    if (known) {
      setFlash(id);
      document
        .getElementById(`user-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setFlash(null), 1500);
      return;
    }
    const found = (everyone ?? []).find((p) => p.id === id);
    if (!found) return;
    setPeople((current) => [
      { ...found, permissions: pickPermissions(undefined), isNew: true },
      ...(current ?? []),
    ]);
    setFilter('all');
    setFlash(id);
    setTimeout(() => setFlash(null), 1500);
  };

  const shown = useMemo(
    () =>
      (people ?? []).filter(
        (p) => filter === 'all' || p.isNew || p.permissions[filter as Key],
      ),
    [people, filter],
  );
  const listed = (people ?? []).filter((p) => !p.isNew).length;

  // Label stays "name · email" so the search matches either; renderOption below
  // shows them on two lines.
  const options = useMemo(
    () =>
      (everyone ?? []).map((p) => ({
        value: p.id,
        label: `${p.name}${p.email ? ` · ${p.email}` : ''}`,
      })),
    [everyone],
  );

  if (failed) {
    return (
      <Alert color="red" variant="light">
        Could not load users.
      </Alert>
    );
  }
  if (!people) return <Loader size="sm" />;

  return (
    <Stack gap="md">
      <Stack gap={4}>
        {KEYS.map((key) => (
          <Text size="sm" c="dimmed" key={key}>
            <Text span fw={500} c="var(--mantine-color-text)" mr={6}>
              {LABEL[key]}
            </Text>
            {TEMPLATE_PERMISSIONS[key].description}
          </Text>
        ))}
      </Stack>

      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Select
          aria-label="Add someone"
          placeholder="Add someone…"
          searchable
          clearable
          w={320}
          data={options}
          renderOption={({ option }) => {
            const p = everyone?.find((u) => u.id === option.value);
            if (!p) return option.label;
            return (
              <Box style={{ minWidth: 0 }}>
                <Text size="sm" truncate>
                  {p.name}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {p.email}
                </Text>
              </Box>
            );
          }}
          value={null}
          onChange={addPerson}
          nothingFoundMessage="No one found"
          disabled={!everyone}
        />
        <Group gap="xs">
          <Chip.Group
            multiple={false}
            value={filter}
            onChange={(value) => setFilter(String(value))}
          >
            <Chip value="all" size="xs">
              All
            </Chip>
            {KEYS.map((key) => (
              <Chip key={key} value={key} size="xs">
                {LABEL[key]}
              </Chip>
            ))}
          </Chip.Group>
          <Text size="sm" c="dimmed">
            {listed}
          </Text>
        </Group>
      </Group>

      <Paper withBorder radius="md">
        {shown.length === 0 ? (
          <Text size="sm" c="dimmed" p="md">
            No one yet.
          </Text>
        ) : (
          shown.map((person, index) => (
            <Group
              key={person.id}
              id={`user-${person.id}`}
              align="flex-start"
              wrap="nowrap"
              p="sm"
              className={cx(flash === person.id && classes.flash)}
              style={{
                borderTop:
                  index === 0 ? undefined : '1px solid var(--mantine-color-default-border)',
              }}
            >
              <Avatar size={36} radius="xl" color="blue" src={person.imageUrl}>
                {getInitials(person.name)}
              </Avatar>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} truncate>
                  {person.name}
                  {person.id === myId && (
                    <Text span size="xs" c="dimmed" ml={6}>
                      you
                    </Text>
                  )}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {person.email}
                </Text>
              </Box>
              <Box>
                <Group gap={8} justify="flex-end" wrap="wrap">
                  {KEYS.map((key) => {
                    const on = person.permissions[key];
                    const isArmed = armed?.id === person.id && armed.key === key;
                    const locked = person.id === myId && key === 'userAdmin';
                    const working = busy === `${person.id}:${key}`;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={on}
                        disabled={locked || busy !== null}
                        title={locked ? "You can't remove your own User Admin" : undefined}
                        className={cx(
                          classes.pill,
                          on && classes.pillOn,
                          isArmed && (on ? classes.armOff : classes.armOn),
                          locked && classes.pillLocked,
                        )}
                        onClick={() => click(person, key)}
                      >
                        {working ? (
                          <Loader size={12} />
                        ) : (
                          (on || (isArmed && !on)) ? <IconCheck size={14} aria-hidden /> : <IconX size={14} aria-hidden />
                        )}
                        {LABEL[key]}
                      </button>
                    );
                  })}
                </Group>
                <Text size="xs" c="dimmed" ta="right" mt={4} mih={16} aria-live="polite">
                  {armed?.id === person.id
                    ? `Click again to ${person.permissions[armed.key as Key] ? 'remove' : 'give'} ${LABEL[armed.key as Key]}`
                    : saved === person.id
                      ? 'Saved'
                      : ''}
                </Text>
              </Box>
            </Group>
          ))
        )}
      </Paper>
    </Stack>
  );
}
