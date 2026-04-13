import { useState, useEffect } from 'react'
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom'
import { getStats } from '../../services/api'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/products', label: 'Products', icon: '📦' },
  { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { path: '/admin/orders', label: 'Orders', icon: '🛒' },
]

export default function AdminLayout() {
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#111] border-r border-white/10 flex flex-col transition-all duration-300 fixed h-full z-20`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <span className="text-lg font-black text-amber-400">LUXE<span className="text-white">ADMIN</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors ml-auto">
            {sidebarOpen ? '◀' : '▶'}
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
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {sidebarOpen && item.path === '/admin/orders' && stats?.pendingOrders > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Admin info */}
        <div className="p-3 border-t border-white/10">
          <div className={`flex items-center gap-3 px-3 py-2`}>
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{admin?.name || 'Admin'}</p>
                <button onClick={logout} className="text-xs text-white/30 hover:text-red-400 transition-colors">Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold">
              {navItems.find(n => isActive(n.path, n.exact))?.label || 'Admin Panel'}
            </h1>
          </div>
          {stats && (
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span>📦 {stats.totalProducts} products</span>
              <span>🛒 {stats.totalOrders} orders</span>
            </div>
          )}
        </div>

        {/* Stats cards - only on dashboard */}
        {location.pathname === '/admin' && stats && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'amber' },
                { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'blue' },
                { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'yellow' },
                { label: 'Revenue', value: `Rs ${(stats.revenue || 0).toLocaleString()}`, icon: '💰', color: 'green' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/30">
              <p className="text-lg font-bold text-white/60 mb-2">Welcome to Admin Panel</p>
              <p>Use the sidebar to manage your store</p>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  )
}
