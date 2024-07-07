import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, LoadingOverlay } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useApiAimodelsCreate } from '../api/endpoints/api/api';
import { notifications } from '@mantine/notifications';
import { ModelForm } from './ModelForm';


const AddModel = ({refetchParent, problems, types}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const {isPending: pendingCreation, mutateAsync: createAsync} = useApiAimodelsCreate();
  
  

  const createProblem = async (payload: any) => {
    createAsync({data: payload}).then(() => {
        close();
        notifications.show({message: 'Model deployed successfully', color: 'green'});
        if (refetchParent) refetchParent();
    }).catch((error: any) => {
        notifications.show({message: `Model deployment failed: ${JSON.stringify(error.response?.data)}`, color: 'red'});
    })
};


  return (
    <>
      <Modal opened={opened} onClose={close} title="Deploy a model">
        <LoadingOverlay visible={pendingCreation} zIndex={1000}/>
        <ModelForm actionFunction={createProblem} />
      </Modal>
      <Button onClick={open} justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Deploy your own model</Button>
      </>
  );
}

export { AddModel };