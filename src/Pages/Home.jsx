import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { products } from '../data/products'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { useCart } from '../context/context'
import { useTheme } from '../context/context'
import { DollarSign, Percent, Star } from 'lucide-react'
import ShopSaleButton from '../components/ShopeButton'

function SkeletonCard() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  
  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${isLight ? 'bg-slate-200 border border-slate-300' : 'bg-slate-800 border border-slate-700'}`}>
      <div className={`h-96 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
    </div>
  )
}

function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const { convertToUSD } = useCart()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
        isLight 
          ? 'hover:shadow-[0_0_15px_5px_#62748e]' 
          : 'hover:shadow-[0_0_15px_5px_#fcd34d]'
      }`}>
        {/* Main Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {product.badge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          
          <span className="absolute top-3 right-3 flex items-center justify-center bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}<Percent size={20} />
          </span>
          
          <div className="absolute bottom-3 left-3 right-3 -translate-y-20 group-hover:-translate-y-35 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-2 rounded-xl transition-colors">
              Quick Add
            </button>
          </div>
        </div>
        
        {/* Details Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 ${
          isLight 
            ? 'bg-white/95 backdrop-blur-sm' 
            : 'bg-black/95 backdrop-blur-sm'
        }`}>
          <p className={`text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{product.category}</p>
          <h3 className={`font-bold transition-colors ${isLight ? 'text-slate-900 group-hover:text-amber-500' : 'text-white group-hover:text-amber-400'}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 justify-center">
            <span className={`font-bold flex items-center gap-1 ${isLight ? 'text-amber-500' : 'text-amber-400'}`}>
              <DollarSign size={15} />{convertToUSD(product.price).toFixed(2)}
            </span>
            <span className={`text-sm line-through flex items-center gap-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
              <DollarSign size={15} />{convertToUSD(product.originalPrice).toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 justify-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : isLight ? 'text-slate-300' : 'text-white/20'}`} 
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/40'}`}>({product.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const featured = products.slice(4, 8)
  const categories = Object.values(
    products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = p
      return acc
    }, {})
  ).slice(0, 6)

  return (
    <main className={isLight ? 'bg-slate-50' : 'bg-slate-950'}>
      <Hero />

      {/* Featured Products */}
      <section className="py-20 max-w-full px-6">
        <div className="flex flex-col items-center justify-between mb-12">
          <div>
            <p className="text-amber-400 text-lg font-medium tracking-widest uppercase mb-2">Trending Now</p>
            <h1 className={`text-4xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Featured Products</h1>
          </div>
          <Link to="/products" className={`group text-sm font-medium flex items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-amber-500' : 'text-white/50 hover:text-amber-400'}`}>
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      {/* Category Images */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center mb-12">
          <div>
            <p className="text-amber-400 text-lg font-medium tracking-widest uppercase mb-2">Trending Now</p>
            <h1 className={`text-[50px] ${isLight ? 'text-slate-900' : 'text-white'}`}>Featured Categories</h1>
          </div>
          <Link to="/products" className={`group text-sm font-medium flex items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-amber-500' : 'text-white/50 hover:text-amber-400'}`}>
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {[
            { label: 'Clothing',    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80' },
            { label: 'Footwear',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
            { label: 'Accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWNjZXNzb3JpZXN8ZW58MHwwfDB8fHww' },
            { label: 'Bags',        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to="/products"
              className="relative overflow-hidden rounded-2xl hover:scale-105 transition-all duration-300 group block"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark overlays — inline styles so CSS global rules can't interfere */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

              {/* force-white bypasses the global light mode text-white override */}
              <p
                className="force-white absolute bottom-3 left-4 font-bold text-base"
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 8px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1)',
                  zIndex: 10,
                  margin: 0,
                }}
              >
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Products */}
      <section className="py-20 max-w-full px-6">
        <div className="flex items-center flex-col justify-between mb-12 pb-4">
          <div>
            <h1 className={`text-4xl font-black text-center ${isLight ? 'text-slate-900' : 'text-white'}`}>Categories</h1>
          </div>
          <Link to="/categories" className={`group text-sm font-medium flex items-center gap-1 transition-colors ${isLight ? 'text-slate-500 hover:text-amber-500' : 'text-white/50 hover:text-amber-400'}`}>
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : categories.map((product) => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>

      <Footer />
    </main>
  )
}
