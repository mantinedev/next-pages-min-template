import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";
import createEmotionServer from "@emotion/server/create-instance";
import { createGetInitialProps } from "@mantine/emotion";
import { emotionCache } from "../emotion/cache";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const stylesServer = createEmotionServer(emotionCache);

Document.getInitialProps = createGetInitialProps(NextDocument, stylesServer);
