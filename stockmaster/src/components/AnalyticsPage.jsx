import { useState, useEffect } from 'react';
import { operationsService, productService, warehouseService } from '../services/api';

const AnalyticsPage = () => {
  const [stockData, setStockData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [warehouseUtil, setWarehouseUtil] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [receipts, deliveries, products, warehouses] = await Promise.all([
        operationsService.getReceipts({ limit: 100 }),
        operationsService.getDeliveries({ limit: 100 }),
        productService.getProducts(),
        warehouseService.getWarehouses()
      ]);

      // Process stock movement trends
      const monthlyData = processMonthlyTrends(receipts, deliveries);
      setStockData(monthlyData);

      // Process category data
      const categoryStats = processCategoryData(products);
      setCategoryData(categoryStats);

      // Process warehouse utilization
      const utilizationData = processWarehouseUtilization(warehouses);
      setWarehouseUtil(utilizationData);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyTrends = (receipts, deliveries) => {
    const monthlyMap = {};

    // Process receipts
    receipts.forEach(r => {
      const month = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyMap[month]) monthlyMap[month] = { month, receipts: 0, deliveries: 0 };
      monthlyMap[month].receipts += r.quantity || 0;
    });

    // Process deliveries
    deliveries.forEach(d => {
      const month = new Date(d.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyMap[month]) monthlyMap[month] = { month, receipts: 0, deliveries: 0 };
      monthlyMap[month].deliveries += d.quantity || 0;
    });

    // Convert to array and sort by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => monthlyMap[month] || { month, receipts: 0, deliveries: 0 });
  };

  const processCategoryData = (products) => {
    const categoryMap = {};
    let total = 0;

    products.forEach(p => {
      const category = p.category_name || 'Other';
      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += 1; // Count products per category
      total += 1;
    });

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    return Object.entries(categoryMap).map(([name, count], i) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[i % colors.length]
    }));
  };

  const processWarehouseUtilization = (warehouses) => {
    return warehouses.map(wh => ({
      name: wh.name,
      used: Math.floor(Math.random() * 40) + 30 // Mock utilization since backend doesn't have used capacity
    }));
  };

  const maxVal = stockData.length > 0 ? Math.max(...stockData.map(d => Math.max(d.receipts, d.deliveries))) : 1;

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

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading analytics data...</div>
      ) : (
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
      )}
    </div>
  );
};

export default AnalyticsPage;