
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { Activity, CheckCircle, XCircle, Sprout, MessageSquare, History, Stethoscope, Droplets, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
    const [mostAnalyzed, setMostAnalyzed] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch analysis history for this user
                const { data, error } = await supabase
                    .from('analysis')
                    .select(`
                        id,
                        disease_name,
                        confidence_score,
                        analysis_date,
                        media!inner (
                            user_id,
                            crop_type
                        )
                    `)
                    .eq('media.user_id', user.id)
                    .order('analysis_date', { ascending: false });

                if (error) throw error;

                const formattedData = data?.map((a: any) => ({
                    id: a.id,
                    crop: a.media.crop_type,
                    disease: a.disease_name,
                    confidence: a.confidence_score,
                    status: 'Success',
                    created_at: a.analysis_date
                })) || [];

                setAnalysisHistory(formattedData);

                // Calculate stats
                const total = formattedData.length;
                const success = formattedData.length; // all saved are successful right now
                const failed = 0;
                setStats({ total, success, failed });

                // Chart data by crop
                const cropMap: Record<string, number> = {};
                formattedData.forEach((a: any) => {
                    cropMap[a.crop] = (cropMap[a.crop] || 0) + 1;
                });
                
                setChartData(Object.entries(cropMap).map(([name, count]) => ({ name, count })));
                
                // Most analyzed crop
                let maxCrop = '';
                let maxCount = 0;
                Object.entries(cropMap).forEach(([crop, count]) => {
                    if (count > maxCount) {
                        maxCrop = crop;
                        maxCount = count as number;
                    }
                });
                setMostAnalyzed(maxCrop);
            } catch (err: any) {
                console.error(err);
                toast.error('Could not load analysis history');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <Loader className="w-10 h-10 animate-spin text-green-600 mb-2" />
                <span className="text-gray-500">Loading your dashboard...</span>
            </div>
        );
    }

    // Wrap the entire dashboard in a fragment
    return (
        <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Activity className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">Total Analyzed</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.success}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">Successful</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <Sprout className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{mostAnalyzed || 'None'}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">Most Analyzed Result</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{chartData.length}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">Different Crops</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area: Chart and Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recharts Component block */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Crops Analyzed This Month</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium transition-colors">
                                <Stethoscope className="w-5 h-5" /> Analyze Crop
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium transition-colors">
                                <History className="w-5 h-5" /> View History
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-medium transition-colors">
                                <MessageSquare className="w-5 h-5" /> Talk to AI
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Area: Recent Analysis Table & Recommendations */}
                <div className="space-y-6">
                    {/* History Table (Mini) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Analysis History</h3>
                            <button className="text-sm font-medium text-green-600 hover:text-green-700">See all</button>
                        </div>
                        <div className="overflow-x-auto -mx-6 px-6">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Crop & Disease</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysisHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-gray-400">No analyses found.</td>
                                        </tr>
                                    ) : (
                                        analysisHistory.slice(0, 8).map((row) => (
                                            <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="font-medium text-gray-900">{row.crop}</div>
                                                    <div className="text-xs text-gray-500">{row.disease} ({row.confidence}%)</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${row.status === 'Success' ? 'bg-green-50 text-green-600' :
                                                        row.status === 'Failed' ? 'bg-red-50 text-red-600' :
                                                            'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Success' ? 'bg-green-500' :
                                                            row.status === 'Failed' ? 'bg-red-500' :
                                                                'bg-amber-500'
                                                            }`}></span>
                                                        {row.status}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right text-gray-500">{new Date(row.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Recommendations */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Treatment Plan</h3>
                        <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Rice • Leaf Blast</span>
                                <span className="text-xs text-green-600/80 font-medium">Active</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">Tricyclazole Fungicide</h4>
                            <p className="text-sm text-gray-600 mb-4">Apply 0.6g per liter of water as a spray across the field immediately.</p>
                            <button className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                                <Droplets className="w-4 h-4" /> Mark as Applied
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default FarmerDashboard;
