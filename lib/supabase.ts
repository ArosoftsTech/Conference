
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnaxvqqvajjfpopqjcvk.supabase.co';
const supabaseKey = 'sb_publishable_azm-n0c-Z6X8B8tJoHyRzg_ndoOkxQd';

export const supabase = createClient(supabaseUrl, supabaseKey);

