import { Package, Warehouse, Home, Truck, ArrowLeftRight, ClipboardList, BarChart3, Brain } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPage, onNavigate }) => {
  const items = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'warehouses', icon: Warehouse, label: 'Warehouses' },
    { id: 'receipts', icon: Truck, label: 'Receipts' },
    { id: 'deliveries', icon: Truck, label: 'Deliveries' },
    { id: 'transfers', icon: ArrowLeftRight, label: 'Transfers' },
    { id: 'adjustments', icon: ClipboardList, label: 'Adjustments' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'ml', icon: Brain, label: 'ML Insights' },
  ];
  
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose}></div>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold text-white">StockMaster</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {items.map(i => (
            <button key={i.id} onClick={() => { onNavigate(i.id); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${currentPage === i.id ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
              <i.icon className="w-5 h-5" /><span className="font-medium">{i.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;