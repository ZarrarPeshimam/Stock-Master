import { Package, Warehouse, TrendingUp, Truck, ArrowLeftRight, ClipboardList, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const kpis = [
    { label: 'Total Products', value: '1,284', change: '+12%', icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Stock Value', value: '$284,500', change: '+8%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { label: 'Warehouses', value: '8', change: '+2', icon: Warehouse, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Low Stock', value: '23', change: '-5', icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
  ];
  const activity = [
    { type: 'receipt', desc: 'Received 500 units - Electronics', time: '2h ago' },
    { type: 'delivery', desc: 'Delivered 200 units to Customer A', time: '4h ago' },
    { type: 'transfer', desc: 'Transfer from WH-001 to WH-003', time: '6h ago' },
    { type: 'adjustment', desc: 'Stock adjustment - 50 units', time: '1d ago' },
  ];
  
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Dashboard</h1><p className="text-gray-400">Welcome back! Here's your inventory overview.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-gray-400 text-sm">{k.label}</p><p className="text-2xl font-bold text-white mt-1">{k.value}</p><span className={`text-sm ${k.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>{k.change}</span></div>
              <div className={`w-12 h-12 bg-gradient-to-r ${k.color} rounded-xl flex items-center justify-center`}><k.icon className="w-6 h-6 text-white" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.type === 'receipt' ? 'bg-emerald-500/20 text-emerald-400' : a.type === 'delivery' ? 'bg-blue-500/20 text-blue-400' : a.type === 'transfer' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {a.type === 'transfer' ? <ArrowLeftRight className="w-5 h-5" /> : a.type === 'adjustment' ? <ClipboardList className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                </div>
                <div className="flex-1"><p className="text-white text-sm">{a.desc}</p><p className="text-gray-500 text-xs">{a.time}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {['Widget Pro X', 'Sensor Module A', 'Cable Type C', 'Battery Pack L'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-amber-400" /></div>
                  <div><p className="text-white text-sm font-medium">{item}</p><p className="text-gray-500 text-xs">{5 + i * 2} units left</p></div>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Low Stock</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;