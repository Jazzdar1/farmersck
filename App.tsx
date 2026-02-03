import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation, Navigate } = ReactRouterDOM as any;

import { 
  LayoutDashboard, Menu, X, CloudSun, MessageCircle, User, 
  ScanEye, Syringe, Microscope, FlaskConical, Rabbit, Settings, MapPin, Lock,
  BookOpen, Warehouse, Sun, Moon, BarChart3, ShieldCheck, Calendar,
  TrendingUp, Calculator, Landmark, GraduationCap, MapPinned, FileText, Users
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
import FarmerLogin from './pages/FarmerLogin';
import FarmerPortal from './pages/FarmerPortal';
import CommunityForum from './pages/CommunityForum';
import LivestockAI from './pages/LivestockAI';
import SprayTracker from './pages/SprayTracker';
import Admin from './pages/Admin';

import Footer from './components/Footer';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userToken = localStorage.getItem('fck_user_token');
  if (!userToken) return <Navigate to="/farmer-portal" replace />;
  return <>{children}</>;
};

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
  const userName = localStorage.getItem('fck_user_name');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* SIDEBAR WITH ALL 16+ PAGES RESTORED */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 border-r border-white/10 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto no-scrollbar shadow-2xl`}>
        <div className="p-6 flex flex-col min-h-full">
          
          {/* 3D REVOLVING LOGO */}
          <div className="flex items-center gap-4 mb-10 shrink-0">
            <div className="animate-revolve w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-emerald-500/20">FC</div>
            <h1 className="font-black text-xl tracking-tighter uppercase text-white">FC KASHMIR</h1>
          </div>

          <nav className="flex-1 space-y-6 pb-10">
            {/* MAIN HUB */}
            <NavGroup title="Main Hub | مین">
              <NavLink to="/" icon={LayoutDashboard} label="Dashboard | ڈیش بورڈ" active={location.pathname === '/'} onClick={() => setIsOpen(false)} />
              <NavLink to="/my-portal" icon={User} label={userName ? `Verified: ${userName}` : "Farmer Portal | کسان پورٹل"} active={location.pathname === '/my-portal'} onClick={() => setIsOpen(false)} />
              <NavLink to="/admin" icon={Settings} label="Admin Station | اسٹیشن" active={location.pathname === '/admin'} onClick={() => setIsOpen(false)} />
              <NavLink to="/expert" icon={MessageCircle} label="Ask Expert AI | ماہر" active={location.pathname === '/expert'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* REAL-TIME */}
            <NavGroup title="Real-time | تازہ ترین">
              <NavLink to="/weather" icon={CloudSun} label="Weather | موسم" active={location.pathname === '/weather'} onClick={() => setIsOpen(false)} />
              <NavLink to="/market" icon={BarChart3} label="Mandi | منڈی" active={location.pathname === '/market'} onClick={() => setIsOpen(false)} />
              <NavLink to="/mandi-stats" icon={TrendingUp} label="Price Stats | تجزیہ" active={location.pathname === '/mandi-stats'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* ORCHARD TOOLS */}
            <NavGroup title="Orchard Tools | باغات">
              <NavLink to="/fck-scanner" icon={ScanEye} label="AI Scanner | اسکینر" active={location.pathname === '/fck-scanner'} onClick={() => setIsOpen(false)} />
              <NavLink to="/spray-track" icon={Syringe} label="Spray Audit | اسپرے" active={location.pathname === '/spray-track'} onClick={() => setIsOpen(false)} />
              <NavLink to="/soil" icon={Microscope} label="Soil Health | مٹی" active={location.pathname === '/soil'} onClick={() => setIsOpen(false)} />
              <NavLink to="/calendar" icon={Calendar} label="Crop Calendar | کیلنڈر" active={location.pathname === '/calendar'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* FINANCE & LOGISTICS */}
            <NavGroup title="Resources | وسائل">
              <NavLink to="/profit-calc" icon={Calculator} label="Profit Calc | منافع" active={location.pathname === '/profit-calc'} onClick={() => setIsOpen(false)} />
              <NavLink to="/subsidies" icon={Landmark} label="Subsidies | سبسڈی" active={location.pathname === '/subsidies'} onClick={() => setIsOpen(false)} />
              <NavLink to="/ca-storage" icon={Warehouse} label="CA Storage | اسٹوریج" active={location.pathname === '/ca-storage'} onClick={() => setIsOpen(false)} />
              <NavLink to="/dealers" icon={MapPinned} label="Dealers | ڈیلرز" active={location.pathname === '/dealers'} onClick={() => setIsOpen(false)} />
              <NavLink to="/livestock" icon={Rabbit} label="Livestock AI | مویشی" active={location.pathname === '/livestock'} onClick={() => setIsOpen(false)} />
            </NavGroup>

            {/* LEGAL & COMMUNITY */}
            <NavGroup title="Community | کمیونٹی">
              <NavLink to="/forum" icon={Users} label="Forum | فورم" active={location.pathname === '/forum'} onClick={() => setIsOpen(false)} />
              <NavLink to="/knowledge" icon={GraduationCap} label="Knowledge | علم" active={location.pathname === '/knowledge'} onClick={() => setIsOpen(false)} />
              <NavLink to="/privacy" icon={ShieldCheck} label="Privacy | رازداری" active={location.pathname === '/privacy'} onClick={() => setIsOpen(false)} />
              <NavLink to="/terms" icon={FileText} label="Terms | شرائط" active={location.pathname === '/terms'} onClick={() => setIsOpen(false)} />
            </NavGroup>
          </nav>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="lg:hidden p-4 bg-emerald-900 flex justify-between items-center sticky top-0 z-40 shadow-lg">
          <span className="font-black">FC KASHMIR</span>
          <button onClick={() => setIsOpen(!isOpen)}><Menu /></button>
        </header>
        <div className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmer-portal" element={<FarmerLogin />} />
            <Route path="/my-portal" element={<ProtectedRoute><FarmerPortal /></ProtectedRoute>} />
            <Route path="/admin" element={<Admin />} /> 
            <Route path="/weather" element={<WeatherHub />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/fck-scanner" element={<ProtectedRoute><SmartDiagnose /></ProtectedRoute>} />
            <Route path="/expert" element={<ProtectedRoute><ExpertChat /></ProtectedRoute>} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/spray-track" element={<ProtectedRoute><SprayTracker /></ProtectedRoute>} />
            <Route path="/dealers" element={<ProtectedRoute><DealerLocator /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><FarmingCalendar /></ProtectedRoute>} />
            <Route path="/soil" element={<ProtectedRoute><SoilHealth /></ProtectedRoute>} />
            <Route path="/dosage" element={<ProtectedRoute><DosageCalculator /></ProtectedRoute>} />
            <Route path="/mandi-stats" element={<ProtectedRoute><MandiAnalytics /></ProtectedRoute>} />
            <Route path="/profit-calc" element={<ProtectedRoute><ProfitCalculator /></ProtectedRoute>} />
            <Route path="/subsidies" element={<ProtectedRoute><SubsidyTracker /></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><CommunityForum /></ProtectedRoute>} />
            <Route path="/ca-storage" element={<ProtectedRoute><CAStorageHub /></ProtectedRoute>} />
            <Route path="/livestock" element={<ProtectedRoute><LivestockAI /></ProtectedRoute>} />
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

function NavLink({ to, icon: Icon, label, active, onClick }: any) {
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'hover:bg-white/5 text-white/70'}`}>
      <Icon size={18} /> <span className="text-sm font-urdu leading-none">{label}</span>
    </Link>
  );
}

function NavGroup({ title, children }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase text-emerald-500/40 px-4 tracking-[0.2em] font-urdu">{title}</p>
      {children}
    </div>
  );
}