import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function Dashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    console.log('Dashboard loaded successfully');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-2">🌾 Farmer's Corner Kashmir</h1>
          <p className="text-xl text-emerald-400">کسانوں کے لیے ڈیجیٹل حل</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold mb-2">My Portal</h3>
            <p className="text-blue-100">میرا پورٹل - Your farming dashboard</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🌤️</div>
            <h3 className="text-2xl font-bold mb-2">Weather</h3>
            <p className="text-cyan-100">موسم - Real-time weather updates</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-2">Market Rates</h3>
            <p className="text-amber-100">منڈی ریٹ - Live market prices</p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Scanner</h3>
            <p className="text-rose-100">اسکینر - Crop disease detection</p>
          </div>

          {/* Card 5 */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-2">AI Expert</h3>
            <p className="text-purple-100">ماہر - Talk to farming expert</p>
          </div>

          {/* Card 6 */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold mb-2">Soil Test</h3>
            <p className="text-green-100">مٹی کا ٹیسٹ - Soil analysis</p>
          </div>
        </div>

        {/* Market Rates Section */}
        <div className="mb-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-3xl font-black mb-6 text-amber-400">📈 منڈی ریٹس (Market Rates)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Apple (Delicious)', market: 'Kulgam', price: '₹800-1100', trend: '📈' },
              { name: 'Apple (Kullu)', market: 'Sopore', price: '₹900-1250', trend: '📈' },
              { name: 'Apple (American)', market: 'Srinagar', price: '₹600-850', trend: '📉' },
              { name: 'Walnut', market: 'Anantnag', price: '₹400-600', trend: '➡️' },
              { name: 'Saffron', market: 'Pulwama', price: '₹8000-12000', trend: '📈' },
              { name: 'Cherry', market: 'Shopian', price: '₹150-250', trend: '📈' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-amber-500 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-sm text-slate-400">{item.market}</p>
                  </div>
                  <span className="text-2xl">{item.trend}</span>
                </div>
                <p className="text-lg font-black text-amber-400">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-3xl font-black mb-6">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="font-bold mb-1">Real-time Weather</h4>
                <p className="text-slate-400">Live weather updates for your region</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="font-bold mb-1">Market Intelligence</h4>
                <p className="text-slate-400">Track crop prices across markets</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="font-bold mb-1">Disease Detection</h4>
                <p className="text-slate-400">AI-powered crop disease scanning</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <h4 className="font-bold mb-1">Expert Advice</h4>
                <p className="text-slate-400">Connect with farming experts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-slate-700 pt-8">
          <p className="text-slate-400 mb-4">🌍 Serving farmers across Jammu & Kashmir</p>
          <p className="flex items-center justify-center gap-2 text-slate-500">
            Made with <Heart size={20} className="text-red-500" /> for Kashmir's farmers
          </p>
        </div>
      </div>
    </div>
  );
}