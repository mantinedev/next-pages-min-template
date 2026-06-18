import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/docs/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'AarForms Docs',
        url: '/docs',
      }}
      searchToggle={{
        enabled: false,
      }}
      links={[
        {
          text: 'Back To App',
          url: '/',
          active: 'none',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
