import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { emotionCache } from "../emotion/cache";

export default function App({ Component, pageProps }: any) {
  return (
    <MantineEmotionProvider cache={emotionCache}>
      <MantineProvider theme={theme} stylesTransform={emotionTransform}>
        <Head>
          <title>Mantine Template</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </MantineEmotionProvider>
  );
}
