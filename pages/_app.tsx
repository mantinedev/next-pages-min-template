"use client";
import "@mantine/core/styles.css";
import Head from "next/head";
import { HeaderMegaMenu } from "../lib/HeaderMegaMenu/HeaderMegaMenu";
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
  Button,
  useMantineTheme,
  Container,
} from "@mantine/core";
import { FooterLinks } from "../lib/FooterLinks/FooterLinks";
import { useEffect, useRef } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "@mantine/notifications/styles.css";
import "../public/overrides.css";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  colors: {
    blue: [
      "#ffeaec",
      "#fdd4d6",
      "#f4a7ac",
      "#ec777e",
      "#e64f57",
      "#e3353f",
      "#e22732",
      "#c91a25",
      "#b31220",
      "#9e0419",
    ],
  },
});

export default function App({ Component, pageProps }: any) {
  const cssOverrides = `
  .button--padding-large {
    padding: 0.66rem 1rem;
  }
`;

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
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xe64f57,
          backgroundColor: 0x242424,
        });
      }
    };

    // Load Vanta after the scripts are loaded
    if (typeof window !== "undefined" && window.VANTA) {
      loadVanta();
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
              retry: false,
            },
          },
        })
      }
    >
      <MantineProvider theme={theme} forceColorScheme="dark">
        <ModalsProvider>
          <Head>
            <title>Octagon AI - Where your AI project lives.</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link rel="shortcut icon" href="/favicon.svg" />
          </Head>
          <DynamicContextProvider
            settings={{
              environmentId: "a2dea8be-028b-4848-a65f-a57fe56a8770",
              walletConnectors: [EthereumWalletConnectors],
              walletConnectorExtensions: [EthersExtension],
              cssOverrides: cssOverrides,
            }}
          >
            <HeaderMegaMenu />
            <Container fluid>
              <div
                ref={vantaRef}
                style={{
                  width: "100%",
                  height: "90vh",
                  position: "relative",
                  display: "flex",
                  overflow: "scroll",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Component {...pageProps} />
                </div>
              </div>
            </Container>
            <FooterLinks />
          </DynamicContextProvider>
          <Notifications />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
