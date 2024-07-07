import { Table, Progress, Anchor, Text, Group, LoadingOverlay, Button, Badge, Tooltip, Modal, TextInput } from '@mantine/core';
import classes from './TableReviews.module.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { apiAimodelsPartialUpdate } from '../../api/endpoints/api/api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useForm } from '@mantine/form';


export function TableReviews({services, isLoading, refetchParent}) {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectModel, setSelectModel] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const form = useForm({
    });
  
    const rows = services?.map((row) => {
    const best_accuracy = parseFloat(row.accuracy) || 0;
    const positiveReviews = (best_accuracy);
    const negativeReviews = (100 - best_accuracy);

    const updateNeverminedTag = ({id, tag}: {id: number, tag: string}) => {

    };



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
            <Tooltip label={row.description}>
              <Text>Hover to read</Text>
            </Tooltip>
          </Anchor>
        </Table.Td>
        <Table.Td>
          {row.type_name? <Badge color="teal">{row.type_name}</Badge> : ''}
        </Table.Td>
        <Table.Td>
        {row.nevermind_tag? <Badge ml={5} variant='dot' color="teal">Deployed</Badge> : <Button onClick={() => {
          setSelectModel(row.id);
          open();
        }} variant='transparent'>Deploy with Nevermined  </Button>}
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
      <Modal opened={opened} onClose={close} title="Start charging for inference">
        <LoadingOverlay visible={false} />
        <form onSubmit={form.onSubmit((values) => {setIsUpdating(true); apiAimodelsPartialUpdate(selectModel, {
        nevermind_tag: values.tag
      }).then(() => {
      
      close();
      notifications.show({message: 'Tag updated successfully', color: 'green'});
      if (refetchParent) refetchParent();
      }).catch((error: any) => {
      notifications.show({message: `Tag update failed: ${JSON.stringify(error.response?.data)}`, color: 'red'});
      })})}>
          <TextInput
            withAsterisk
            label="Nevermined deployment tag"
            placeholder="did:nv:b85024..."
            {...form.getInputProps('tag')}
          />
          <Group position="right" mt="lg">
            <Button type="submit">Publish deployment</Button>
          </Group>
        </form>
      </Modal>
    </Table.ScrollContainer>
  );
}
