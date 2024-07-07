import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviews/TableReviews';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { AddProblem } from '../../components/AddProblem';
import { useApiProblemsList } from '../../api/endpoints/api/api'

const Problems: React.FC = () => {
    const [counter, setCounter] = React.useState(0);
    const {data: services, error, isLoading, refetch} = useApiProblemsList({format: 'json', counter: counter}); 

    const problems = [
        { id: 1, name: 'Overfitting' },
        { id: 2, name: 'Underfitting' },
        { id: 3, name: 'Data Bias' },
        { id: 4, name: 'Lack of Interpretability' },
    ];

    return (
        <Container id='abc' style={{width: '100%'}} p='md'>
                <Card shadow="sm" padding="md" radius="xl" withBorder style={{backgroundColor: '#2e2e2eDD'}}>
            <Title mt='md'  order={1} style={{fontWeight: 900, textAlign: 'center', display: 'flex', justifyContent: 'center', fontSize: '2.5rem'}}>
            <Text
            component="span"
            inherit
            ml="lg"
            variant="gradient"
            gradient={{ from: '#FFFFFF', to: '#FFFFFF' }}>Problem sets & Training data</Text></Title>
            <AddProblem refetchParent={() => setCounter(counter+1)}/>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>

            <TableReviews services={services} isLoading={isLoading} />
            </Card>      
            </Container>
    );
};

export default Problems;