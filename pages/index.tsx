import { Button, Group, Container, Text, Title, Card } from "@mantine/core";
import { relative } from "path";
import { useEffect, useRef } from 'react';
import Logo from '../public/log.svg';
import Image from 'next/image';

export default function IndexPage() {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;
    const loadVanta = () => {
      if (vantaRef.current && !vantaEffect) {
        vantaEffect = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xe64f57,
          backgroundColor: 0x242424,
        });
      }
    };

    // Load Vanta after the scripts are loaded
    if (typeof window !== 'undefined' && window.VANTA) {
      loadVanta();
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);
  return (
    <Container fluid>
        <div ref={vantaRef} style={{ width: '100%', height: '90vh', position: 'relative', display: 'flex' }}>
          <div style={{position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
            
            <Group mt={0} justify="center">
              <div style={{maxWidth: '50%'}} >     
                <Card shadow="sm" padding="xl" radius="xl" withBorder style={{backgroundColor: '#2e2e2eAA'}}>

                <Title mb='10' order={1} style={{fontWeight: 900, fontSize: '5rem', textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                <Image src={Logo} alt="Logo" width={100} />

            <Text
                component="span"
                inherit
                ml={25}
                variant="gradient"
                gradient={{ from: '#e7515a', to: '#FFFFFF' }}
                
              >
                Octagon AI
              </Text>
            </Title>
            <Text>
            <Text size="lg" style={{color: 'white', textAlign: 'center', minWidth: 600}}>We are a team of developers, designers and engineers that are passionate about technology and innovation. We are committed to creating a better world through the use of technology.</Text>

            </Text>

                  </Card>      
            </div>
            </Group>

          </div>
        </div>
    </Container>
  );
}
