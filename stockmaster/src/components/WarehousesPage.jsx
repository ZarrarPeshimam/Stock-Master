import { useState } from 'react';
import { Warehouse } from 'lucide-react';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([
    { id: 1, name: 'Main Warehouse', code: 'WH-001', city: 'New York', state: 'NY', capacity: 10000, used: 6500, is_active: true },
    { id: 2, name: 'West Coast Hub', code: 'WH-002', city: 'Los Angeles', state: 'CA', capacity: 8000, used: 4200, is_active: true },
    { id: 3, name: 'Central Distribution', code: 'WH-003', city: 'Chicago', state: 'IL', capacity: 12000, used: 9800, is_active: true },
    { id: 4, name: 'Southern Facility', code: 'WH-004', city: 'Houston', state: 'TX', capacity: 6000, used: 2100, is_active: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editWh, setEditWh] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', city: '', state: '', country: 'USA', pincode: '', capacity_value: '', capacity_unit: 'sqft' });

  const openAdd = () => { setEditWh(null); setFormData({ name: '', code: '', address: '', city: '', state: '', country: 'USA', pincode: '', capacity_value: '', capacity_unit: 'sqft' }); setShowModal(true); };
  const openEdit = (w) => { setEditWh(w); setFormData({ name: w.name, code: w.code, address: w.address || '', city: w.city, state: w.state, country: 'USA', pincode: '', capacity_value: w.capacity, capacity_unit: 'sqft' }); setShowModal(true); };
  
  const handleSave = () => {
    if (editWh) {
      setWarehouses(warehouses.map(w => w.id === editWh.id ? { ...w, ...formData, capacity: parseInt(formData.capacity_value) || w.capacity } : w));
    } else {
      setWarehouses([...warehouses, { id: Date.now(), ...formData, capacity: parseInt(formData.capacity_value) || 0, used: 0, is_active: true }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Warehouses</h1><p className="text-gray-400">Manage your warehouse locations</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 justify-center">
          <span className="text-lg">+</span> Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {warehouses.map(w => (
          <div key={w.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-5 hover:border-purple-500/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${w.is_active ? 'bg-emerald-500/20' : 'bg-gray-500/20'}`}>
                  <Warehouse className={`w-6 h-6 ${w.is_active ? 'text-emerald-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{w.name}</h3>
                  <p className="text-gray-500 text-sm">{w.code}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${w.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {w.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>📍</span> {w.city}, {w.state}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Capacity Usage</span>
                  <span className="text-white">{Math.round((w.used / w.capacity) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${(w.used / w.capacity) > 0.8 ? 'bg-red-500' : (w.used / w.capacity) > 0.6 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(w.used / w.capacity) * 100}%` }}></div>
                </div>
                <p className="text-gray-500 text-xs mt-1">{w.used.toLocaleString()} / {w.capacity.toLocaleString()} sqft</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button onClick={() => openEdit(w)} className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition text-sm">Edit</button>
              <button className="flex-1 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm">View Stock</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editWh ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Code</label><input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Capacity</label><input type="number" value={formData.capacity_value} onChange={(e) => setFormData({...formData, capacity_value: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Unit</label><select value={formData.capacity_unit} onChange={(e) => setFormData({...formData, capacity_unit: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="sqft">Sq. Feet</option><option value="sqm">Sq. Meters</option></select></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousesPage;