import { Button, Paper, Text, Group, CloseButton } from '@mantine/core';

export function CookiesBanner() {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Text fz="md" fw={500}>
          Allow cookies
        </Text>
        <CloseButton mr={-9} mt={-9} />
      </Group>
      <Text c="dimmed" fz="xs">
        So the deal is, we want to spy on you. We would like to know what did you have for todays
        breakfast, where do you live, how much do you earn and like 50 other things. To view our
        landing page you will have to accept all cookies. That&apos;s all, and remember that we are
        watching...
      </Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" size="xs">
          Cookies preferences
        </Button>
        <Button variant="outline" size="xs">
          Accept all
        </Button>
      </Group>
    </Paper>
  );
}
