import type { NextConfig } from 'next';
import { assertBrowserSafeKey } from './config/validate';
// Fail before compiling a browser bundle if a privileged key was misconfigured.
assertBrowserSafeKey(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '');
const config: NextConfig = {
  transpilePackages: ['@cocohodo/ui'],
  allowedDevOrigins: ['127.0.0.1'],
  // A separate output directory allows isolated browser tests with service mocks.
  distDir: process.env.COCOHODO_TEST_DIST_DIR || '.next',
};
export default config;
