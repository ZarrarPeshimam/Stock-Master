import { useState } from 'react';
import { Package, Search } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Widget Pro X', sku: 'WDG-001', category: 'electronics', type: 'finished_good', weight: 0.5, stock: 150, min_stock: 20 },
    { id: 2, name: 'Sensor Module A', sku: 'SNS-002', category: 'electronics', type: 'component', weight: 0.1, stock: 8, min_stock: 15 },
    { id: 3, name: 'Cable Type C', sku: 'CBL-003', category: 'accessories', type: 'component', weight: 0.05, stock: 500, min_stock: 100 },
    { id: 4, name: 'Battery Pack L', sku: 'BAT-004', category: 'electronics', type: 'component', weight: 0.3, stock: 12, min_stock: 25 },
    { id: 5, name: 'Display Panel 15"', sku: 'DSP-005', category: 'electronics', type: 'component', weight: 1.2, stock: 45, min_stock: 10 },
  ]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', category: 'electronics', type: 'finished_good', weight: '', min_stock: '', max_stock: '' });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditProduct(null); setFormData({ name: '', sku: '', category: 'electronics', type: 'finished_good', weight: '', min_stock: '', max_stock: '' }); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setFormData({ name: p.name, sku: p.sku, category: p.category, type: p.type, weight: p.weight, min_stock: p.min_stock, max_stock: p.max_stock || '' }); setShowModal(true); };
  
  const handleSave = () => {
    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...formData } : p));
    } else {
      setProducts([...products, { id: Date.now(), ...formData, stock: 0 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Products</h1><p className="text-gray-400">Manage your product inventory</p></div>
        <button onClick={openAdd} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 justify-center">
          <span className="text-lg">+</span> Add Product
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <select className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Product</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm hidden md:table-cell">SKU</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm hidden lg:table-cell">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Stock</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-purple-400" /></div>
                      <div><p className="text-white font-medium">{p.name}</p><p className="text-gray-500 text-sm md:hidden">{p.sku}</p></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{p.sku}</td>
                  <td className="py-3 px-4 hidden lg:table-cell"><span className="px-2 py-1 bg-slate-700 text-gray-300 rounded-lg text-sm capitalize">{p.category}</span></td>
                  <td className="py-3 px-4 text-white font-medium">{p.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock <= p.min_stock ? 'bg-red-500/20 text-red-400' : p.stock <= p.min_stock * 1.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {p.stock <= p.min_stock ? 'Low' : p.stock <= p.min_stock * 1.5 ? 'Medium' : 'Good'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition mr-1">✏️</button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Product Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">SKU</label><input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="electronics">Electronics</option><option value="accessories">Accessories</option><option value="clothing">Clothing</option><option value="food">Food</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-1">Type</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="finished_good">Finished Good</option><option value="component">Component</option><option value="raw_material">Raw Material</option></select></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Weight (kg)</label><input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Min Stock</label><input type="number" value={formData.min_stock} onChange={(e) => setFormData({...formData, min_stock: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Max Stock</label><input type="number" value={formData.max_stock} onChange={(e) => setFormData({...formData, max_stock: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
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

export default ProductsPage;