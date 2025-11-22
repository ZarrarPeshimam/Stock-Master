import { useState, useEffect } from 'react';
import { Warehouse } from 'lucide-react';
import { warehouseService } from '../services/api';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editWh, setEditWh] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', city: '', state: '', country: 'USA', pincode: '', capacity_value: '', capacity_unit: 'sqft' });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const data = await warehouseService.getWarehouses();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { 
    setEditWh(null); 
    setFormData({ name: '', code: '', address: '', city: '', state: '', country: 'USA', pincode: '', capacity_value: '', capacity_unit: 'sqft' }); 
    setShowModal(true); 
  };
  
  const openEdit = (w) => { 
    setEditWh(w); 
    setFormData({ 
      name: w.name, 
      code: w.code, 
      address: w.address || '', 
      city: w.city, 
      state: w.state, 
      country: w.country || 'USA', 
      pincode: w.pincode || '', 
      capacity_value: w.capacity_value || '', 
      capacity_unit: w.capacity_unit || 'sqft' 
    }); 
    setShowModal(true); 
  };
  
  const handleSave = async () => {
    try {
      if (editWh) {
        await warehouseService.updateWarehouse(editWh.id, formData);
      } else {
        await warehouseService.createWarehouse(formData);
      }
      setShowModal(false);
      loadWarehouses(); // Reload data
    } catch (error) {
      console.error('Failed to save warehouse:', error);
      // TODO: Show error message
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await warehouseService.deleteWarehouse(id);
        loadWarehouses(); // Reload data
      } catch (error) {
        console.error('Failed to delete warehouse:', error);
        // TODO: Show error message
      }
    }
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
                <p className="text-gray-400 text-sm">Capacity: {w.capacity_value} {w.capacity_unit}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button onClick={() => openEdit(w)} className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition text-sm">Edit</button>
              <button onClick={() => handleDelete(w.id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm">Delete</button>
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