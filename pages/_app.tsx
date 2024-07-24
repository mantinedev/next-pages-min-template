import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { theme } from "../theme";

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <ModalsProvider>
      <Notifications position="top-right" />
      <Head>
        <title>Mantine Template</title>
      </Head>
      <Component {...pageProps} />
      </ModalsProvider>
    </MantineProvider>
  );
}
