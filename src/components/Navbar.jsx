import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/context'

export default function Navbar() {
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-amber-400">
          LUXE<span className="text-white">STORE</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Home</Link>
          <Link to="/products" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Products</Link>
          <Link to="/categories" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Categories</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link to="/checkout" className="relative bg-white/5 border border-white/10 hover:border-amber-400/30 w-10 h-10 rounded-xl flex items-center justify-center transition-all">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Link
              to="/profile"
              className="bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 text-amber-400 px-4 h-10 rounded-xl flex items-center gap-2 text-sm font-bold transition-all"
            >
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-black">
                {user.name?.charAt(0).toUpperCase()}
              </span>
              {user.name?.split(' ')[0]}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 h-10 rounded-xl flex items-center text-sm transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
