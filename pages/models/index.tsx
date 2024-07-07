import React from 'react';
import { Card, Table, Container, Title, Text, Divider, Button, Tabs, rem, Group, Select } from '@mantine/core';
import { TableReviews } from '../../lib/TableReviewsModel/TableReviews';
import { IconUpload } from '@tabler/icons-react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { IconSearch, IconCoins } from '@tabler/icons-react';
import { AddModel } from '../../components/AddModel';
import { useApiTypesList } from '../../api/endpoints/api/api';
import { useApiProblemsList } from '../../api/endpoints/api/api';
import { useApiAimodelsList } from '../../api/endpoints/api/api';

const Problems: React.FC = () => {
    const problems = [
        { id: 1, name: 'Overfitting' },
        { id: 2, name: 'Underfitting' },
        { id: 3, name: 'Data Bias' },
        { id: 4, name: 'Lack of Interpretability' },
    ];
    const iconStyle = { width: rem(12), height: rem(12) };
    const { data: problemsData, isLoading: problemsLoading } = useApiProblemsList();
    const { data: typesData, isLoading: typesLoading } = useApiTypesList();
    const [selectedProblem, setSelectedProblem] = React.useState({value: '0', label: 'All problems'});
    const [selectedType, setSelectedType] = React.useState({value: '0', label: 'All types'});
    const { data: modelsData, isLoading: modelsLoading } = useApiAimodelsList({
        type: parseInt(selectedType.value) ? parseInt(selectedType.value) :  undefined, 
        problem: parseInt(selectedProblem.value)? parseInt(selectedProblem.value) : undefined
    });

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
            <AddModel refetchParent={() => {}} types={typesData} problems={problemsData}/>
            <Divider my="lg" variant="dashed" labelPosition="center" label={''}/>

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
                <Group mt={15} grow justify='space-between'>
                <Select 
                        placeholder='All problems'
                        data={problemsData?.map((problem) => ({value: problem.id.toString(), label: problem.name}))}
                        value={selectedProblem ? selectedProblem.value : null}
                        onChange={(_value, option) => setSelectedProblem(option)}
                        ></Select>
                        <Select
                        placeholder='All types'
                        data={typesData?.map((type) => ({value: type.id.toString(), label: type.name}))}
                        value={selectedType ? selectedType.value : null}
                        onChange={(_value, option) => setSelectedType(option)}
                        ></Select>

                    </Group>
                    
                    <TableReviews services={modelsData} isLoading={modelsLoading} />
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