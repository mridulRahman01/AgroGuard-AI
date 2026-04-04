const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase Admin (Bypasses RLS)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/dashboard', async (req, res) => {
    try {
        console.log('Fetching Admin Dashboard Data...');
        
        // 1. Fetch User count
        const { count: userCount, error: userErr } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
            
        if (userErr) throw new Error(`User Count Error: ${userErr.message}`);

        // 2. Fetch Latest Analysis Activity joined with Profiles
        const { data: analyses, error: analysisErr } = await supabase
            .from('analysis')
            .select(`
                id,
                disease_name,
                confidence_score,
                analysis_date,
                media!inner (
                    crop_type,
                    user_id,
                    profiles (
                        full_name
                    )
                )
            `)
            .order('analysis_date', { ascending: false })
            .limit(10);
            
        if (analysisErr) throw new Error(`Analysis Fetch Error: ${analysisErr.message}`);

        const formattedAnalyses = analyses?.map((a) => ({
            id: a.id,
            user: a.media?.profiles?.full_name || 'Unknown User',
            crop: a.media?.crop_type || 'Unknown Crop',
            disease: a.disease_name,
            confidence: `${Math.round(a.confidence_score || 0)}%`,
            result: 'Success', 
            date: new Date(a.analysis_date).toLocaleDateString()
        })) || [];

        // 3. Return Payload
        return res.status(200).json({
            success: true,
            stats: {
                users: userCount || 0,
                analyses: analyses?.length || 0,
                success: analyses?.length || 0,
                failed: 0,
                activeToday: Math.floor((userCount || 0) * 0.1) // Mock
            },
            recentAnalyses: formattedAnalyses
        });

    } catch (error) {
        console.error('Admin API Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to fetch admin data' });
    }
});

module.exports = router;
