const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dkbrglurqpvhaztnbncz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYnJnbHVycXB2aGF6dG5ibmN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE3NjYxNCwiZXhwIjoyMDk4NzUyNjE0fQ.R6FIihF6nIYRY8f9WLHTYI7BrxWRmqEiLkkMLFHNU3E";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log("Base de datos lista");
}

module.exports = { supabase, migrate };
