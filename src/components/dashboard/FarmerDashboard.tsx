import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { 
    Activity, 
    CheckCircle, 
    AlertTriangle, 
    Eye,
    Search,
    Download,
    Leaf
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart, 
    Pie, 
    Cell
} from 'recharts';

const TREND_DATA = [
    { name: 'জানু ১', total: 3, detected: 2 },
    { name: 'জানু ২', total: 5, detected: 4 },
    { name: 'জানু ৩', total: 4, detected: 2 },
    { name: 'ফেব্রু ১', total: 7, detected: 5 },
    { name: 'ফেব্রু ২', total: 6, detected: 3 },
    { name: 'ফেব্রু ৩', total: 9, detected: 7 },
    { name: 'মার্চ ১', total: 8, detected: 6 },
    { name: 'মার্চ ২', total: 10, detected: 8 },
];

const DONUT_COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6'];

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
    const [diseaseData, setDiseaseData] = useState<any[]>([]);

    const [stats, setStats] = useState({ total: 0, detected: 0, success: 0, monitored: 0 });

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!user) return;
            try {
                // Fetch analysis history
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
                    status: 'সম্পন্ন', // Default to completed
                    created_at: a.analysis_date
                })) || [];

                setAnalysisHistory(formattedData);

                // Calculate stats
                const total = formattedData.length;
                // Currently just making demo dynamic data
                setStats({ 
                    total: total, 
                    detected: Math.floor(total * 0.8), // Mock detected
                    success: Math.floor(total * 0.9),  // Mock success rate
                    monitored: new Set(formattedData.map(a => a.crop)).size // Distinct crops
                });

                // Disease Distribution for Donut chart
                const diseaseCount: Record<string, number> = {};
                formattedData.forEach(d => {
                    const name = d.disease || 'Unknown';
                    diseaseCount[name] = (diseaseCount[name] || 0) + 1;
                });
                const dData = Object.keys(diseaseCount).map(k => ({
                    name: k,
                    value: diseaseCount[k]
                }));
                // If no real data, show a default empty graph or mock
                if (dData.length === 0) {
                    setDiseaseData([
                        { name: 'ব্লাস্ট রোগ', value: 18 },
                        { name: 'লেট ব্লাইট', value: 12 },
                        { name: 'লিফ কার্ল', value: 8 },
                        { name: 'মরিচা রোগ', value: 6 },
                        { name: 'অন্যান্য', value: 8 }
                    ]);
                } else {
                    setDiseaseData(dData.sort((a,b) => b.value - a.value).slice(0, 5));
                }

            } catch (err: any) {
                console.error(err);
                toast.error('Could not load data');
            }
        };
        fetchAnalysis();
    }, [user]);

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                    <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color, fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {entry.name === 'total' ? 'মোট বিশ্লেষণ' : 'রোগ শনাক্ত'}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 max-w-full overflow-x-hidden font-sans">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium cursor-pointer hover:text-green-600 transition-colors">→</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">{stats.total}</h2>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মোট বিশ্লেষণ</p>
                    <p className="text-xs text-green-600 flex items-center font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        +০ এই মাসে
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-red-50/30 p-5 rounded-2xl border border-red-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সতর্ক</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-red-600">{stats.detected}</h2>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>শনাক্তকৃত রোগ</p>
                    <p className="text-xs text-red-500 flex items-center font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        +০ এই সপ্তাহে
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium cursor-pointer hover:text-green-600 transition-colors">→</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">{stats.success}</h2>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সফল চিকিৎসা</p>
                    <p className="text-xs text-green-600 flex items-center font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        ০% সাফল্যের হার
                    </p>
                </div>

                {/* Card 4 */}
                <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Eye className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium cursor-pointer hover:text-blue-600 transition-colors">→</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">{stats.monitored}</h2>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>পর্যবেক্ষিত ফসল</p>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        ধান, আলু, টমেটো...
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Trend Chart (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>বিশ্লেষণের প্রবণতা</h3>
                            <p className="text-sm text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাপ্তাহিক বিশ্লেষণ ও রোগ শনাক্তকরণ</p>
                        </div>
                        <div className="flex bg-gray-50 rounded-lg p-1">
                            <button className="px-3 py-1.5 text-xs font-bold text-green-700 bg-white shadow-sm rounded-md" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাপ্তাহিক</button>
                            <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 rounded-md transition-colors" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মাসিক</button>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Hind Siliguri' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                <Area type="monotone" dataKey="detected" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDetected)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                            <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মোট বিশ্লেষণ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>রোগ শনাক্ত</span>
                        </div>
                    </div>
                </div>

                {/* Donut Chart (Right 1 col) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>রোগের বিতরণ</h3>
                        <p className="text-sm text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>শনাক্তকৃত রোগের অনুপাত</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center mt-4">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={diseaseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {diseaseData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Hind Siliguri' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="w-full mt-4 space-y-2">
                            {diseaseData.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}></span>
                                        <span className="text-gray-600 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{entry.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Table (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>বিশ্লেষণের ইতিহাস</h3>
                            <p className="text-sm text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>০টি রেকর্ড</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="খুঁজুন..." 
                                    className="pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-lg text-sm transition-all"
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                />
                            </div>
                            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    <th className="pb-3 px-2 font-medium">আইডি <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">ফসল <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">রোগ <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">তীব্রতা <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">নির্ভুলতা <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">অবস্থা <ChevronDownIcon /></th>
                                    <th className="pb-3 px-2 font-medium">তারিখ <ChevronDownIcon /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysisHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            কোনো বিশ্লেষণ পাওয়া যায়নি।
                                        </td>
                                    </tr>
                                ) : (
                                    analysisHistory.slice(0, 5).map((row, idx) => (
                                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-2 text-gray-400 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                A-{row.id.toString().slice(0, 4)}
                                            </td>
                                            <td className="py-3 px-2 font-medium text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                {row.crop}
                                            </td>
                                            <td className="py-3 px-2 text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                {row.disease || 'Unknown'}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                                    idx % 3 === 0 ? 'bg-amber-100 text-amber-700' :
                                                    idx % 3 === 1 ? 'bg-red-100 text-red-700' :
                                                    'bg-green-100 text-green-700'
                                                }`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                    {idx % 3 === 0 ? 'মাঝারি' : idx % 3 === 1 ? 'বেশি' : 'কম'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-green-500 rounded-full" 
                                                            style={{ width: `${row.confidence}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">{Math.round(row.confidence)}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-1.5 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-xs font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{row.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-gray-500 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                {new Date(row.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{analysisHistory.length}টির মধ্যে ১-{Math.min(5, analysisHistory.length)} দেখাচ্ছে</span>
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 rounded-md bg-green-600 text-white text-sm font-bold">1</button>
                            <button className="w-8 h-8 rounded-md hover:bg-gray-50 text-gray-600 text-sm font-bold">2</button>
                            <button className="w-8 h-8 rounded-md hover:bg-gray-50 text-gray-600 text-sm font-bold">3</button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity (Right 1 col) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাম্প্রতিক কার্যক্রম</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                            <Leaf className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-gray-900 font-bold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>কোনো কার্যক্রম নেই।</p>
                        <p className="text-sm text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ফসল বিশ্লেষণ করুন।</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ChevronDownIcon = () => (
    <svg className="w-3 h-3 inline-block ml-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default FarmerDashboard;
