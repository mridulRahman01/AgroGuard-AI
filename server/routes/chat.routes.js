const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Initialize Supabase (Admin client for backend inserts)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/', async (req, res) => {
    try {
        const { message, userId, token } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build the prompt to enforce Bangla and agriculture-only responses
        const prompt = `
আপনি AgroGuard AI।

আপনার কাজ কৃষকদের সাহায্য করা।

নিয়ম:
১। শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের উত্তর দিবেন। অন্য কোনো বিষয়ে প্রশ্ন করলে বলবেন: "আমি AgroGuard AI। আমি শুধুমাত্র কৃষি সম্পর্কিত প্রশ্নের উত্তর দিতে পারি।"
২। সব উত্তর বাংলায় দিবেন।
৩। কৃষকদের সহজ ভাষায় ব্যাখ্যা করবেন।
৪। ওষুধের নাম এবং ব্যবহার পদ্ধতি পরিষ্কারভাবে বলবেন (যেমন: ১ লিটার পানিতে ২ গ্রাম ওষুধ মিশিয়ে স্প্রে করুন)।
৫। যদি কৃষক তার ফসলের সমস্যা বর্ণনা করে, তাহলে রোগের সম্ভাব্য নাম, করণীয়, এবং কীটনাশকের নাম সুপারিশ করবেন।

প্রশ্ন:
${message}
`;

        // Generate response from Gemini
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        // Optional: Log interaction to activity_logs
        if (userId && token) {
            try {
                const userSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
                    global: { headers: { Authorization: `Bearer ${token}` } }
                });

                // Log this activity asynchronously so it doesn't block the request
                const userNameResult = await userSupabase.from('profiles').select('full_name').eq('id', userId).single();
                const userName = userNameResult.data?.full_name || 'Farmer';
                
                await userSupabase.from('activity_logs').insert([
                    {
                        user_id: userId,
                        action_type: 'Chatbot Query',
                        description: `${userName} asked chatbot about: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`
                    }
                ]);
            } catch (err) {
                console.error("Failed to log activity:", err);
            }
        }

        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Failed to process chat request' });
    }
});

module.exports = router;
