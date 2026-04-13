import { Link } from 'react-router-dom'
import { products } from '../data/products'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              {product.badge}
            </span>
          )}

          {/* Discount */}
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>

          {/* Quick Add */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm py-2 rounded-xl transition-colors">
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-white/40 text-xs mb-1">{product.category}</p>
          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-amber-400 font-bold">Rs {product.price.toLocaleString()}</span>
            <span className="text-white/30 text-sm line-through">Rs {product.originalPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/40 text-xs">({product.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const featured = products.slice(4, 8)
 const categories = Object.values(
  products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = p
    }
    return acc
  }, {})
).slice(0, 4)
  return (
    <main>
   
<Hero/>
      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Clothing', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/20', iconColor: '#3b82f6',
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none">
                  <path d="M16 6 L8 14 L4 22 L12 24 L12 42 L36 42 L36 24 L44 22 L40 14 L32 6 C30 10 27 12 24 12 C21 12 18 10 16 6Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M16 6 C18 10 21 12 24 12 C27 12 30 10 32 6" fill="none" stroke="#1d4ed8" strokeWidth="1.5"/>
                </svg>
              )
            },
            {
              label: 'Footwear', color: 'from-green-500/20 to-green-600/20', border: 'border-green-500/20', iconColor: '#10b981',
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none">
                  <path d="M6 30 C6 26 10 20 18 18 L30 16 C36 15 42 18 42 24 L42 32 C42 34 40 36 38 36 L10 36 C8 36 6 34 6 32Z" fill="#10b981" stroke="#047857" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M6 30 L18 28 L30 24" stroke="#047857" strokeWidth="1.2" strokeLinecap="round"/>
                  <ellipse cx="12" cy="36" rx="5" ry="3" fill="#047857"/>
                  <ellipse cx="36" cy="36" rx="5" ry="3" fill="#047857"/>
                </svg>
              )
            },
            {
              label: 'Accessories', color: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/20', iconColor: '#f59e0b',
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none">
                  <circle cx="24" cy="24" r="16" stroke="#f59e0b" strokeWidth="2.5"/>
                  <circle cx="24" cy="24" r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5"/>
                  <circle cx="24" cy="24" r="7" fill="#fcd34d" stroke="#b45309" strokeWidth="1"/>
                  <line x1="24" y1="17" x2="24" y2="24" stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="24" y1="24" x2="29" y2="27" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="24" cy="24" r="1.5" fill="#1f2937"/>
                </svg>
              )
            },
            {
              label: 'Bags', color: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/20', iconColor: '#7c3aed',
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none">
                  <rect x="8" y="18" width="32" height="24" rx="4" fill="#7c3aed" stroke="#4c1d95" strokeWidth="1.5"/>
                  <path d="M17 18 C17 12 31 12 31 18" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="18" y="26" width="12" height="8" rx="2" fill="#6d28d9" stroke="#4c1d95" strokeWidth="1"/>
                  <line x1="24" y1="26" x2="24" y2="34" stroke="#4c1d95" strokeWidth="1"/>
                </svg>
              )
            },
          ].map((cat) => (
            <Link
              key={cat.label}
              to="/products"
              className={`bg-gradient-to-br ${cat.color} border ${cat.border} hover:scale-105 rounded-2xl p-6 text-center transition-all duration-300 group flex flex-col items-center`}
            >
              <div className="mb-3">{cat.icon}</div>
              <p className="font-bold text-white">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-2">Trending Now</p>
            <h2 className="text-4xl font-black">Featured Products</h2>
          </div>
          <Link to="/products" className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            {/* <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-2">Trending Now</p> */}
            <h2 className="text-4xl font-black">Categories</h2>
          </div>
          <Link to="/categories" className="text-white/50 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 p-12 md:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black text-black mb-2">Sale Up To 40% Off</h2>
              <p className="text-black/60 text-lg">Limited time offer on selected items. Don't miss out!</p>
            </div>
            <Link
              to="/products"
              className="shrink-0 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-black/80 transition-colors"
            >
              Shop Sale
            </Link>
          </div>
        </div>
      </section>

 <Footer/>
    </main>
  )
}