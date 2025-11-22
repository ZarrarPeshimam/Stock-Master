import { useState, useEffect } from 'react';
import { Package, Warehouse, TrendingUp, Truck, ArrowLeftRight, ClipboardList, AlertCircle } from 'lucide-react';
import { dashboardService, productService } from '../services/api';

const DashboardPage = () => {
  const [kpis, setKpis] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [kpisData, lowStockData] = await Promise.all([
        dashboardService.getKPIs(),
        productService.getLowStockProducts()
      ]);
      setKpis(kpisData);
      setLowStockProducts(Array.isArray(lowStockData) ? lowStockData : []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setKpis(null);
      setLowStockProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Products in Stock', value: kpis?.total_products_in_stock || 0, icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Stock Value', value: '$0', icon: TrendingUp, color: 'from-blue-500 to-blue-600' }, // Placeholder
    { label: 'Warehouses', value: kpis?.total_warehouses || 0, icon: Warehouse, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Low Stock Items', value: kpis?.low_stock_items || 0, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Dashboard</h1><p className="text-gray-400">Welcome back! Here's your inventory overview.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
          <div key={i} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-gray-400 text-sm">{k.label}</p><p className="text-2xl font-bold text-white mt-1">{k.value}</p></div>
              <div className={`w-12 h-12 bg-gradient-to-r ${k.color} rounded-xl flex items-center justify-center`}><k.icon className="w-6 h-6 text-white" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pending Operations</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1"><p className="text-white text-sm">Pending Receipts: {kpis?.pending_receipts || 0}</p></div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1"><p className="text-white text-sm">Pending Deliveries: {kpis?.pending_deliveries || 0}</p></div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="flex-1"><p className="text-white text-sm">Scheduled Transfers: {kpis?.internal_transfers_scheduled || 0}</p></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 4).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-amber-400" /></div>
                  <div><p className="text-white text-sm font-medium">{product.name}</p><p className="text-gray-500 text-xs">SKU: {product.sku}</p></div>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-gray-400 text-sm">No low stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;