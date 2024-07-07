import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, LoadingOverlay } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useApiAimodelsCreate } from '../api/endpoints/api/api';
import { notifications } from '@mantine/notifications';
import { ModelForm } from './ModelForm';
import axios from 'axios';
import { useState } from 'react';

const AddModel = ({refetchParent, problems, types}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isPending, setIsPending] = useState(false);
  const {isPending: pendingCreation, mutateAsync: createAsync} = useApiAimodelsCreate();
  
  

  const createModel = async (payload: any) => {
    console.log(payload);
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('problem', payload.problem);
    formData.append('type', payload.type);
    setIsPending(true);
    axios.post('http://localhost:8000/api/aimodels/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(() => {
        close();
        notifications.show({message: 'Model deployed successfully', color: 'green'});
        if (refetchParent) refetchParent();
    }).catch((error: any) => {
        notifications.show({message: `Model deployment failed: ${JSON.stringify(error.response?.data)}`, color: 'red'});
    }).finally(() => {
        setIsPending(false);
    });

};


  return (
    <>
      <Modal opened={opened} onClose={close} title="Deploy a model">
        <LoadingOverlay visible={isPending} zIndex={1000}/>
        <ModelForm actionFunction={createModel} problems={problems} types={types} />
      </Modal>
      <Button onClick={open} justify="center"  radius={'xl'} rightSection={<IconUpload size={20}/>} style={{maxWidth: 300, margin: 'auto'}} variant="outline" mt="lg" mb='sm'>Deploy your own model</Button>
      </>
  );
}

export { AddModel };