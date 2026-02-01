import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation } = ReactRouterDOM as any;

import { 
  LayoutDashboard, Menu, X, CloudSun, Store, MessageCircle, Zap, BookOpen, 
  Warehouse, MapPin, Sun, Moon, Key, ChevronRight, Rabbit, TrendingUp, 
  Syringe, ScanEye, Settings, Award, FlaskConical, BarChart3, Microscope, 
  ShieldCheck, Clock, Users, User, Phone, MessageSquare, Plus, Edit, Trash2, Calendar
} from 'lucide-react';

// Pages Import
import Dashboard from './pages/Dashboard';
import ExpertChat from './pages/ExpertChat';
import KnowledgeHub from './pages/KnowledgeHub';
import Admin from './pages/Admin';
import WeatherHub from './pages/WeatherHub';
import FarmingCalendar from './pages/FarmingCalendar';
import SoilHealth from './pages/SoilHealth';
import ProfitCalculator from './pages/ProfitCalculator';
import SubsidyTracker from './pages/SubsidyTracker';
import MandiAnalytics from './pages/MandiAnalytics';
import DosageCalculator from './pages/DosageCalculator';
import SmartDiagnose from './pages/SmartDiagnose';
import CAStorageHub from './pages/CAStorageHub';
import DealerLocator from './pages/DealerLocator';
import GradingGuide from './pages/GradingGuide';
import MarketPrices from './pages/MarketPrices';
import DiseaseDetection from './pages/DiseaseDetection';
import LivestockAI from './pages/LivestockAI';
import SmartHarvest from './pages/SmartHarvest';
import SprayTracker from './pages/SprayTracker';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import FarmerLogin from './pages/FarmerLogin';
import CommunityForum from './pages/CommunityForum'; // Yaqeen karein ke ye line mojood hai// Routes section mein isay update karein
<Route path="/community" element={<CommunityForum />} /> // Path ko '/community' hi rakhein kyunke dashboard yahi mang raha hai// Components
import RotatingLogo from './components/RotatingLogo';
import Footer from './components/Footer';
import DigitalClock from './components/DigitalClock';
import { TopTicker } from './components/NewsTicker';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

type ThemeMode = 'standard' | 'green' | 'high-contrast';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>((localStorage.getItem('fck_theme') as ThemeMode) || 'standard');

  useEffect(() => {
    localStorage.setItem('fck_theme', theme);
  }, [theme]);

  const isHighContrast = theme === 'high-contrast';
  const isGreenTheme = theme === 'green';

  return (
    <HashRouter>
      <ScrollToTop />
      <div className={`min-h-screen flex flex-col lg:flex-row relative transition-colors duration-500 ${isHighContrast ? 'bg-black text-yellow-400' : isGreenTheme ? 'bg-emerald-950' : 'bg-slate-100'}`}>
        
        {/* Fixed Background Layer (No more External Image Errors) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 transition-all duration-1000 ${
            isHighContrast 
            ? 'bg-black' 
            : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 opacity-100'
          }`} />
        </div>

        <TopTicker />
        <SidebarNavigation theme={theme} setTheme={setTheme} />
        
        <div className="flex-1 flex flex-col lg:ml-72 relative z-20">
          <main className={`flex-1 p-4 lg:p-12 pb-48 pt-16 lg:pt-20 backdrop-blur-[2px] transition-all duration-1000 ${
            isHighContrast ? 'bg-black' : 'bg-white/10'
          }`}>
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/farmer-portal" element={<FarmerLogin />} />
                <Route path="/fck-scanner" element={<SmartDiagnose />} />
                <Route path="/livestock" element={<LivestockAI />} />
                <Route path="/harvest" element={<SmartHarvest />} />
                <Route path="/spray-track" element={<SprayTracker />} />
                <Route path="/ca-storage" element={<CAStorageHub />} />
                <Route path="/dealers" element={<DealerLocator />} />
                <Route path="/grading" element={<GradingGuide />} />
                <Route path="/weather" element={<WeatherHub />} />
                <Route path="/calendar" element={<FarmingCalendar />} />
                <Route path="/soil" element={<SoilHealth />} />
                <Route path="/dosage" element={<DosageCalculator />} />
                <Route path="/mandi-stats" element={<MandiAnalytics />} />
                <Route path="/profit-calc" element={<ProfitCalculator />} />
                <Route path="/subsidies" element={<SubsidyTracker />} />
                <Route path="/market" element={<MarketPrices />} />
                <Route path="/expert" element={<ExpertChat />} />
                <Route path="/knowledge" element={<KnowledgeHub />} />
                <Route path="/forum" element={<CommunityForum />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}

const SidebarNavigation = ({ theme, setTheme }: { theme: ThemeMode, setTheme: (t: ThemeMode) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHighContrast = theme === 'high-contrast';
  const isGreenTheme = theme === 'green';

  const navGroups = [
    {
      title: "Core Services",
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/farmer-portal', label: 'Farmer Portal', icon: User },
        { path: '/expert', label: 'Ask Expert AI', icon: MessageCircle },
        { path: '/weather', label: 'Weather Hub', icon: CloudSun },
      ]
    },
    {
      title: "Orchard Tools",
      items: [
        { path: '/fck-scanner', label: 'FC Scanner Pro', icon: ScanEye }, // Branding Update
        { path: '/spray-track', label: 'Spray Auditor', icon: Syringe },
        { path: '/soil', label: 'Soil Health', icon: Microscope },
        { path: '/dosage', label: 'Dosage Calc', icon: FlaskConical },
      ]
    },
    {
        title: "Animal Care",
        items: [
          { path: '/livestock', label: 'Livestock AI', icon: Rabbit },
        ]
    }
  ];

  return (
    <>
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-[120] p-4 flex items-center justify-between ${isHighContrast ? 'bg-black border-b border-yellow-400 text-yellow-400' : 'bg-emerald-900 text-white'}`}>
        <div className="flex items-center gap-3"><RotatingLogo size="sm" /><span className="font-bold text-xs text-white">FC Kashmir</span></div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2"><Menu className="w-6 h-6" /></button>
      </div>

      <nav className={`fixed inset-y-0 left-0 z-[110] w-72 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isHighContrast ? 'bg-black border-r border-yellow-400' : 'bg-emerald-950 text-white'} border-r overflow-y-auto no-scrollbar shadow-2xl`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-8"><RotatingLogo /><div><h1 className={`font-heading font-bold text-lg ${isHighContrast ? 'text-yellow-400' : 'text-white'}`}>FC Kashmir</h1><p className="text-[9px] uppercase font-black text-emerald-400">Digital Valley Hub</p></div></div>
          
          <div className="mb-8"><DigitalClock /></div>

          <div className="flex-1 space-y-8">
            {navGroups.map((group, i) => (
              <div key={i} className="space-y-2 text-left">
                <p className="text-[10px] font-black uppercase text-emerald-500/50 tracking-widest px-4">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100 hover:bg-white/10'}`}>
                        <Icon className="w-4.5 h-4.5" /><span className="font-semibold text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <button onClick={() => setTheme(theme === 'standard' ? 'green' : theme === 'green' ? 'high-contrast' : 'standard')} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-white/5 text-emerald-300 border border-white/10">
              <Settings className="w-4 h-4" /> Cycle Theme
            </button>
          </div>
        </div>
      </nav>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[105] lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};