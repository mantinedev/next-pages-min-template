import { Button, Group, Container, Text, Title, Card } from "@mantine/core";
import { relative } from "path";
import { useEffect, useRef } from 'react';
import Logo from '../public/log.svg';
import Image from 'next/image';

export default function IndexPage() {

  return (
    <Group mt={0} justify="center">
    <div style={{maxWidth: '50%'}} >     
      <Card shadow="sm" padding="xl" radius="xl" withBorder style={{backgroundColor: '#2e2e2eAA'}}>

      <Title mb='10' order={1} style={{fontWeight: 900, fontSize: '5rem', textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <Image src={Logo} alt="Logo" width={100} />
      <Text
      component="span"
      inherit
      ml="lg"
      variant="gradient"
      gradient={{ from: '#E22732', to: '#FFFFFF' }}
      
    >
      Octagon AI
    </Text>

    </Title>
  <Text size="lg" style={{color: 'white', textAlign: 'center', minWidth: 600}}>We are a team of developers, designers and engineers that are passionate about technology and innovation. We are committed to creating a better world through the use of technology.</Text>
        </Card>      
  </div>
  </Group>

  );
}
