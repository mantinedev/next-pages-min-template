import { Table, Progress, Anchor, Text, Group, LoadingOverlay, Button, Badge } from '@mantine/core';
import classes from './TableReviews.module.css';
import Link from 'next/link';
import { useEffect } from 'react';

export function TableReviews({services, isLoading}) {


    const rows = services?.map((row) => {
    const best_accuracy = parseFloat(row.accuracy) || 0;
    const positiveReviews = (best_accuracy);
    const negativeReviews = (100 - best_accuracy);


    return (
      <Table.Tr key={row.name}>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {row.name}
          </Anchor>
        </Table.Td>
        <Table.Td><Link href={'#'}>{row.problem_name}</Link></Table.Td>
        <Table.Td>
          <Anchor component="button" fz="sm">
            {row.description}
          </Anchor>
        </Table.Td>
        <Table.Td>
          {row.type_name? <Badge color="teal">{row.type_name}</Badge> : ''}
        </Table.Td>
        <Table.Td>
        {row.nevermind_tag? <Badge ml={5} variant='dot' color="teal">Deployed</Badge> : ''}
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text fz="xs" c="teal" fw={700}>
              {positiveReviews.toFixed(0)}%
            </Text>
            <Text fz="xs" c="red" fw={700}>
              {negativeReviews.toFixed(0)}%
            </Text>
          </Group>
          <Progress.Root>
            <Progress.Section
              className={classes.progressSection}
              value={positiveReviews}
              color="teal"
            />

            <Progress.Section
              className={classes.progressSection}
              value={negativeReviews}
              color="red"
            />
          </Progress.Root>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800}>
      <LoadingOverlay visible={isLoading} />
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Problem</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Availability</Table.Th>
            <Table.Th>Mean Absolute Error</Table.Th>
            
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
