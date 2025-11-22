import { useState } from 'react';
import { Search } from 'lucide-react';

const OperationsPage = ({ type }) => {
  const typeConfig = {
    receipts: { title: 'Receipts', subtitle: 'Incoming stock from suppliers', color: 'emerald', icon: '📥' },
    deliveries: { title: 'Deliveries', subtitle: 'Outgoing stock to customers', color: 'blue', icon: '📤' },
    transfers: { title: 'Transfers', subtitle: 'Internal stock movements', color: 'purple', icon: '🔄' },
    adjustments: { title: 'Adjustments', subtitle: 'Stock corrections and counts', color: 'amber', icon: '📋' },
  };
  const cfg = typeConfig[type];

  const [items] = useState([
    { id: 1, ref: `${type.toUpperCase().slice(0,3)}-001`, date: '2024-01-15', partner: 'Acme Corp', warehouse: 'WH-001', status: 'completed', items_count: 5, total: 2500 },
    { id: 2, ref: `${type.toUpperCase().slice(0,3)}-002`, date: '2024-01-14', partner: 'Tech Solutions', warehouse: 'WH-002', status: 'pending', items_count: 3, total: 1800 },
    { id: 3, ref: `${type.toUpperCase().slice(0,3)}-003`, date: '2024-01-13', partner: 'Global Trade', warehouse: 'WH-001', status: 'completed', items_count: 8, total: 4200 },
    { id: 4, ref: `${type.toUpperCase().slice(0,3)}-004`, date: '2024-01-12', partner: 'Fast Logistics', warehouse: 'WH-003', status: 'draft', items_count: 2, total: 950 },
  ]);
  const [showModal, setShowModal] = useState(false);

  const statusColors = { completed: 'bg-emerald-500/20 text-emerald-400', pending: 'bg-amber-500/20 text-amber-400', draft: 'bg-gray-500/20 text-gray-400' };

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
          <p className="text-2xl font-bold text-amber-400 mt-1">{items.filter(i => i.status === 'pending').length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
          <p className="text-gray-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">${items.reduce((a, b) => a + b.total, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" placeholder={`Search ${type}...`} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
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
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cfg.icon}</span>
                      <div><p className="text-white font-medium">{item.ref}</p><p className="text-gray-500 text-sm">{item.items_count} items</p></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{item.date}</td>
                  <td className="py-3 px-4 text-white">{item.partner}</td>
                  <td className="py-3 px-4 text-gray-400 hidden lg:table-cell">{item.warehouse}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[item.status]}`}>{item.status}</span></td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition mr-1">👁️</button>
                    {item.status !== 'completed' && <button className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition">✓</button>}
                  </td>
                </tr>
              ))}
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