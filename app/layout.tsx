import 'fumadocs-ui/style.css';
import 'fumadocs-ui/css/ocean.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';

export const metadata: Metadata = {
  title: {
    default: 'AarForms Docs',
    template: '%s | AarForms Docs',
  },
  description: 'Operational documentation for AarForms.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sync Mantine's stored color scheme to next-themes before it initialises */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('mantine-color-scheme-value');if(m==='light'||m==='dark'){localStorage.setItem('theme',m)}else{localStorage.removeItem('theme')}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <RootProvider
          search={{ enabled: false }}
          theme={{ attribute: 'class', defaultTheme: 'system' }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
