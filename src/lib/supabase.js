import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = 'https://urbscvzyiqtzalforwdp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyYnNjdnp5aXF0emFsZm9yd2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzkyMjIsImV4cCI6MjA2NzIxNTIyMn0.X1SCLBsBWCGL0Pxag8mI2r0-OoW_Y0Q3boe1CTO7BUs'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase