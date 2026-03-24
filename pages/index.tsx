import Nav from '@/components/Nav/Nav';
import { Button, Group } from '@mantine/core';

export default function IndexPage() {
  return (
    <Nav>
      <Group mt={50} justify="center">
        <Button size="xl">Welcome to Mantine!</Button>
      </Group>
    </Nav>
  );
}
