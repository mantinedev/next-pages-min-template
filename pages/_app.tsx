import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import { ClerkProvider } from '@clerk/nextjs';

export default function App({ Component, pageProps }: any) {
  return (
    <ClerkProvider {...pageProps}>
      <MantineProvider defaultColorScheme="light" theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <Head>
            <title>AarTemplate</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="theme-color" content="#005fae" />
          </Head>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </ClerkProvider>
  );
}
