import { useState, useEffect } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { getStats } from '../../services/api'
import { useTheme } from '../../context/context'
import {
  LayoutGrid, Package, Tag, ShoppingBag,
  ChevronLeft, ChevronRight, LogOut,
  DollarSign, Clock, BarChart2
} from 'lucide-react'

const navItems = [
  { path: '/admin', label: 'Dashboard', exact: true, icon: <LayoutGrid className="w-5 h-5" /> },
  { path: '/admin/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { path: '/admin/categories', label: 'Categories', icon: <Tag className="w-5 h-5" /> },
  { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
]

const statConfigs = [
  {
    label: 'Total Products', key: 'totalProducts',
    icon: <Package className="w-6 h-6" />,
    color: 'text-amber-400', bg: 'bg-amber-400/10'
  },
  {
    label: 'Total Orders', key: 'totalOrders',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'text-blue-400', bg: 'bg-blue-400/10'
  },
  {
    label: 'Pending Orders', key: 'pendingOrders',
    icon: <Clock className="w-6 h-6" />,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10'
  },
  {
    label: 'Revenue', key: 'revenue', isRevenue: true,
    icon: <DollarSign className="w-6 h-6" />,
    color: 'text-green-400', bg: 'bg-green-400/10'
  },
]

export default function AdminLayout() {
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const admin = JSON.parse(localStorage.getItem('adminUser') || 'null')

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { navigate('/admin/login'); return }
    getStats().then(data => setStats(data))
  }, [])

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white'} flex`}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#111] border-white/10'} border-r flex flex-col transition-all duration-300 fixed h-full z-20`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <span className="text-lg font-black text-amber-400">Mega<span className="text-white">Mix</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors ml-auto">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {sidebarOpen && item.path === '/admin/orders' && stats?.pendingOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Admin info */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-start">
                <p className="text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
                <button onClick={logout} className="text-xs text-white/30 hover:text-red-400 transition-colors flex items-center gap-1">
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <div className={`sticky top-0 z-10 ${theme === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0a0a0a]/80 border-white/10'} backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between`}>
          <h1 className="font-bold">
            {navItems.find(n => isActive(n.path, n.exact))?.label || 'Admin Panel'}
          </h1>
          {stats && (
            <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/40'}`}>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                {stats.totalProducts} products
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                {stats.totalOrders} orders
              </span>
            </div>
          )}
        </div>

        {/* Stats cards - only on dashboard */}
        {location.pathname === '/admin' && stats && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statConfigs.map(stat => (
                <div key={stat.label} className={`${theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'} rounded-2xl p-5`}>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'} text-start`}>
                    {stat.isRevenue ? `$ ${((stats.revenue || 0) / 278).toFixed(2).toLocaleString()}` : stats[stat.key]}
                  </div>
                  <div className={`${theme === 'light' ? 'text-slate-500' : 'text-white/40'} text-sm mt-1 text-start`}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className={`${theme === 'light' ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-white/30'} rounded-2xl p-8 text-center`}>
              <BarChart2 className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'text-slate-300' : 'text-white/10'}`} strokeWidth={1.5} />
              <p className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-slate-700' : 'text-white/60'}`}>Welcome to Admin Panel</p>
              <p>Use the sidebar to manage your store</p>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  )
}