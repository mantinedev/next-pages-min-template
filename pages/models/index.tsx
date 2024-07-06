import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button, Tabs, rem } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviews/TableReviews';
import { IconUpload } from '@tabler/icons-react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { IconSearch, IconCoins } from '@tabler/icons-react';

const Problems: React.FC = () => {
    const problems = [
        { id: 1, name: 'Overfitting' },
        { id: 2, name: 'Underfitting' },
        { id: 3, name: 'Data Bias' },
        { id: 4, name: 'Lack of Interpretability' },
    ];
    const iconStyle = { width: rem(12), height: rem(12) };

    return (
        <Container id='abc' style={{width: '100%'}} p='md'>
                <Card shadow="sm" padding="md" radius="xl" withBorder style={{backgroundColor: '#2e2e2eDD'}}>
            <Title mt='md'  order={1} style={{fontWeight: 900, textAlign: 'center', display: 'flex', justifyContent: 'center', fontSize: '2.5rem'}}>
            <Text
            component="span"
            inherit
            ml="lg"
            variant="gradient"
            gradient={{ from: '#FFFFFF', to: '#FFFFFF' }}>Deployed Models</Text></Title>
            <Button justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Deploy your own model</Button>
            <Tabs defaultValue="search" variant='pills'>
                <Tabs.List justify="center">
                    <Tabs.Tab value="search" leftSection={<IconSearch style={iconStyle} />}>
                    Compare models
                    </Tabs.Tab>
                    <Tabs.Tab value="buy" leftSection={<IconCoins style={iconStyle} />}>
                    Buy inference
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="search">
                    Gallery tab content
                </Tabs.Panel>

                <Tabs.Panel value="buy">
                    Messages tab content
                </Tabs.Panel>
                </Tabs>

            </Card>      
            </Container>
    );
};

export default Problems;