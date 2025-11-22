const AnalyticsPage = () => {
  const stockData = [
    { month: 'Jan', receipts: 4500, deliveries: 3800 },
    { month: 'Feb', receipts: 5200, deliveries: 4100 },
    { month: 'Mar', receipts: 4800, deliveries: 5200 },
    { month: 'Apr', receipts: 6100, deliveries: 4900 },
    { month: 'May', receipts: 5500, deliveries: 5800 },
    { month: 'Jun', receipts: 6800, deliveries: 5200 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#8b5cf6' },
    { name: 'Accessories', value: 25, color: '#3b82f6' },
    { name: 'Components', value: 20, color: '#10b981' },
    { name: 'Other', value: 10, color: '#f59e0b' },
  ];

  const warehouseUtil = [
    { name: 'WH-001', used: 65 },
    { name: 'WH-002', used: 52 },
    { name: 'WH-003', used: 82 },
    { name: 'WH-004', used: 35 },
  ];

  const maxVal = Math.max(...stockData.map(d => Math.max(d.receipts, d.deliveries)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Analytics</h1><p className="text-gray-400">Inventory performance insights</p></div>
        <select className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm">
          <option>Last 6 Months</option>
          <option>Last Year</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stock Movement Trends</h3>
          <div className="h-64 flex items-end gap-2">
            {stockData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-48">
                  <div className="flex-1 bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-500" style={{ height: `${(d.receipts / maxVal) * 100}%` }}></div>
                  <div className="flex-1 bg-blue-500/80 rounded-t transition-all hover:bg-blue-500" style={{ height: `${(d.deliveries / maxVal) * 100}%` }}></div>
                </div>
                <span className="text-gray-500 text-xs">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div><span className="text-gray-400 text-sm">Receipts</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div><span className="text-gray-400 text-sm">Deliveries</span></div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Stock by Category</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {categoryData.reduce((acc, cat, i) => {
                  const prev = acc.offset;
                  acc.elements.push(
                    <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={cat.color} strokeWidth="20" strokeDasharray={`${cat.value * 2.51} ${251 - cat.value * 2.51}`} strokeDashoffset={-prev * 2.51} />
                  );
                  acc.offset += cat.value;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center"><p className="text-2xl font-bold text-white">100%</p><p className="text-gray-500 text-xs">Total</p></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }}></div>
                <span className="text-gray-400 text-sm">{cat.name}</span>
                <span className="text-white text-sm ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Warehouse Utilization</h3>
          <div className="space-y-4">
            {warehouseUtil.map((wh, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-white">{wh.name}</span>
                  <span className={`${wh.used > 80 ? 'text-red-400' : wh.used > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{wh.used}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${wh.used > 80 ? 'bg-red-500' : wh.used > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${wh.used}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;