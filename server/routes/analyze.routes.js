const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Initialize Supabase Admin
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/', async (req, res) => {
    try {
        const { userId, imageBase64, mimeType, imageUrl, cropType, location, token } = req.body;

        if (!(imageBase64 || imageUrl) || !userId || !token) {
            return res.status(400).json({ error: 'userId, image (base64 or url), and authentication token are required' });
        }

        console.log(`Analyzing image for user ${userId}`);

        // 1. Fetch Image as Base64 for Gemini
        let finalBase64 = imageBase64;
        let finalMimeType = mimeType || 'image/jpeg';

        if (!finalBase64 && imageUrl) {
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');
            finalMimeType = imageResponse.headers['content-type'] || 'image/jpeg';
            finalBase64 = imageBuffer.toString("base64");
        }
        
        const imagePart = {
            inlineData: {
                data: finalBase64,
                mimeType: finalMimeType
            }
        };

        // 2. Query Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
আপনি একজন বিশেষজ্ঞ কৃষিবিজ্ঞানী। এই ফসলের ছবিটি বিশ্লেষণ করুন এবং বাংলায় রোগ নির্ণয় করুন।
ফসল: ${cropType || 'অজানা'}

আপনাকে অবশ্যই নিচের JSON ফরম্যাটে উত্তর দিতে হবে (কোনো অতিরিক্ত টেক্সট বা মার্কডাউন ছাড়া):
{
  "diseaseName": "রোগের নাম (ইংরেজিতে বা বাংলায়)",
  "severityLevel": "High / Medium / Low",
  "confidenceScore": 95,
  "problemType": "Fungal / Bacterial / Pest / Other",
  "problemDescription": "রোগের কারণ এবং বিস্তারিত",
  "damagePercentage": 50,
  "affectedArea": "পাতায় / কাণ্ডে / মূলে",
  "recommendationType": "pesticide",
  "recommendationDescription": "কী করতে হবে তার বিস্তারিত",
  "treatmentName": "ওষুধের নাম",
  "dosage": "১ লিটার পানিতে ২ গ্রাম",
  "instructions": "প্রয়োগের নিয়ম এবং সময়"
}
`;

        const result = await model.generateContent([prompt, imagePart]);
        let responseText = result.response.text().trim();
        
        // Clean JSON formatting if Gemini adds markdown blocks
        if (responseText.startsWith('\`\`\`json')) {
            responseText = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        } else if (responseText.startsWith('\`\`\`')) {
            responseText = responseText.replace(/\`\`\`/g, '').trim();
        }

        const aiData = JSON.parse(responseText);

        // 3. Database Storage Flow (Using user token to bypass RLS failures)
        let savedMediaId = null;
        let savedAnalysisId = null;
        
        try {
            const userSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
                global: { headers: { Authorization: `Bearer ${token}` } }
            });
            
            // Insert Media (Fallback mapping for image_url if Direct Upload)
            const { data: mediaData, error: mediaErr } = await userSupabase
                .from('media')
                .insert([{ user_id: userId, image_url: imageUrl || 'direct-base64-upload', crop_type: cropType, location: location || 'Unknown' }])
                .select()
                .single();
            if (mediaErr) throw new Error(`Media Insert Error: ${mediaErr.message}`);
            savedMediaId = mediaData.id;

            // Insert Analysis
            const { data: analysisData, error: analysisErr } = await userSupabase
                .from('analysis')
                .insert([{
                    media_id: mediaData.id,
                    disease_name: aiData.diseaseName,
                    severity_level: aiData.severityLevel,
                    confidence_score: aiData.confidenceScore
                }])
                .select()
                .single();
            if (analysisErr) throw new Error(`Analysis Insert Error: ${analysisErr.message}`);
            savedAnalysisId = analysisData.id;

            // Insert Problem
            const { data: problemData, error: problemErr } = await userSupabase
                .from('problem')
                .insert([{ 
                    analysis_id: analysisData.id, 
                    problem_type: aiData.problemType, 
                    description: aiData.problemDescription 
                }])
                .select()
                .single();
            if (problemErr) throw new Error(`Problem Insert Error: ${problemErr.message}`);

            // Insert Damage
            const { error: damageErr } = await userSupabase
                .from('damage')
                .insert([{ 
                    analysis_id: analysisData.id, 
                    damage_percentage: aiData.damagePercentage, 
                    affected_area: aiData.affectedArea 
                }]);
            if (damageErr) throw new Error(`Damage Insert Error: ${damageErr.message}`);

            // Insert Recommendation
            const { data: recData, error: recErr } = await userSupabase
                .from('recommendations')
                .insert([{ 
                    problem_id: problemData.id, 
                    recommendation_type: 'pesticide', // Fallback to pesticide for schema consistency
                    description: aiData.recommendationDescription 
                }])
                .select()
                .single();
            if (recErr) throw new Error(`Rec Insert Error: ${recErr.message}`);

            // Insert Treatment
            const { error: treatErr } = await userSupabase
                .from('treatments')
                .insert([{ 
                    recommendation_id: recData.id, 
                    treatment_name: aiData.treatmentName, 
                    dosage: aiData.dosage,
                    instructions: aiData.instructions
                }]);
            if (treatErr) throw new Error(`Treatment Insert Error: ${treatErr.message}`);

            // Log Activity
            const userNameResult = await userSupabase.from('profiles').select('full_name').eq('id', userId).single();
            const userName = userNameResult.data?.full_name || 'Farmer';
            await userSupabase.from('activity_logs').insert([{
                user_id: userId,
                action_type: 'Crop Analysis',
                description: `${userName} uploaded ${cropType || 'crop'} image and detected ${aiData.diseaseName}`
            }]);
        } catch (dbError) {
            console.error('Database Storage Warning (Proceeding anyway):', dbError.message);
            // We ignore DB errors rather than crashing the analysis endpoint!
        }

        // 4. Return Report to Frontend
        return res.status(200).json({ 
            success: true, 
            report: aiData,
            mediaId: savedMediaId,
            analysisId: savedAnalysisId
        });

    } catch (error) {
        console.error('Analysis API Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to analyze image' });
    }
});

module.exports = router;
