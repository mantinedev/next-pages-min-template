import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button, Select, JsonInput } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviews/TableReviews';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { AddProblem } from '../../components/AddProblem';
import { useApiAimodelsList } from '../../api/endpoints/api/api'
import { useState } from 'react';
import { useVerifyCreate } from '../../api/endpoints/verify/verify';
import { notifications } from '@mantine/notifications';

const Inference: React.FC = () => {
    const {data: models, error, isLoading, refetch} = useApiAimodelsList({format: 'json'}); 
    const [value, setValue] = useState('');
    const [output, setOutput] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    const {isPending, mutateAsync} = useVerifyCreate();

    const runInference = async () => {
        mutateAsync({id: parseInt(selectedModel), data: {x: JSON.parse(value)}}).then((response) => {
            setOutput(JSON.stringify(response.result));
            notifications.show({message: 'Inference completed successfully', color: 'green'});

        }).catch((error) => {
            console.log(error);
            notifications.show({message: `Inference failed: ${JSON.stringify(error.response?.data)}`, color: 'red'});
        });
    }


    return (
        <Container id='abc' style={{width: '100%'}} p='md'>
            <Card shadow="sm" padding="md" radius="xl" withBorder style={{backgroundColor: '#2e2e2eDD'}}>
            <Title mt='md'  order={1} style={{fontWeight: 900, textAlign: 'center', display: 'flex', justifyContent: 'center', fontSize: '2.5rem'}}>
            <Text
            component="span"
            inherit
            ml="lg"
            variant="gradient"
            gradient={{ from: '#FFFFFF', to: '#FFFFFF' }}>Prove inference</Text></Title>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>
            <Select
            label='Models'
            placeholder='Select a model'
            value={selectedModel}
            onChange={(value) => setSelectedModel(value)}
            data={models?.map((type) => ({value: type.id.toString(), label: type.name}))}
            >
            </Select>
            <JsonInput label='Input' mt='sm' placeholder='Input in JSON format' value={value} onChange={setValue} />
            <Button loading={isPending} mt='sm' onClick={runInference}>Run inference</Button>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>
            <JsonInput autosize label='Output' mt='sm' placeholder='Will be generated' value={output} />
            </Card>      
            </Container>
    );
};

export default Inference;