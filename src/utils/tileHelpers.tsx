import React from 'react';
import { 
  User, MessageCircle, CloudSun, BarChart3, ScanEye, FlaskConical, 
  Tractor, BookOpen, Sprout, Wallet, Syringe, Calculator, Warehouse, 
  MapPinned, Landmark, Microscope, Users, Home, Settings, FileText, BellRing,
  Layout, ShoppingBag, Leaf, Sun, CloudRain, Thermometer
} from 'lucide-react';

export const ICON_MAP: any = {
  User, MessageCircle, CloudSun, BarChart3, ScanEye, FlaskConical,
  Tractor, BookOpen, Sprout, Wallet, Syringe, Calculator, Warehouse,
  MapPinned, Landmark, Microscope, Users, Home, Settings, FileText, BellRing, 
  Layout, ShoppingBag, Leaf, Sun, CloudRain, Thermometer
};

export interface DashboardTile {
  id: string;
  label: string;
  sub: string;
  link: string;
  icon: string;
  gradient: string;
  shadow: string;
  isActive: boolean;
}

export const DEFAULT_MAIN_TILES: DashboardTile[] = [
  { id: '1', label: "میرا پورٹل", sub: "MY PORTAL", link: "/my-portal", icon: "User", gradient: "from-emerald-500 to-teal-700", shadow: "shadow-emerald-500/40", isActive: true },
  { id: '2', label: "ماہر سے رابطہ", sub: "AI EXPERT", link: "/expert", icon: "MessageCircle", gradient: "from-violet-500 to-purple-700", shadow: "shadow-purple-500/40", isActive: true },
  { id: '3', label: "موسم کا حال", sub: "WEATHER HUB", link: "/weather", icon: "CloudSun", gradient: "from-sky-400 to-blue-600", shadow: "shadow-sky-500/40", isActive: true },
  { id: '4', label: "منڈی ریٹ", sub: "MARKET RATES", link: "/mandi", icon: "BarChart3", gradient: "from-amber-400 to-orange-600", shadow: "shadow-orange-500/40", isActive: true },
  { id: '5', label: "اسکینر", sub: "AI SCANNER", link: "/fck-scanner", icon: "ScanEye", gradient: "from-rose-500 to-red-700", shadow: "shadow-rose-500/40", isActive: true },
  { id: '7', label: "ڈیلر لوکیٹر", sub: "FIND DEALERS", link: "/dealers", icon: "MapPinned", gradient: "from-cyan-500 to-blue-700", shadow: "shadow-cyan-500/40", isActive: true }
];

export const DEFAULT_FARMER_TILES: DashboardTile[] = [
  { id: 'f1', label: "ماہرانہ رائے", sub: "ASK EXPERT", link: "/expert", icon: "MessageCircle", gradient: "from-violet-600 to-indigo-600", shadow: "shadow-indigo-500/40", isActive: true },
  { id: 'f2', label: "اسکینر پرو", sub: "SCANNER PRO", link: "/fck-scanner", icon: "ScanEye", gradient: "from-orange-500 to-red-500", shadow: "shadow-orange-500/40", isActive: true },
  { id: 'f3', label: "منڈی لائیو", sub: "LIVE MARKET", link: "/mandi", icon: "BarChart3", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/40", isActive: true },
  { id: 'f4', label: "موسم", sub: "WEATHER", link: "/weather", icon: "CloudSun", gradient: "from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/40", isActive: true },
  { id: 'f5', label: "لاگ بک", sub: "LOG BOOK", link: "/spray-tracker", icon: "Sprout", gradient: "from-emerald-400 to-green-600", shadow: "shadow-emerald-500/40", isActive: true },
  { id: 'f6', label: "فارم منیجر", sub: "FINANCE", link: "/farm-manager", icon: "Wallet", gradient: "from-teal-400 to-emerald-600", shadow: "shadow-teal-500/40", isActive: true }
];