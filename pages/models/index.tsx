import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviews/TableReviews';
import { IconUpload } from '@tabler/icons-react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

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
            gradient={{ from: '#FFFFFF', to: '#FFFFFF' }}>Problem sets & Training data</Text></Title>
            <Button justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Submit a problem and/or data set</Button>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>

            <div className="nvm-agent-widget" nvm-did="did:nv:78f68740c70947a02e79a0d360a157c1847638c953d473d43e5a242dfe03aa14" nvm-wid="wid-eb0c3740-bcbb-410e-885a-ea0a1e2c785e" nvm-theme="dark" nvm-layout="vertical"></div>
            </Card>      
            </Container>
    );
};

export default Problems;