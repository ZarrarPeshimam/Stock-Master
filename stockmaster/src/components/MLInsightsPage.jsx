import { useState } from 'react';
import { Package, Warehouse } from 'lucide-react';

const MLInsightsPage = () => {
  const [activeTab, setActiveTab] = useState('demand');

  const demandPredictions = [
    { product: 'Widget Pro X', current: 150, predicted: 280, confidence: 92 },
    { product: 'Sensor Module A', current: 8, predicted: 45, confidence: 87 },
    { product: 'Cable Type C', current: 500, predicted: 420, confidence: 95 },
    { product: 'Battery Pack L', current: 12, predicted: 60, confidence: 78 },
  ];

  const suspiciousActivity = [
    { type: 'Unusual Volume', desc: 'WH-001: 3x normal delivery volume', risk: 'medium', time: '2 hours ago' },
    { type: 'Pattern Anomaly', desc: 'Repeated small adjustments on SKU-002', risk: 'high', time: '5 hours ago' },
    { type: 'Time Anomaly', desc: 'Stock movement at unusual hours', risk: 'low', time: '1 day ago' },
  ];

  const recommendations = [
    { action: 'Reorder', product: 'Sensor Module A', reason: 'Predicted stockout in 5 days', priority: 'high' },
    { action: 'Transfer', product: 'Widget Pro X', reason: 'Optimize distribution', priority: 'medium' },
    { action: 'Review', product: 'Battery Pack L', reason: 'Slow-moving inventory', priority: 'low' },
  ];

  const riskColors = { high: 'bg-red-500/20 text-red-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-emerald-500/20 text-emerald-400' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">ML Insights</h1><p className="text-gray-400">AI-powered inventory intelligence</p></div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['demand', 'anomaly', 'recommendations', 'nearest'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>
            {tab === 'demand' ? '📈 Demand Prediction' : tab === 'anomaly' ? '🔍 Anomaly Detection' : tab === 'recommendations' ? '💡 Recommendations' : '📍 Nearest Stock'}
          </button>
        ))}
      </div>

      {activeTab === 'demand' && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">30-Day Demand Forecast</h3>
          <div className="space-y-4">
            {demandPredictions.map((p, i) => (
              <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-purple-400" /></div>
                    <div><p className="text-white font-medium">{p.product}</p><p className="text-gray-500 text-sm">Current: {p.current} units</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-bold">{p.predicted} units</p>
                      <p className="text-gray-500 text-xs">Predicted demand</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${p.predicted > p.current ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {p.predicted > p.current ? '⚠️ Action needed' : '✓ Sufficient'}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Confidence</span><span className="text-white">{p.confidence}%</span></div>
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.confidence}%` }}></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'anomaly' && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Suspicious Activity Detection</h3>
          <div className="space-y-3">
            {suspiciousActivity.map((a, i) => (
              <div key={i} className="bg-slate-700/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskColors[a.risk]}`}>
                  {a.risk === 'high' ? '🚨' : a.risk === 'medium' ? '⚠️' : '📋'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="text-white font-medium">{a.type}</p><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${riskColors[a.risk]}`}>{a.risk}</span></div>
                  <p className="text-gray-400 text-sm">{a.desc}</p>
                </div>
                <div className="text-gray-500 text-sm">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Smart Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${r.action === 'Reorder' ? 'bg-red-500/20' : r.action === 'Transfer' ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}>
                      {r.action === 'Reorder' ? '📦' : r.action === 'Transfer' ? '🔄' : '👁️'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{r.action}: {r.product}</p>
                      <p className="text-gray-400 text-sm">{r.reason}</p>
                    </div>
                  </div>
                  <button className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition text-sm">Take Action</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nearest' && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Find Nearest Abundant Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><label className="block text-sm text-gray-400 mb-1">Product</label><select className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white"><option>Widget Pro X</option><option>Sensor Module A</option></select></div>
            <div><label className="block text-sm text-gray-400 mb-1">Quantity Needed</label><input type="number" placeholder="100" className="w-full bg-slate-700 border border-slate-600 rounded-xl py-2.5 px-4 text-white" /></div>
          </div>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Results:</p>
            {[{ wh: 'WH-003', dist: '15 km', stock: 500, eta: '2 hours' }, { wh: 'WH-001', dist: '45 km', stock: 320, eta: '4 hours' }].map((r, i) => (
              <div key={i} className="bg-slate-700/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center"><Warehouse className="w-5 h-5 text-emerald-400" /></div>
                  <div><p className="text-white font-medium">{r.wh}</p><p className="text-gray-500 text-sm">{r.dist} away • ETA: {r.eta}</p></div>
                </div>
                <div className="text-right"><p className="text-emerald-400 font-bold">{r.stock} units</p><p className="text-gray-500 text-xs">Available</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MLInsightsPage;