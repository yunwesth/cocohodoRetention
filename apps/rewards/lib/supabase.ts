import { createBrowserClient } from '@supabase/ssr';
import { isConfigured, publicConfig } from '@/config/public';
export { isConfigured } from '@/config/public';

export function getSupabase() {
  if (!isConfigured) throw new Error('Live service is not connected yet.');
  return createBrowserClient(
    publicConfig.supabaseUrl,
    publicConfig.supabasePublishableKey,
  );
}
