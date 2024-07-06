"use client";
import "@mantine/core/styles.css";
import Head from "next/head";
import { HeaderMegaMenu } from "../lib/HeaderMegaMenu/HeaderMegaMenu";
import { MantineProvider, createTheme, MantineColorsTuple, Button, useMantineTheme, Container } from '@mantine/core';
import { FooterLinks } from "../lib/FooterLinks/FooterLinks";
import { useEffect, useRef } from 'react';

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  colors: {
    blue: [
      '#ffeaec',
      '#fdd4d6',
      '#f4a7ac',
      '#ec777e',
      '#e64f57',
      '#e3353f',
      '#e22732',
      '#c91a25',
      '#b31220',
      '#9e0419',
    ],
  },

});


export default function App({ Component, pageProps }: any) {

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
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Head>
        <title>Octagon</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <HeaderMegaMenu  />
      <Container fluid>
        <div ref={vantaRef} style={{ width: '100%', height: '90vh', position: 'relative', display: 'flex' }}>
          <div style={{position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
            <Component {...pageProps} />
          </div>
        </div>
    </Container>
      <FooterLinks />
    </MantineProvider>
  );
}
