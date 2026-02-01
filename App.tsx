import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation } = ReactRouterDOM as any;

import { 
  LayoutDashboard, Menu, X, CloudSun, User, MessageCircle, Warehouse, 
  MapPin, Settings, Rabbit, Syringe, ScanEye, FlaskConical, BarChart3, 
  Microscope, MapPinned, MessageSquare, BookOpen, Lock
} from 'lucide-react';

// Pages Import
import Dashboard from './pages/Dashboard';
import ExpertChat from './pages/ExpertChat';
import Admin from './pages/Admin';
import WeatherHub from './pages/WeatherHub';
import FarmingCalendar from './pages/FarmingCalendar';
import SoilHealth from './pages/SoilHealth';
import MandiAnalytics from './pages/MandiAnalytics';
import DosageCalculator from './pages/DosageCalculator';
import SmartDiagnose from './pages/SmartDiagnose';
import CAStorageHub from './pages/CAStorageHub';
import DealerLocator from './pages/DealerLocator';
import LivestockAI from './pages/LivestockAI';
import SmartHarvest from './pages/SmartHarvest';
import SprayTracker from './pages/SprayTracker';
import FarmerLogin from './pages/FarmerLogin';
import CommunityForum from './pages/CommunityForum';

import RotatingLogo from './components/RotatingLogo';
import Footer from './components/Footer';
import DigitalClock from './components/DigitalClock';
import { TopTicker } from './components/NewsTicker';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default function App() {
  const [theme, setTheme] = useState('standard');
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col lg:flex-row relative bg-black text-white selection:bg-emerald-500 selection:text-black">
        
        {/* Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-slate-900 opacity-100" />
        </div>

        <TopTicker />
        
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[120] p-4 flex items-center justify-between bg-emerald-900/90 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <RotatingLogo size="sm" />
            <span className="font-bold text-white text-xs">FC Kashmir</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-white/10 rounded-lg">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <SidebarNavigation isOpen={isOpen} setIsOpen={setIsOpen} theme={theme} setTheme={setTheme} />
        
        <div className="flex-1 flex flex-col lg:ml-72 relative z-20">
          <main className="flex-1 p-4 md:p-8 lg:p-12 pb-32 pt-20 lg:pt-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/community" element={<CommunityForum />} />
                <Route path="/fck-scanner" element={<SmartDiagnose />} />
                <Route path="/livestock" element={<LivestockAI />} />
                <Route path="/harvest" element={<SmartHarvest />} />
                <Route path="/spray-track" element={<SprayTracker />} />
                <Route path="/ca-storage" element={<CAStorageHub />} />
                <Route path="/dealers" element={<DealerLocator />} />
                <Route path="/weather" element={<WeatherHub />} />
                <Route path="/calendar" element={<FarmingCalendar />} />
                <Route path="/soil" element={<SoilHealth />} />
                <Route path="/dosage" element={<DosageCalculator />} />
                <Route path="/market" element={<MandiAnalytics />} />
                <Route path="/expert" element={<ExpertChat />} />
                <Route path="/farmer-portal" element={<FarmerLogin />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}

const SidebarNavigation = ({ isOpen, setIsOpen, theme, setTheme }: any) => {
  const location = useLocation();

  const navGroups = [
    {
      title: "Main Services",
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/community', label: 'برادری (Forum)', icon: MessageSquare },
        { path: '/expert', label: 'Ask Expert AI', icon: MessageCircle },
      ]
    },
    {
      title: "Orchard Tools",
      items: [
        { path: '/fck-scanner', label: 'Scanner Pro', icon: ScanEye },
        { path: '/spray-track', label: 'Spray Auditor', icon: Syringe },
        { path: '/dealers', label: 'Dealer Locator', icon: MapPinned },
      ]
    }
  ];

  return (
    <>
      <nav className={`fixed inset-y-0 left-0 z-[110] w-72 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-emerald-950 border-r border-white/10 overflow-y-auto no-scrollbar shadow-2xl`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-8">
            <RotatingLogo />
            <div>
              <h1 className="font-bold text-lg text-white">FC Kashmir</h1>
              <p className="text-[9px] uppercase font-black text-emerald-400">Digital Valley Hub</p>
            </div>
          </div>
          
          <div className="mb-6 scale-90 origin-left"><DigitalClock /></div>

          <div className="flex-1 space-y-6">
            {navGroups.map((group, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[10px] font-black uppercase text-emerald-500/50 tracking-widest px-4">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100 hover:bg-white/5'}`}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setTheme(theme === 'standard' ? 'high-contrast' : 'standard')} className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[10px] uppercase font-black text-emerald-400 border border-white/10">
            <Settings size={14} /> Theme: {theme}
          </button>
        </div>
      </nav>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[105] lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};