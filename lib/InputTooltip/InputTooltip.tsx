import { useState } from 'react';
import { TextInput, PasswordInput, Tooltip, Center, Text, rem } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

function TooltipIcon() {
  const rightSection = (
    <Tooltip
      label="We store your data securely"
      position="top-end"
      withArrow
      transitionProps={{ transition: 'pop-bottom-right' }}
    >
      <Text component="div" c="dimmed" style={{ cursor: 'help' }}>
        <Center>
          <IconInfoCircle style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </Center>
      </Text>
    </Tooltip>
  );

  return (
    <TextInput
      rightSection={rightSection}
      label="Tooltip shown on icon hover"
      placeholder="Your email"
    />
  );
}

function TooltipFocus() {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const valid = value.trim().length >= 6;
  return (
    <Tooltip
      label={valid ? 'All good!' : 'Password must include at least 6 characters'}
      position="bottom-start"
      withArrow
      opened={opened}
      color={valid ? 'teal' : undefined}
      withinPortal
    >
      <PasswordInput
        label="Tooltip shown onFocus"
        required
        placeholder="Your password"
        onFocus={() => setOpened(true)}
        onBlur={() => setOpened(false)}
        mt="md"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    </Tooltip>
  );
}

export function InputTooltip() {
  return (
    <>
      <TooltipIcon />
      <TooltipFocus />
    </>
  );
}
