import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation, Navigate } = ReactRouterDOM as any;

import { 
  LayoutDashboard, Menu, CloudSun, MessageCircle, User, 
  ScanEye, Syringe, Calendar, BarChart3, Settings, 
  Users, Wallet, Sprout, BookOpen, MapPinned, ChevronRight,
  Youtube // ✅ Youtube Icon Added
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import FarmerPortal from './pages/FarmerPortal';
import CommunityForum from './pages/CommunityForum';
import LivestockAI from './pages/LivestockAI';
import SprayTracker from './pages/SprayTracker';
import FarmManager from './pages/FarmManager';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import FarmerLogin from './pages/FarmerLogin';
import Footer from './components/Footer';
import SocialMedia from './pages/SocialMedia'; // ✅ Social Page Added

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col lg:flex-row font-sans">
      
      {/* 🌍 BILINGUAL SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#050608] border-r border-white/5 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto no-scrollbar shadow-2xl`}>
        <div className="p-5 flex flex-col min-h-full">
          
          {/* Brand Header */}
          <div className="flex items-center gap-4 mb-8 shrink-0 bg-[#0a0c10] p-4 rounded-3xl border border-white/5 shadow-inner">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-700 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-emerald-500/20 border-t border-white/20">FC</div>
            <div>
               <h1 className="font-black text-xl tracking-tighter uppercase text-white leading-none">FC KASHMIR</h1>
               <p className="text-[12px] text-emerald-500 font-bold font-urdu mt-1">کشمیر کسان پورٹل</p>
            </div>
          </div>

          <nav className="flex-1 space-y-8 pb-10">
            <NavGroup title="Main Hub | مرکزی ہب">
              <NavLink to="/" icon={LayoutDashboard} en="Home" ur="ہوم" gradient="from-emerald-500 to-teal-700" shadow="shadow-emerald-500/30" active={location.pathname === '/'} onClick={() => setIsOpen(false)} />
              <NavLink to="/my-portal" icon={User} en="My Portal" ur="میرا پورٹل" gradient="from-blue-500 to-indigo-700" shadow="shadow-blue-500/30" active={location.pathname === '/my-portal'} onClick={() => setIsOpen(false)} />
              <NavLink to="/farm-manager" icon={Wallet} en="Manager" ur="فارم منیجر" gradient="from-amber-500 to-orange-700" shadow="shadow-amber-500/30" active={location.pathname === '/farm-manager'} onClick={() => setIsOpen(false)} />
              <NavLink to="/expert" icon={MessageCircle} en="AI Expert" ur="ماہر اے آئی" gradient="from-violet-500 to-purple-700" shadow="shadow-purple-500/30" active={location.pathname === '/expert'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            <NavGroup title="Real-time | تازہ ترین">
              <NavLink to="/weather" icon={CloudSun} en="Weather" ur="موسم" gradient="from-sky-400 to-blue-600" shadow="shadow-sky-500/30" active={location.pathname === '/weather'} onClick={() => setIsOpen(false)} />
              <NavLink to="/mandi" icon={BarChart3} en="Rates" ur="منڈی ریٹ" gradient="from-orange-400 to-red-600" shadow="shadow-orange-500/30" active={location.pathname === '/mandi'} onClick={() => setIsOpen(false)} />
              <NavLink to="/dealers" icon={MapPinned} en="Dealers" ur="ڈیلر" gradient="from-red-500 to-rose-700" shadow="shadow-red-500/30" active={location.pathname === '/dealers'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            <NavGroup title="Tools | اوزار">
              <NavLink to="/fck-scanner" icon={ScanEye} en="Scanner" ur="اسکینر" gradient="from-rose-500 to-pink-700" shadow="shadow-rose-500/30" active={location.pathname === '/fck-scanner'} onClick={() => setIsOpen(false)} />
              <NavLink to="/spray-tracker" icon={Syringe} en="Spray Log" ur="اسپرے لاگ" gradient="from-lime-500 to-green-700" shadow="shadow-lime-500/30" active={location.pathname === '/spray-tracker'} onClick={() => setIsOpen(false)} />
              <NavLink to="/calendar" icon={Calendar} en="Calendar" ur="کیلنڈر" gradient="from-yellow-400 to-amber-600" shadow="shadow-yellow-500/30" active={location.pathname === '/calendar'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            <NavGroup title="Community | کمیونٹی">
              {/* ✅ Social Media Link Added Below */}
              <NavLink to="/social" icon={Youtube} en="Social Hub" ur="سوشل میڈیا" gradient="from-red-600 to-rose-800" shadow="shadow-red-500/30" active={location.pathname === '/social'} onClick={() => setIsOpen(false)} />
              
              <NavLink to="/forum" icon={Users} en="Forum" ur="فورم" gradient="from-fuchsia-500 to-pink-700" shadow="shadow-fuchsia-500/30" active={location.pathname === '/forum'} onClick={() => setIsOpen(false)} />
              <NavLink to="/admin" icon={Settings} en="Admin" ur="ایڈمن" gradient="from-slate-500 to-slate-700" shadow="shadow-slate-500/30" active={location.pathname === '/admin'} onClick={() => setIsOpen(false)} />
            </NavGroup>
          </nav>
        </div>
      </aside>

      <main className="flex-1 lg:ml-80 flex flex-col min-h-screen bg-[#020408]">
        <header className="lg:hidden p-4 bg-[#09090b] border-b border-white/5 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
          <span className="font-black text-emerald-400">FC KASHMIR</span>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-white/5 rounded-xl"><Menu /></button>
        </header>

        <div className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-portal" element={<FarmerPortal />} />
            <Route path="/farmer-login" element={<FarmerLogin />} />
            <Route path="/farm-manager" element={<FarmManager />} />
            <Route path="/weather" element={<WeatherHub />} />
            <Route path="/mandi" element={<MandiAnalytics />} />
            <Route path="/market" element={<MandiAnalytics />} />
            <Route path="/fck-scanner" element={<SmartDiagnose />} />
            <Route path="/expert" element={<ExpertChat />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/spray-tracker" element={<SprayTracker />} />
            <Route path="/dealers" element={<DealerLocator />} />
            <Route path="/calendar" element={<FarmingCalendar />} />
            <Route path="/soil" element={<SoilHealth />} />
            <Route path="/dosage" element={<DosageCalculator />} />
            <Route path="/profit-calc" element={<ProfitCalculator />} />
            <Route path="/subsidies" element={<SubsidyTracker />} />
            <Route path="/forum" element={<CommunityForum />} />
            <Route path="/ca-storage" element={<CAStorageHub />} />
            <Route path="/livestock" element={<LivestockAI />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            
            {/* ✅ Social Media Route Added */}
            <Route path="/social" element={<SocialMedia />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </main>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}
    </div>
  );
}

// ✨ BILINGUAL NAVLINK
function NavLink({ to, icon: Icon, en, ur, active, onClick, gradient, shadow }: any) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 mb-3 group border ${
        active 
        ? `bg-gradient-to-br ${gradient} border-t-white/30 border-b-black/20 translate-x-2 ${shadow} shadow-lg scale-105` 
        : `bg-[#0f1216] border-white/5 hover:border-white/10 hover:bg-[#1a1d24] text-white/50 hover:text-white`
      }`}
    >
      {/* Icon Box */}
      <div className={`p-3 rounded-xl shrink-0 transition-all ${active ? 'bg-white/20 text-white backdrop-blur-sm shadow-sm' : 'bg-black/20 group-hover:bg-white/10'}`}>
         <Icon size={22} />
      </div>

      {/* Text Area (Bilingual Stack) */}
      <div className="flex flex-col flex-1">
          <span className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${active ? 'text-white/80' : 'text-white/40 group-hover:text-white/60'}`}>
            {en}
          </span>
          <span className={`text-lg font-bold font-urdu leading-none ${active ? 'text-white drop-shadow-md' : 'text-white/80 group-hover:text-white'}`}>
            {ur}
          </span>
      </div>
      
      {active && <ChevronRight size={16} className="text-white/80 animate-pulse" />}
    </Link>
  );
}

function NavGroup({ title, children }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase text-white/20 px-4 tracking-[0.2em] mb-3 border-b border-white/5 pb-2 mx-4">{title}</p>
      {children}
    </div>
  );
}