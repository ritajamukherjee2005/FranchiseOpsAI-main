import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Store,
  Boxes,
  Users,
  Megaphone,
  Bell,
  FileBarChart,
  Settings,
  Search,
  Sparkles,
  Sun,
  Moon,
  Zap,
  X,
  Menu,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";

export default function Layout({ children, dark, setDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Outlet Performance Agent", icon: Store, path: "/outlet-performance" },
    { label: "AI Audit Agent", icon: ShieldCheck, path: "/audit" },
    { label: "Inventory Agent", icon: Boxes, path: "/inventory" },
    { label: "Staff Agent", icon: Users, path: "/staff" },
    { label: "Marketing Agent", icon: Megaphone, path: "/marketing" },
    { label: "Intelligence Engine", icon: Brain, path: "/intelligence" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Reports", icon: FileBarChart, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const activePath = location.pathname;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex">
      
      {/* ============ HOTSTAR STYLE EXPANDABLE SIDEBAR (ADAPTIVE LIGHT/DARK) ============ */}
      <motion.aside
        initial={false}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 text-slate-800 dark:text-white backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out shadow-xl
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"} 
          ${isHovered ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* BRAND HEADER */}
        <div className="flex items-center gap-3 px-5 h-20 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <motion.span 
              animate={{ opacity: isHovered || sidebarOpen ? 1 : 0, width: isHovered || sidebarOpen ? "auto" : 0 }}
              className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent overflow-hidden whitespace-nowrap"
            >
              FranchiseOS
            </motion.span>
          </Link>
          <button className="ml-auto lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? activePath === "/" || activePath === "/dashboard"
                : activePath === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-3.5 py-3 rounded-2xl text-sm transition-all group relative overflow-hidden
                  ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white font-medium"}`}
              >
                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                  <item.icon size={20} className={isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"} />
                </div>
                
                <motion.span 
                  animate={{ opacity: isHovered || sidebarOpen ? 1 : 0, x: isHovered || sidebarOpen ? 0 : -10 }}
                  className="truncate whitespace-nowrap tracking-wide text-xs"
                >
                  {item.label}
                </motion.span>

                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-cyan-400 shadow-md shadow-cyan-400/50" 
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 px-2">
            <motion.p 
              animate={{ opacity: isHovered || sidebarOpen ? 1 : 0 }}
              className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2 whitespace-nowrap"
            >
              Authentication
            </motion.p>
            <Link
              to="/login"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activePath === "/login"
                  ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LogIn size={18} className="shrink-0" />
              <motion.span animate={{ opacity: isHovered || sidebarOpen ? 1 : 0 }} className="truncate whitespace-nowrap">Sign In</motion.span>
            </Link>
            <Link
              to="/signup"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all mt-1 ${
                activePath === "/signup"
                  ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UserPlus size={18} className="shrink-0" />
              <motion.span animate={{ opacity: isHovered || sidebarOpen ? 1 : 0 }} className="truncate whitespace-nowrap">Create Account</motion.span>
            </Link>
          </div>
        </nav>

        {/* FOOTER BADGE */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 overflow-hidden">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-500/20 p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Zap size={16} />
            </div>
            <motion.div animate={{ opacity: isHovered || sidebarOpen ? 1 : 0, width: isHovered || sidebarOpen ? "auto" : 0 }} className="overflow-hidden whitespace-nowrap">
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300">AI Engine Active</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">16 outlets live</p>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ MAIN CONTENT AREA ============ */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-20 h-20 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center gap-4 px-4 lg:px-8">
          <button className="lg:hidden text-slate-600 dark:text-slate-300" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="relative hidden md:block w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search outlets, inventory, insights..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 dark:text-slate-100 shadow-inner"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <Sparkles size={16} /> AI Assistant
            </motion.button>

            {/* NOTIFICATION ICON BUTTON */}
            <button 
              onClick={() => navigate("/notifications")}
              className="relative p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title="Open Notifications & Workflow Control Center"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {dark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <div className="hidden md:block text-right leading-tight px-3 border-l border-slate-200/80 dark:border-slate-800 ml-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shadow-lg">
                  RK
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-3 z-50 text-xs overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Ritaja Mukherjee</p>
                      <p className="text-slate-400 text-[11px]">Regional Manager</p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 font-medium transition"
                    >
                      <LogIn size={15} /> Switch Account
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 font-medium transition"
                    >
                      <UserPlus size={15} /> Add Manager
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left font-semibold transition"
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}