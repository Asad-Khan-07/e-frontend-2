import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import { useCart, useTheme } from '../context/context'
import { ClipLoader } from 'react-spinners'
import { DollarSign } from 'lucide-react'

function ProductCard({ product }) {
  const { cart, setCart } = useCart()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const { convertToUSD } = useCart()
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const addToCart = (e) => {
    e.preventDefault()
    const existing = cart.find(i => i._id === product._id)
    let updated
    if (existing) {
      updated = cart.map(i => i._id === product._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
    } else {
      updated = [...cart, { ...product, quantity: 1 }]
    }
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className={`relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1 ${isLight ? 'hover:shadow-[0_0_15px_5px_#62748e]' : 'hover:shadow-[0_0_15px_5px_#fcd34d]'}`}>

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Default subtle bottom gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? '' : 'from-black/50 to-transparent'}`} />

          {/* Hover: stronger gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'bg-white' : 'bg-black'} h-32  -translate-y-32 group-hover:translate-y-32 transition-all   duration-400`} />

          {/* Badges */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
              {product.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            -{discount}%
          </span>

          {/* Product details — fade up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">

            <p className={`text-xs uppercase tracking-wider mb-1 font-semibold ${isLight ? 'text-amber-600' : 'text-amber-400/80'}`}>
              {product.category}
            </p>

            <h3 className={`font-bold text-sm leading-snug mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className={`text-xs leading-relaxed line-clamp-2 mb-2 ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                {product.description}
              </p>
            )}

            {/* Price row */}
            <div className="flex items-center gap-2">
              <span className={`font-bold flex items-center ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                <DollarSign size={18}/>{convertToUSD(product.price)}
              </span>
              <span className={`text-xs line-through flex items-center ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                <DollarSign size={18}/>{convertToUSD(product.originalPrice)}
              </span>
              <span className="ml-auto text-green-600 text-xs font-semibold">
                {discount}% off
              </span>
            </div>

          </div>
        </div>

      </div>
    </Link>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory !== 'all') params.category = activeCategory
    if (search) params.search = search
    getProducts(params).then(data => {
      setProducts(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [activeCategory, search])

  const isLight = theme === 'light'

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white'} `}>
      <div className="max-w-7xl mx-auto px-6 py-12 ">

        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-evenly gap-10 mb-8">
          <h1 className="text-3xl font-black">All Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-400/50 transition-colors text-sm w-full md:w-64 ${isLight ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-500' : 'bg-white/5 border border-white/10 text-white placeholder-white/30'}`}
          />
        </div>

        {/* Category Filter */}
        <div className=' grid grid-cols-1 md:grid-cols-2'>

        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-3 md:place-items-start md:h-56   mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full w-52 h-10 text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5  rounded-full w-52 h-10 text-sm font-medium transition-all ${activeCategory === cat.name ? 'bg-amber-400 text-black' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loader / Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <ClipLoader color="#fbbf24" size={52} speedMultiplier={0.9} />
            <p className={`text-sm ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/30">No products found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 justify-content-center align-items-center gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
          </div>

      </div>
    </div>
  )
}