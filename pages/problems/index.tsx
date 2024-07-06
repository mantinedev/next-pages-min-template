import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviews/TableReviews';
import { IconUpload } from '@tabler/icons-react';

const Problems: React.FC = () => {
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
            gradient={{ from: '#FFFFFF', to: '#FFFFFF' }}>Problem Sets & Training Data</Text></Title>
            <Button justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Submit a problem and/or data set</Button>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>

            <TableReviews/>

            </Card>      
            </Container>
    );
};

export default Problems;