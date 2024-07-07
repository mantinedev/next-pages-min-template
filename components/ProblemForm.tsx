import React from 'react';
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

const ProblemForm = ({actionFunction}) => {
    
    const form = useForm({
    validate: {
      name: (value) => (value.trim() !== '' ? null : 'Name is required'),
      description: (value) => (value.trim() !== '' ? null : 'Description is required'),
      data_url: (value) => (value.trim() !== '' ? null  : 'URL is required'),
    },
  });

  return (
    <Box maxWidth={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => actionFunction(values))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Problem of classification..."

          {...form.getInputProps('name')}
        />

        <TextInput
          mt='xs'
          withAsterisk
          label="Description"
          placeholder="Classify images into categories..."
          {...form.getInputProps('description')}
        />

        <TextInput
          mt='xs'
          withAsterisk
          label="URL"
          placeholder="https://gateway.filecoin.io/..."
          {...form.getInputProps('data_url')}
        />


        <Group position="right" mt="lg">
          <Button type="submit">Create problem</Button>
        </Group>
      </form>
    </Box>
  );
}

export { ProblemForm }