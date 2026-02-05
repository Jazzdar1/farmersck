import React from 'react';
import { 
  User, MessageCircle, CloudSun, BarChart3, ScanEye, FlaskConical, 
  Tractor, BookOpen, Sprout, Wallet, Syringe, Calculator, Warehouse, 
  MapPinned, Landmark, Microscope, Users, Home, Settings, FileText
} from 'lucide-react';

// 1. Icon Map (String se Icon Component)
export const ICON_MAP: any = {
  User, MessageCircle, CloudSun, BarChart3, ScanEye, FlaskConical,
  Tractor, BookOpen, Sprout, Wallet, Syringe, Calculator, Warehouse,
  MapPinned, Landmark, Microscope, Users, Home, Settings, FileText
};

// 2. Tile Data Type
export interface DashboardTile {
  id: string;
  label: string;
  sub: string;
  link: string;
  icon: string; // Key from ICON_MAP
  color: string; // Tailwind class e.g., 'bg-blue-600'
  isActive: boolean;
  validFrom?: string; // ISO Date String
  validUntil?: string; // ISO Date String
  isLocked?: boolean; // For Guest Mode logic
}

// 3. Default Tiles (UPDATED: Added Knowledge & Spray Tracker)
export const DEFAULT_MAIN_TILES: DashboardTile[] = [
  { id: '1', label: "میرا پورٹل", sub: "MY PORTAL", link: "/my-portal", icon: "User", color: "bg-blue-600", isActive: true, isLocked: true },
  { id: '2', label: "ماہر سے رابطہ", sub: "AI EXPERT", link: "/expert", icon: "MessageCircle", color: "bg-purple-600", isActive: true },
  { id: '3', label: "موسم کا حال", sub: "WEATHER", link: "/weather", icon: "CloudSun", color: "bg-cyan-600", isActive: true },
  { id: '4', label: "منڈی ریٹ", sub: "MARKET RATES", link: "/mandi", icon: "BarChart3", color: "bg-amber-600", isActive: true },
  { id: '5', label: "اسکینر", sub: "SCANNER", link: "/fck-scanner", icon: "ScanEye", color: "bg-rose-600", isActive: true },
  { id: '6', label: "مٹی کا ٹیسٹ", sub: "SOIL TEST", link: "/soil", icon: "FlaskConical", color: "bg-indigo-600", isActive: true, isLocked: true },
  
  // ✅ NEW ADDITIONS
  { id: '7', label: "اسپرے ٹریکر", sub: "SPRAY LOG", link: "/spray-tracker", icon: "Sprout", color: "bg-lime-600", isActive: true },
  { id: '8', label: "زرعی معلومات", sub: "KNOWLEDGE", link: "/knowledge", icon: "BookOpen", color: "bg-sky-600", isActive: true }
];

export const DEFAULT_FARMER_TILES: DashboardTile[] = [
  { id: 'f1', label: "ماہرانہ رائے", sub: "AI EXPERT", link: "/expert", icon: "MessageCircle", color: "bg-purple-600", isActive: true },
  { id: 'f2', label: "اسکینر پرو", sub: "AI SCANNER", link: "/smart-diagnose", icon: "ScanEye", color: "bg-amber-500", isActive: true },
  { id: 'f3', label: "منڈی ریٹ", sub: "MARKET", link: "/mandi", icon: "BarChart3", color: "bg-blue-600", isActive: true },
  { id: 'f4', label: "موسم کا حال", sub: "WEATHER", link: "/weather", icon: "CloudSun", color: "bg-sky-500", isActive: true },
  { id: 'f5', label: "اسپرے ٹریکر", sub: "LOG BOOK", link: "/spray-tracker", icon: "Sprout", color: "bg-lime-600", isActive: true },
  { id: 'f6', label: "فارم منیجر", sub: "FINANCE", link: "/farm-manager", icon: "Wallet", color: "bg-emerald-600", isActive: true },
  
  // ✅ NEW ADDITION
  { id: 'f7', label: "تعلیمی مرکز", sub: "KNOWLEDGE", link: "/knowledge", icon: "BookOpen", color: "bg-slate-600", isActive: true }
];