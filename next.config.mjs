/** @type {import('next').NextConfig} */

import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

export default withMDX({
  reactStrictMode: true,
});
