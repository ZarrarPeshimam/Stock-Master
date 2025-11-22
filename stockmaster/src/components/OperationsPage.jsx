import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { operationsService } from '../services/api';

const OperationsPage = ({ type }) => {
  const typeConfig = {
    receipts: { title: 'Receipts', subtitle: 'Incoming stock from suppliers', color: 'emerald', icon: '📥', service: operationsService.getReceipts },
    deliveries: { title: 'Deliveries', subtitle: 'Outgoing stock to customers', color: 'blue', icon: '📤', service: operationsService.getDeliveries },
    transfers: { title: 'Transfers', subtitle: 'Internal stock movements', color: 'purple', icon: '🔄', service: operationsService.getTransfers },
    adjustments: { title: 'Adjustments', subtitle: 'Stock corrections and counts', color: 'amber', icon: '📋', service: operationsService.getAdjustments },
  };
  const cfg = typeConfig[type];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await cfg.service({ search: searchTerm });
      setItems(data);
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { 
    true: 'bg-emerald-500/20 text-emerald-400', 
    false: 'bg-amber-500/20 text-amber-400',
    draft: 'bg-gray-500/20 text-gray-400',
    ready: 'bg-blue-500/20 text-blue-400',
    done: 'bg-emerald-500/20 text-emerald-400'
  };

  const getStatusText = (item) => {
    if (type === 'adjustments') return 'Completed';
    return item.validated ? 'Validated' : 'Draft';
  };

  const getPartnerField = (item) => {
    if (type === 'receipts') return item.supplier;
    if (type === 'deliveries') return item.customer;
    if (type === 'transfers') return `WH-${item.from_warehouse} → WH-${item.to_warehouse}`;
    return item.product_name;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">{cfg.title}</h1><p className="text-gray-400">{cfg.subtitle}</p></div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 justify-center">
          <span className="text-lg">+</span> New {cfg.title.slice(0, -1)}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total {cfg.title}</p>
          <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{items.filter(i => !i.validated).length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{items.length}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder={`Search ${type}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadItems()}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            <select className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Reference</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">{type === 'transfers' ? 'From/To' : type === 'receipts' ? 'Supplier' : 'Customer'}</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm hidden lg:table-cell">Warehouse</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading {type}...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No {type} found
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cfg.icon}</span>
                        <div><p className="text-white font-medium">{item.reference}</p><p className="text-gray-500 text-sm">{item.items?.length || 0} items</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{item.date || item.created_at?.split('T')[0]}</td>
                    <td className="py-3 px-4 text-white">{getPartnerField(item)}</td>
                    <td className="py-3 px-4 text-gray-400 hidden lg:table-cell">WH-{item.warehouse || item.from_warehouse}</td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[item.validated] || statusColors.draft}`}>{getStatusText(item)}</span></td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition mr-1">👁️</button>
                      {!item.validated && <button className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition">✓</button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">New {cfg.title.slice(0, -1)}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">{type === 'transfers' ? 'From Warehouse' : 'Warehouse'}</label><select className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white"><option>WH-001 - Main Warehouse</option><option>WH-002 - West Coast Hub</option></select></div>
                {type === 'transfers' && <div><label className="block text-sm text-gray-400 mb-1">To Warehouse</label><select className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white"><option>WH-002 - West Coast Hub</option><option>WH-003 - Central</option></select></div>}
                {type !== 'transfers' && <div><label className="block text-sm text-gray-400 mb-1">{type === 'receipts' ? 'Supplier' : 'Customer'}</label><input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white" /></div>}
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">Date</label><input type="date" className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Notes</label><textarea className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white resize-none h-20"></textarea></div>
              <div className="border border-dashed border-slate-600 rounded-xl p-4 text-center">
                <p className="text-gray-400 mb-2">Add Items</p>
                <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition text-sm">+ Add Product</button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">Cancel</button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsPage;