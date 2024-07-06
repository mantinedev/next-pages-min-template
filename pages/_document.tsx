import { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";
import Script from 'next/script'
import { useEffect, useRef } from 'react';


export default function Document() {

  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </Head>
      <body>
        <NextScript />
        <Script src="https://widgets.arbitrum.nevermined.app/nvm-agent-widget-loader.js" strategy="lazyOnload" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" strategy="beforeInteractive" />
      </body>
    </Html>
  );
}
