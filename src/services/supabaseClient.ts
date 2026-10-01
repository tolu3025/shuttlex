import { createClient } from '@supabase/supabase-js';

// ShuttleX Supabase Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jqxsdojqvlsfjzqwxiqi.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHNkb2pxdmxzZmp6cXd4aXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTU1MDQsImV4cCI6MjEwNjE5MTUwNH0.bzeCDBXdITWWwmCRLpWLxHVkX8zOp_X30kW8_LUDGwo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('example')
  );
}
