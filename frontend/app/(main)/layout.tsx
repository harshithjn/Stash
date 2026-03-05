"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/supabaseClient";
import { initializeKeepAlive } from "../../lib/keepAlive";
import {
  Menu,
  Bell,
  LogOut,
  Wallet,
  BarChart3,
  Settings,
  Home,
  FolderOpen,
  PieChart,
  FileText,
  ListChecks,
  Activity,
  Bot,
} from "lucide-react";
import StashAI from "../../components/StashAI";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<{ id?: string | null; name: string | null; email: string | null }>({
    id: null,
    name: null,
    email: null,
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<"notifications" | "profile" | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showStashAI, setShowStashAI] = useState(false);

  // Fetch User
  useEffect(() => {
    // Initialize keep-alive
    const cleanupKeepAlive = initializeKeepAlive();

    // Clear any old localStorage auth tokens on mount
    if (typeof window !== 'undefined') {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.includes('sb-') && key.includes('-auth-token')) {
          window.localStorage.removeItem(key);
        }
      });
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser({
        id: user.id,
        name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "User",
        email: user.email ?? null,
      });

      fetchNotifications(user.id);
    };

    getUser();

    // Poll notifications every 30s
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) fetchNotifications(data.user.id);
    }, 30000);

    return () => {
      clearInterval(interval);
      cleanupKeepAlive(); // Cleanup keep-alive on unmount
    };
  }, [supabase, router, pathname]);

  // Fetch notifications
  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(data || []);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Clear session storage
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
    }
    router.push("/");
  };

  // Sidebar navigation
  const navItems = [
    { name: "Dashboard", href: user.id ? `/dashboard/${user.id}` : "/dashboard", icon: <Home size={18} /> },
    { name: "Portfolio", href: user.id ? `/portfolio/${user.id}` : "/portfolio", icon: <Wallet size={18} /> },
    { name: "Whales", href: "/whales", icon: <Activity size={18} /> },
    { name: "Market", href: "/market", icon: <BarChart3 size={18} /> },
    { name: "News", href: "/news", icon: <FileText size={18} /> },
    { name: "Coins", href: "/coins", icon: <FolderOpen size={18} /> },
    { name: "Watchlist", href: user.id ? `/watchlist/${user.id}` : "/watchlist", icon: <ListChecks size={18} /> },
    { name: "Alerts", href: user.id ? `/alerts/${user.id}` : "/alerts", icon: <Bell size={18} /> },
    { name: "Reports", href: "/reports", icon: <PieChart size={18} /> },
    { name: "Notifications", href: "/notifications", icon: <Bell size={18} /> },
    { name: "Profile", href: "/profile", icon: <Settings size={18} /> },
  ];

  const stashAIItem = { name: "Stash AI", icon: <Bot size={18} />, onClick: () => setShowStashAI(true) };

  const firstLetter = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      {/* Sidebar - Fixed, Collapsible */}
      <aside 
        className={`hidden md:flex md:flex-col border-r border-gray-800 bg-[#0a0a0a] fixed left-0 top-0 h-screen transition-all duration-300 ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                alt="Logo"
                className="w-6 h-6"
              />
            </div>
            {sidebarExpanded && (
              <h1 className="text-xl font-semibold whitespace-nowrap">Stash</h1>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/20"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
                title={!sidebarExpanded ? item.name : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
          
          {/* Stash AI Button */}
          <button
            onClick={stashAIItem.onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white w-full"
            title={!sidebarExpanded ? stashAIItem.name : undefined}
          >
            <span className="flex-shrink-0">{stashAIItem.icon}</span>
            {sidebarExpanded && <span className="whitespace-nowrap">{stashAIItem.name}</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-600/10 hover:text-red-500 w-full transition-all"
            title={!sidebarExpanded ? "Logout" : undefined}
          >
            <span className="flex-shrink-0"><LogOut size={18} /></span>
            {sidebarExpanded && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area - With left margin to account for fixed sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarExpanded ? 'md:ml-64' : 'md:ml-20'
      } min-h-screen`}>
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-6 py-4 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-900">
              <Menu size={20} />
            </button>
            <h2 className="text-base font-medium text-gray-300">
              {pathname.split("/")[1]?.charAt(0).toUpperCase() + pathname.split("/")[1]?.slice(1) || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Stash AI Button */}
            <button
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all group"
              onClick={() => setShowStashAI(true)}
              title="Stash AI Assistant"
            >
              <Bot size={18} className="text-gray-400 group-hover:text-white transition-colors" />
            </button>

            {/* Notification Button */}
            <button
              className="relative p-2 rounded-lg hover:bg-gray-900 transition-colors"
              onClick={() =>
                setShowDropdown((prev) =>
                  prev === "notifications" ? null : "notifications"
                )
              }
            >
              <Bell size={18} className="text-gray-400" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showDropdown === "notifications" && (
              <div className="absolute right-12 top-12 mt-2 w-80 bg-[#111] border border-gray-800 rounded-xl shadow-2xl z-50">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                      >
                        <p className="text-sm text-gray-300">{n.message}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/notifications"
                  className="block p-3 text-center text-sm text-purple-500 hover:bg-gray-900/50 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            )}

            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowDropdown((prev) => (prev === "profile" ? null : "profile"))
                }
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-sm font-semibold hover:from-purple-500 hover:to-purple-600 transition-all"
              >
                {firstLetter}
              </button>

              {/* Profile Dropdown */}
              {showDropdown === "profile" && (
                <div className="absolute right-0 top-12 mt-2 w-64 bg-[#111] border border-gray-800 rounded-xl shadow-2xl z-50">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-red-600/10 hover:text-red-500 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#0a0a0a]">
          {children}
        </main>
      </div>

      {/* Stash AI Chatbot */}
      <StashAI isOpen={showStashAI} onClose={() => setShowStashAI(false)} />
    </div>
  );
}
