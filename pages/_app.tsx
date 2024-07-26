import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "../theme";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: any) {
  return (
    <SessionProvider>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <Head>
            <title>Mantine Template</title>
          </Head>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
}
