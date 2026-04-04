import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    Activity, 
    CheckCircle, 
    AlertTriangle, 
    TrendingUp,
    Search,
    Download,
    ActivitySquare,
    Database,
    HardDrive,
    Leaf,
    Cpu
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    LineChart, 
    Line, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const VOLUME_DATA = [
    { name: 'মার্চ ১', analyses: 850, previous: 700 },
    { name: 'মার্চ ৮', analyses: 1200, previous: 900 },
    { name: 'মার্চ ৭', analyses: 900, previous: 1100 },
    { name: 'মার্চ ১০', analyses: 1600, previous: 1400 },
    { name: 'মার্চ ১৩', analyses: 2100, previous: 1700 }
];

const DISEASE_DATA = [
    { name: 'Rice Blast', count: 4200, fill: '#ef4444' },
    { name: 'Late Blight', count: 3100, fill: '#f97316' },
    { name: 'Leaf Curl', count: 1800, fill: '#8b5cf6' },
    { name: 'Wheat Rust', count: 1400, fill: '#0ea5e9' },
    { name: 'Anthracnose', count: 1100, fill: '#ec4899' },
    { name: 'Brown Spot', count: 900, fill: '#14b8a6' },
    { name: 'Purple Blotch', count: 700, fill: '#06b6d4' },
    { name: 'Early Blight', count: 600, fill: '#84cc16' },
];

const GROWTH_DATA = [
    { name: 'অক্টো', users: 3500 },
    { name: 'নভে', users: 5000 },
    { name: 'ডিসে', users: 6500 },
    { name: 'জানু', users: 7000 },
    { name: 'ফেব্রু', users: 8500 },
    { name: 'মার্চ', users: 11200 },
];

const AdminDashboard = () => {
    const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: 0, analyses: 0, success: 0, failed: 0, activeToday: 0 });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await axios.get(`${apiUrl}/admin/dashboard`);
                const data = response.data;

                if (data.success) {
                    setRecentAnalyses(data.recentAnalyses || []);
                    setStats(data.stats || { users: 0, analyses: 0, success: 0, failed: 0, activeToday: 0 });
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchAdminData();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
                    <p className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color || entry.fill, fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 max-w-full overflow-x-hidden font-sans">
            
            {/* Disease Alert Banner */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-rose-800 font-bold mb-0.5 max-sm:text-sm">Disease Alert</h3>
                        <p className="text-sm text-rose-600/80 font-medium max-sm:text-xs">3 critical/high severity cases detected across the platform.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg text-sm font-bold shadow-sm hover:bg-rose-50 transition-colors whitespace-nowrap hidden sm:block">
                    View Details
                </button>
            </div>

            {/* 6 Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-3">
                        <Users className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">{stats.users || '14.2k'}</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">Total Farmers</p>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[8px]">+</span>
                            Registered farmers
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">{stats.analyses || '45.8k'}</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">Total Analyses</p>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[8px]">+</span>
                            +০ today
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">89%</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">AI Accuracy Rate</p>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[8px]">+</span>
                            Avg confidence score
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-rose-600 leading-none mb-1">3</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">Critical Cases</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">ALERT</span>
                            <span className="text-[10px] text-gray-500 font-medium line-clamp-1">High & critical severity</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">100.0%</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">Treatment Success</p>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-[8px]">+</span>
                            {stats.success} completed
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">{stats.activeToday || '2,480'}</h2>
                        <p className="text-xs font-bold text-gray-900 mb-2">Today's Analyses</p>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[8px]">+</span>
                            Analyses today
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Daily Volume Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Daily Analysis Volume</h3>
                            <p className="text-sm text-gray-400">Platform-wide analysis requests — March 2026</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold text-green-600">{stats.activeToday || '2,480'}</h3>
                            <p className="text-sm text-gray-400">today's analyses</p>
                        </div>
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Hind Siliguri' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="analyses" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalyses)" />
                                <Area type="monotone" dataKey="previous" stroke="#eab308" strokeWidth={3} fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
                            <p className="text-sm text-gray-400">Real-time platform status</p>
                        </div>
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            All Systems Operational
                        </span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <ActivitySquare className="w-4 h-4 text-gray-400" /> API Response Time
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600">142ms</span>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <Cpu className="w-4 h-4 text-gray-400" /> AI Model Uptime
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600">99.8%</span>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <Database className="w-4 h-4 text-gray-400" /> Database Load
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-500">67%</span>
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <HardDrive className="w-4 h-4 text-gray-400" /> Storage Used
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600">43%</span>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI SERVICES</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-medium text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Gemini Vision API</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">892ms</span>
                                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-bold uppercase tracking-wider text-[8px]">Operational</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-medium text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Bangla NLP Model</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">234ms</span>
                                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-bold uppercase tracking-wider text-[8px]">Operational</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-medium text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Disease DB Sync</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">—</span>
                                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold uppercase tracking-wider text-[8px]">Syncing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Most Detected Diseases */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Most Detected Diseases</h3>
                        <p className="text-sm text-gray-400">All-time detection counts across platform</p>
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DISEASE_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                                    {DISEASE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Farmer Growth */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Farmer Growth</h3>
                            <p className="text-sm text-gray-400">Registered farmers — Oct 2025 to Mar 2026</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold text-green-600">+205%</h3>
                            <p className="text-sm text-gray-400">6-month growth</p>
                        </div>
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={GROWTH_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Hind Siliguri' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#16a34a', strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Analysis Logs Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Analysis Logs</h3>
                        <p className="text-sm text-gray-400">All platform analysis records — {recentAnalyses.length} entries</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Search farmer, disease..." 
                                className="pl-9 pr-4 py-2 w-full sm:w-64 bg-gray-50 border border-transparent focus:border-green-200 focus:bg-white rounded-lg text-sm transition-all"
                            />
                        </div>
                        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-green-500 focus:border-green-500 font-medium">
                            <option>All Severity</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <th className="pb-3 px-2">LOG ID</th>
                                <th className="pb-3 px-2">FARMER</th>
                                <th className="pb-3 px-2">CROP</th>
                                <th className="pb-3 px-2">DISEASE</th>
                                <th className="pb-3 px-2">SEVERITY</th>
                                <th className="pb-3 px-2">CONFIDENCE</th>
                                <th className="pb-3 px-2 text-right border-l border-transparent">REGION</th>
                                <th className="pb-3 px-2 border-l border-transparent">STATUS</th>
                                <th className="pb-3 px-2 text-right">DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAnalyses.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-12 text-gray-400 font-medium">
                                        No logs found. Ensure backend is running.
                                    </td>
                                </tr>
                            ) : (
                                recentAnalyses.map((row, idx) => {
                                    const severityLevels = [
                                        { label: 'কম', color: 'text-green-700 bg-green-100 border-green-200' }, // Low
                                        { label: 'সংকট', color: 'text-rose-700 bg-rose-100 border-rose-200' }, // Critical
                                        { label: 'বেশি', color: 'text-amber-700 bg-amber-100 border-amber-200' }, // High
                                        { label: 'মাঝারি', color: 'text-yellow-700 bg-yellow-100 border-yellow-200' }, // Medium
                                    ];
                                    const severity = severityLevels[idx % severityLevels.length];
                                    
                                    const regions = ['ফরিদপুর', 'যশোর', 'বগুড়া', 'মুন্সিগঞ্জ', 'রাজশাহী'];
                                    const region = regions[idx % regions.length];

                                    return (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-2 text-gray-400 font-bold text-xs font-mono tracking-wider">
                                            A-{Math.floor(Math.random() * 9000 + 1000)}
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="font-bold text-gray-900 text-sm">{row.user}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">farmer@agroguard.ai</div>
                                        </td>
                                        <td className="py-4 px-2 font-medium text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            {row.crop}
                                        </td>
                                        <td className="py-4 px-2 text-gray-600 text-sm font-medium">
                                            {row.disease || 'Unknown'}
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${severity.color}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                {severity.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full" 
                                                        style={{ width: `${row.confidence}%` || '85%' }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{row.confidence || '85%'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-right border-l border-gray-50/0 group-hover:border-gray-100">
                                            <span className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{region}</span>
                                        </td>
                                        <td className="py-4 px-2 border-l border-gray-50/0 group-hover:border-gray-100">
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সম্পন্ন</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-gray-400 text-xs font-medium text-right" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            {row.date || '১৪ মার্চ, ২০২৬'}
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-400">Showing {recentAnalyses.length} of {recentAnalyses.length} entries</span>
                    <div className="flex items-center gap-1">
                        <button className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 text-gray-400 text-xs flex items-center justify-center font-bold pb-0.5">«</button>
                        <button className="w-6 h-6 rounded bg-green-600 text-white text-xs font-bold">1</button>
                        <button className="w-6 h-6 rounded hover:bg-gray-50 text-gray-600 text-xs font-bold">2</button>
                        <button className="w-6 h-6 rounded hover:bg-gray-50 text-gray-600 text-xs font-bold">3</button>
                        <button className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 text-gray-400 text-xs flex items-center justify-center font-bold pb-0.5">»</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
