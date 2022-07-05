const config = require('./config');
const { createClient } = require('@supabase/supabase-js')
const dbConfig = config.supabase;
const supabase = createClient(
  dbConfig.SUPABASE_URL,
  dbConfig.SUPABASE_KEY,
)
module.exports = supabase;
