const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing insert with Anon Key...");
    const { data, error } = await supabase.from('media').insert([{
        user_id: 'c6b954b3-889f-443c-89dc-88c7e6babe3a',
        image_url: 'test',
        crop_type: 'test',
        location: 'test'
    }]);
    if (error) {
        console.error("Anon Key Error:", error.message);
    } else {
        console.log("Anon Key Success!");
    }
}
testInsert();
