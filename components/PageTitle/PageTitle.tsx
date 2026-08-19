import { Group, Title } from "@mantine/core";

interface Iprops {
  title: string;
}

export default function PageTitle({ title }: Iprops) {
  return (
    <Group gap={3}>
      <Title order={2}>{title}</Title>
    </Group>
  );
}
