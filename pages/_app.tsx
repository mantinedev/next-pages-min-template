import "@mantine/core/styles.css";
import Head from "next/head";
import { HeaderMegaMenu } from "../lib/HeaderMegaMenu/HeaderMegaMenu";
import { MantineProvider, createTheme, MantineColorsTuple, Button, useMantineTheme } from '@mantine/core';
import { FooterLinks } from "../lib/FooterLinks/FooterLinks";
import VantaNet from '../components/VantaNet';

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
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Head>
        <title>Mantine Template</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <HeaderMegaMenu  />
      <Component id='megaBackground' {...pageProps} />
      <FooterLinks />
    </MantineProvider>
  );
}
