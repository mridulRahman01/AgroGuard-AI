
import { Users, Activity, CheckCircle, XCircle, ShieldAlert, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const dummyUserActivity = [
    { id: 1, user: 'Rahim Mia', crop: 'Rice', disease: 'Leaf Blast', confidence: '91%', result: 'Success', date: 'Today' },
    { id: 2, user: 'Karim Mia', crop: 'Rice', disease: 'Unknown', confidence: '42%', result: 'Failed', date: 'Today' },
    { id: 3, user: 'Abdul Rahman', crop: 'Potato', disease: 'Early Blight', confidence: '88%', result: 'Success', date: 'Yesterday' },
    { id: 4, user: 'Selina Begum', crop: 'Tomato', disease: 'Late Blight', confidence: '85%', result: 'Success', date: 'Yesterday' },
    { id: 5, user: 'Akbar Ali', crop: 'Wheat', disease: 'Rust', confidence: '94%', result: 'Success', date: '12 Feb' },
];

const dummyRegionalData = [
    { district: 'Rajshahi', crop: 'Rice', disease: 'Leaf Blast', cases: 24, trend: 'up' },
    { district: 'Khulna', crop: 'Potato', disease: 'Early Blight', cases: 15, trend: 'stable' },
    { district: 'Rangpur', crop: 'Wheat', disease: 'Rust', cases: 9, trend: 'down' },
    { district: 'Sylhet', crop: 'Rice', disease: 'Brown Spot', cases: 7, trend: 'up' },
];

const dummyModelPerformance = [
    { date: 'Mon', accuracy: 88, errors: 12 },
    { date: 'Tue', accuracy: 89, errors: 11 },
    { date: 'Wed', accuracy: 92, errors: 8 },
    { date: 'Thu', accuracy: 91, errors: 9 },
    { date: 'Fri', accuracy: 87, errors: 13 },
    { date: 'Sat', accuracy: 93, errors: 7 },
    { date: 'Sun', accuracy: 95, errors: 5 },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* System Alerts */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-rose-600 mt-0.5" />
                <div>
                    <h3 className="text-rose-800 font-bold mb-1">System Alerts</h3>
                    <ul className="text-sm text-rose-700/80 list-disc list-inside space-y-1">
                        <li>High disease outbreak (Leaf Blast) detected in Rajshahi region.</li>
                        <li>Model accuracy slightly dipped below 90% yesterday; retraining recommended.</li>
                    </ul>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Users', value: '320', icon: Users, color: 'blue' },
                    { label: 'Total Analyses', value: '1,540', icon: Activity, color: 'indigo' },
                    { label: 'Successes', value: '1,340', icon: CheckCircle, color: 'green' },
                    { label: 'Failed', value: '200', icon: XCircle, color: 'red' },
                    { label: 'Active Today', value: '56', icon: Activity, color: 'amber' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs font-medium text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* User Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Recent Farmer Activity</h3>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Users</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50/50">
                                <tr className="text-gray-500">
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Crop Diagnosed</th>
                                    <th className="px-6 py-4 font-medium">Result</th>
                                    <th className="px-6 py-4 font-medium text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dummyUserActivity.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.user}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{row.crop}</span>
                                            <span className="text-gray-500"> • {row.disease} ({row.confidence})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${row.result === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {row.result}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Model Monitoring Chart */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Cpu className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-bold text-gray-900">AI Model Health</h3>
                        </div>
                        {/* Quick model stats */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-50">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Avg Accuracy</p>
                                <p className="text-xl font-bold pl-0.5 text-green-600">91.4%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Error Rate</p>
                                <p className="text-xl font-bold pl-0.5 text-rose-600">8.6%</p>
                            </div>
                        </div>

                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dummyModelPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis hide domain={['dataMin - 5', 'dataMax + 2']} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="accuracy" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Regional Monitoring List */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Regional Hotspots</h3>
                        <div className="space-y-4">
                            {dummyRegionalData.map((data, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{data.district}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{data.crop} ({data.disease})</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-bold text-amber-600">{data.cases} cases</span>
                                        {data.trend === 'up' && <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-100 px-1.5 rounded">Rising</span>}
                                        {data.trend === 'down' && <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-1.5 rounded">Dropping</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
