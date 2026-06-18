// @ts-check
import { spawnSync } from 'node:child_process';
import { serwist } from '@serwist/next/config';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ?? crypto.randomUUID();

export default serwist({
  swSrc: 'service-worker/index.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [{ url: '/', revision }],
});
