
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cnaxvqqvajjfpopqjcvk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_azm-n0c-Z6X8B8tJoHyRzg_ndoOkxQd';

export const supabase = createClient(supabaseUrl, supabaseKey);

