import React from 'react';
import { TextInput, Checkbox, Button, Group, Box, FileInput, NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { File } from 'buffer';

const ModelForm = ({actionFunction, problems, types}) => {

    let empty_types = {id: 0, name: 'Select a type...'};
    let empty_problems = {id: 0, name: 'Select a problem...'};
    if (!types) types = empty_types;
    if (!problems) problems = empty_problems;

    let n_type = [empty_types, ...types];
    let n_problem = [empty_problems, ...problems];
    
    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            problem: '',
            type: '',
            file: null
        },
        
  });

  return (
    <Box maxWidth={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => actionFunction(values))}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Uniswap Vault Manager..."

          {...form.getInputProps('name')}
        />

        <TextInput
          mt='xs'
          withAsterisk
          label="Description"
          placeholder="Manages stuff..."
          {...form.getInputProps('description')}
        />

        <NativeSelect
            mt='xs'
            label="Problem"
            placeholder="Select a problem..."
            required
            {...form.getInputProps('problem')}
        >
            {n_problem.map((problem) => (
                <option key={problem.id} value={problem.id}>{problem.name}</option>
            ))}
        </NativeSelect>

        <NativeSelect
            mt='xs'
            label="Type"
            placeholder="Select a type..."
            required
            
            {...form.getInputProps('type')}
        >
            {n_type.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
            ))}
        </NativeSelect>
        <FileInput
            mt='xs'
            label="File in .onnx format"
            accept=".onnx"
            placeholder="Select & upload your model..."
            required

            {...form.getInputProps('file')}
        />

        <Group position="right" mt="lg">
          <Button type="submit">Deploy model</Button>
        </Group>
      </form>
    </Box>
  );
}

export { ModelForm }