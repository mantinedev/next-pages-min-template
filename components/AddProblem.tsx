import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, LoadingOverlay } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useApiProblemsCreate } from '../api/endpoints/api/api';
import { notifications } from '@mantine/notifications';
import { ProblemForm } from './ProblemForm';


const AddProblem = ({refetchParent}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {isPending: pendingCreation, mutateAsync: createAsync} = useApiProblemsCreate();
  
  

  const createProblem = async (payload: any) => {
    createAsync({data: payload}).then(() => {
        close();
        notifications.show({message: 'API created successfully', color: 'green'});
        if (refetchParent) refetchParent();
    }).catch((error: any) => {
        notifications.show({message: `API creation failed: ${JSON.stringify(error.response?.data)}`, color: 'red'});
    })
};


  return (
    <>
      <Modal opened={opened} onClose={close} title="Submit a problem/dataset">
        <LoadingOverlay visible={pendingCreation} zIndex={1000}/>
        <ProblemForm actionFunction={createProblem} />
      </Modal>

      <Button onClick={open} justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Submit a problem and/or data set</Button>
      </>
  );
}

export { AddProblem };