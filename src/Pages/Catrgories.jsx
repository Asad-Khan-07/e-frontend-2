import { Link } from 'react-router-dom'
import { products } from '../data/products'
import Footer from '../components/Footer'
import { useCart, useTheme } from '../context/context'
import ShopSaleButton from '../components/ShopeButton'

const allCategories = Object.values(
  products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = p
    }
    return acc
  }, {})
)

const categoryStyles = {
  Clothing:    {
    gradient: 'from-blue-500/80 via-blue-600/60 to-transparent',
    border: 'border-blue-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.4)]',
    badge: 'bg-blue-500/30 text-blue-200',
    accent: 'text-blue-300',
    accentDark: 'text-blue-600',
  },
  Footwear:    {
    gradient: 'from-green-500/80 via-green-600/60 to-transparent',
    border: 'border-green-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(34,197,94,0.4)]',
    badge: 'bg-green-500/30 text-green-200',
    accent: 'text-green-300',
    accentDark: 'text-green-600',
  },
  Accessories: {
    gradient: 'from-amber-500/80 via-amber-600/60 to-transparent',
    border: 'border-amber-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(245,158,11,0.4)]',
    badge: 'bg-amber-500/30 text-amber-200',
    accent: 'text-amber-300',
    accentDark: 'text-amber-600',
  },
  Bags:        {
    gradient: 'from-purple-500/80 via-purple-600/60 to-transparent',
    border: 'border-purple-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(168,85,247,0.4)]',
    badge: 'bg-purple-500/30 text-purple-200',
    accent: 'text-purple-300',
    accentDark: 'text-purple-600',
  },
  Sportswear:  {
    gradient: 'from-red-500/80 via-red-600/60 to-transparent',
    border: 'border-red-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(239,68,68,0.4)]',
    badge: 'bg-red-500/30 text-red-200',
    accent: 'text-red-300',
    accentDark: 'text-red-600',
  },
  Grooming:    {
    gradient: 'from-teal-500/80 via-teal-600/60 to-transparent',
    border: 'border-teal-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(20,184,166,0.4)]',
    badge: 'bg-teal-500/30 text-teal-200',
    accent: 'text-teal-300',
    accentDark: 'text-teal-600',
  },
  Tech:        {
    gradient: 'from-cyan-500/80 via-cyan-600/60 to-transparent',
    border: 'border-cyan-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(6,182,212,0.4)]',
    badge: 'bg-cyan-500/30 text-cyan-200',
    accent: 'text-cyan-300',
    accentDark: 'text-cyan-600',
  },
  Fragrance:   {
    gradient: 'from-pink-500/80 via-pink-600/60 to-transparent',
    border: 'border-pink-500/30',
    shadow: 'hover:shadow-[0_0_20px_5px_rgba(236,72,153,0.4)]',
    badge: 'bg-pink-500/30 text-pink-200',
    accent: 'text-pink-300',
    accentDark: 'text-pink-600',
  },
}

const defaultStyle = {
  gradient: 'from-white/80 via-white/60 to-transparent',
  border: 'border-white/20',
  shadow: 'hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.2)]',
  badge: 'bg-white/20 text-white/80',
  accent: 'text-white',
  accentDark: 'text-slate-700',
}

export default function Categories() {
  const { convertToUSD } = useCart()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 text-center flex  items-center justify-between">
      
      <div className=' '>
        
        <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">
          Browse by Category
        </p>
        <h1 className="text-5xl font-black mb-4">All Categories</h1>
      </div>
      
      
        <p className={`text-lg max-w-xl mx-auto ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
          Explore our full range — from streetwear to tech, grooming to footwear.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {allCategories.map((product) => {
            const style = categoryStyles[product.category] || defaultStyle
            const count = products.filter(p => p.category === product.category).length
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            const minPrice = convertToUSD(
              Math.min(...products.filter(p => p.category === product.category).map(p => p.price))
            ).toFixed(2)

            return (
              <Link
                key={product.category}
                to={`/products?category=${product.category}`}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-white/5 border ${style.border} transition-all duration-500 hover:-translate-y-1 ${style.shadow}`}>

                  {/* Image — full card */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Default gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? '' : ''}`} />

                    {/* Hover: category-colored gradient from bottom */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

                    {/* Badges */}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full z-10 ${style.badge}`}>
                      {count} items
                    </span>
                    <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{discount}%
                    </span>

                    {/* Details — fade up on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">

                      <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${style.accent}`}>
                        {product.category}
                      </p>

                      <h3 className="font-black text-white text-base leading-snug mb-1">
                        {product.category} Collection
                      </h3>

                      {product.description && (
                        <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/50 text-xs">Starting from</p>
                          <p className={`font-black text-sm ${style.accent}`}>${minPrice}</p>
                        </div>
                        <span className="text-white/80 text-xs font-semibold flex items-center gap-1">
                          Shop Now
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Banner */}
      {/* <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 p-12 md:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black" style={{ color: '#0f172a' }}>Sale Up To 40% Off</h2>
              <p className="text-lg" style={{ color: 'rgba(15,23,42,0.6)' }}>Limited time offer on selected items. Don't miss out!</p>
            </div>
            <ShopSaleButton />
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  )
}