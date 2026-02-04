import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation, Navigate } = ReactRouterDOM as any;

import { 
  LayoutDashboard, Menu, X, CloudSun, MessageCircle, User, 
  ScanEye, Syringe, Microscope, FlaskConical, Rabbit, Settings, MapPin, 
  BookOpen, Warehouse, Sun, Moon, BarChart3, ShieldCheck, Calendar,
  TrendingUp, Calculator, Landmark, GraduationCap, MapPinned, FileText, Users,
  Wallet, Activity, HeartPulse, Sprout, Briefcase
} from 'lucide-react';

// Pages Import
import Dashboard from './pages/Dashboard';
import ExpertChat from './pages/ExpertChat';
import KnowledgeHub from './pages/KnowledgeHub';
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
import MarketPrices from './pages/MarketPrices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import FarmerPortal from './pages/FarmerPortal';
import CommunityForum from './pages/CommunityForum';
import LivestockAI from './pages/LivestockAI';
import SprayTracker from './pages/SprayTracker';
import Admin from './pages/Admin';
import FarmManager from './pages/FarmManager';

import Footer from './components/Footer';

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row font-sans">
      {/* 🌈 COLORFUL SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#05080a] border-r border-white/5 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto no-scrollbar shadow-2xl`}>
        <div className="p-6 flex flex-col min-h-full">
          <div className="flex items-center gap-4 mb-10 shrink-0">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">FC</div>
            <h1 className="font-black text-xl tracking-tighter uppercase text-white">FC KASHMIR</h1>
          </div>

          <nav className="flex-1 space-y-8 pb-10">
            {/* MAIN HUB - Emerald/Amber */}
            <NavGroup title="Main Hub | مین">
              <NavLink to="/" icon={LayoutDashboard} label="Home | ہوم" colorClass="text-emerald-400" active={location.pathname === '/'} onClick={() => setIsOpen(false)} />
              <NavLink to="/my-portal" icon={User} label="Farmer Portal | پورٹل" colorClass="text-amber-400" active={location.pathname === '/my-portal'} onClick={() => setIsOpen(false)} />
              <NavLink to="/farm-manager" icon={Wallet} label="Farm Manager | منیجر" colorClass="text-lime-400" active={location.pathname === '/farm-manager'} onClick={() => setIsOpen(false)} />
              <NavLink to="/expert" icon={MessageCircle} label="Ask Expert AI | ماہر" colorClass="text-purple-400" active={location.pathname === '/expert'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* REAL TIME - Sky/Orange */}
            <NavGroup title="Real-time | تازہ ترین">
              <NavLink to="/weather" icon={CloudSun} label="Weather | موسم" colorClass="text-sky-400" active={location.pathname === '/weather'} onClick={() => setIsOpen(false)} />
              <NavLink to="/market" icon={BarChart3} label="Mandi | منڈی" colorClass="text-orange-400" active={location.pathname === '/market'} onClick={() => setIsOpen(false)} />
              <NavLink to="/mandi-stats" icon={TrendingUp} label="Price Stats | تجزیہ" colorClass="text-cyan-400" active={location.pathname === '/mandi-stats'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* ORCHARD TOOLS - Rose/Red */}
            <NavGroup title="Orchard Tools | باغات">
              <NavLink to="/fck-scanner" icon={ScanEye} label="AI Scanner | اسکینر" colorClass="text-rose-400" active={location.pathname === '/fck-scanner'} onClick={() => setIsOpen(false)} />
              <NavLink to="/spray-track" icon={Syringe} label="Spray Audit | اسپرے" colorClass="text-red-400" active={location.pathname === '/spray-track'} onClick={() => setIsOpen(false)} />
              <NavLink to="/soil" icon={Microscope} label="Soil Health | مٹی" colorClass="text-teal-400" active={location.pathname === '/soil'} onClick={() => setIsOpen(false)} />
              <NavLink to="/calendar" icon={Calendar} label="Crop Calendar | کیلنڈر" colorClass="text-yellow-400" active={location.pathname === '/calendar'} onClick={() => setIsOpen(false)} />
              <NavLink to="/dosage" icon={Calculator} label="Dosage Calc | خوراک" colorClass="text-orange-500" active={location.pathname === '/dosage'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* RESOURCES - Indigo/Pink */}
            <NavGroup title="Resources | وسائل">
              <NavLink to="/profit-calc" icon={TrendingUp} label="Profit Calc | منافع" colorClass="text-emerald-500" active={location.pathname === '/profit-calc'} onClick={() => setIsOpen(false)} />
              <NavLink to="/subsidies" icon={Landmark} label="Subsidies | سبسڈی" colorClass="text-indigo-400" active={location.pathname === '/subsidies'} onClick={() => setIsOpen(false)} />
              <NavLink to="/ca-storage" icon={Warehouse} label="CA Storage | اسٹوریج" colorClass="text-blue-400" active={location.pathname === '/ca-storage'} onClick={() => setIsOpen(false)} />
              <NavLink to="/dealers" icon={MapPinned} label="Dealers | ڈیلرز" colorClass="text-violet-400" active={location.pathname === '/dealers'} onClick={() => setIsOpen(false)} />
              <NavLink to="/livestock" icon={Rabbit} label="Livestock AI | مویشی" colorClass="text-pink-400" active={location.pathname === '/livestock'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* COMMUNITY - Gray/White */}
            <NavGroup title="Community & Admin">
              <NavLink to="/forum" icon={Users} label="Forum | فورم" colorClass="text-slate-300" active={location.pathname === '/forum'} onClick={() => setIsOpen(false)} />
              <NavLink to="/knowledge" icon={GraduationCap} label="Knowledge | علم" colorClass="text-zinc-400" active={location.pathname === '/knowledge'} onClick={() => setIsOpen(false)} />
              <NavLink to="/admin" icon={Settings} label="Admin | ایڈمن" colorClass="text-gray-500" active={location.pathname === '/admin'} onClick={() => setIsOpen(false)} />
            </NavGroup>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen bg-[#020408]">
        <header className="lg:hidden p-4 bg-emerald-950 flex justify-between items-center sticky top-0 z-40 shadow-xl">
          <span className="font-black tracking-tighter">FC KASHMIR</span>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2"><Menu /></button>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-portal" element={<FarmerPortal />} />
            <Route path="/farm-manager" element={<FarmManager />} />
            <Route path="/weather" element={<WeatherHub />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/fck-scanner" element={<SmartDiagnose />} />
            <Route path="/expert" element={<ExpertChat />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/spray-track" element={<SprayTracker />} />
            <Route path="/dealers" element={<DealerLocator />} />
            <Route path="/calendar" element={<FarmingCalendar />} />
            <Route path="/soil" element={<SoilHealth />} />
            <Route path="/dosage" element={<DosageCalculator />} />
            <Route path="/mandi-stats" element={<MandiAnalytics />} />
            <Route path="/profit-calc" element={<ProfitCalculator />} />
            <Route path="/subsidies" element={<SubsidyTracker />} />
            <Route path="/forum" element={<CommunityForum />} />
            <Route path="/ca-storage" element={<CAStorageHub />} />
            <Route path="/livestock" element={<LivestockAI />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </main>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

// 🎨 TILE-STYLE NAVLINK COMPONENT
function NavLink({ to, icon: Icon, label, active, onClick, colorClass }: any) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`
        flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 mb-1
        ${active 
          ? `bg-white/5 ${colorClass} border-l-4 border-current shadow-[0_0_20px_rgba(255,255,255,0.02)]` 
          : `hover:bg-white/5 text-white/40 hover:text-white`
        }
      `}
    >
      <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-current/10' : 'bg-white/5'}`}>
        <Icon size={18} />
      </div>
      <span className="text-[11px] font-black uppercase tracking-wider font-urdu leading-none">
        {label}
      </span>
    </Link>
  );
}

function NavGroup({ title, children }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-white/20 px-4 tracking-[0.2em] font-urdu mb-2">{title}</p>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}