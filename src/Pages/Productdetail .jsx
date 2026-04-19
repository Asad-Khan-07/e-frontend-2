import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart, useTheme } from '../context/context'
import { products as localProducts } from '../data/products'
import { CheckLine, CircleSmall, DollarSign, Lock, Star, Truck, Undo2 } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const { setCart, convertToUSD } = useCart()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    setLoading(true)

    // Check whether the id is numeric (local data) or a MongoDB _id
    const isNumericId = /^\d+$/.test(id)

    if (isNumericId) {
      // Find product from local data
      const localProduct = localProducts.find(p => String(p.id) === String(id))
      if (localProduct) {
        setProduct({ ...localProduct, _id: localProduct.id })
        if (localProduct.colors && localProduct.colors.length > 0) setSelectedColor(localProduct.colors[0])
      } else {
        setProduct(null)
      }
      setLoading(false)
    } else {
      // It's a MongoDB _id, fetch from API
      getProduct(id)
        .then(data => {
          if (data && data._id) {
            setProduct(data)
            if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0])
          } else {
            setProduct(null)
          }
        })
        .catch(() => setProduct(null))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#0a0a0a]'}`}>
        <div className={`text-xl ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-slate-50' : 'bg-[#0a0a0a]'}`}>
        <div className="text-center">
          <p className={`text-xl mb-4 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Product not found</p>
          <Link to="/products" className="text-amber-600 hover:underline">← Back to Products</Link>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size first!')
      return
    }
    const cartData = {
      _id: product._id,
      id: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: qty,
      image: product.image,
      category: product.category,
      cartItemId: Date.now(),
    }
    setCart(prev => {
      const updated = [...prev, cartData]
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className={`pt-28 pb-20 max-w-7xl mx-auto px-6 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white'}`}>
      <div className={`flex items-center gap-2 text-sm mb-10 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
        <Link to="/" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Home</Link>
        <span>/</span>
        <Link to="/products" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Products</Link>
        <span>/</span>
        <span className={isLight ? 'text-slate-900' : 'text-white'}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className={`relative rounded-3xl overflow-hidden aspect-square border ${isLight ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.badge && (
                <span className="bg-amber-400 text-black text-sm font-bold px-3 py-1 rounded-full">{product.badge}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}% OFF</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: <Truck />, label: 'Free Delivery', sub: 'Over $7.14' },
              { icon: <Undo2 />, label: 'Easy Returns', sub: '30-day policy' },
              { icon: <Lock />, label: 'Secure Pay', sub: '100% safe' },
            ].map((perk) => (
              <div key={perk.label} className={`rounded-xl p-3 text-center border flex flex-col items-center ${isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <div className={`text-xl mb-1 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{perk.icon}</div>
                <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{perk.label}</p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{perk.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className=''>
          <p className={`text-sm text-start font-medium tracking-widest uppercase mb-2 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{product.category}</p>
          <h1 className="text-4xl font-black mb-4 text-start">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star size={20} key={i} className={` ${i < Math.floor(product.rating) ? 'text-amber-400' : isLight ? 'text-slate-300' : 'text-white/20'}`}/>
                ))}
              </div>
              <span className="font-bold">{product.rating}</span>
              {product.reviews && <span className={`text-sm ${isLight ? 'text-slate-500' : 'text-white/40'}`}>({product.reviews} reviews)</span>}
            </div>
          )}

          <div className={`flex items-baseline gap-3 mb-8 pb-8 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <span className={`text-5xl font-black flex items-center ${isLight ? 'text-amber-600' : 'text-amber-400'}`}><DollarSign size={40} />{convertToUSD(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className={`text-xl line-through flex items-center ${isLight ? 'text-slate-400' : 'text-white/30'}`}><DollarSign size={20} />{convertToUSD(product.originalPrice)}</span>
                <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  Save <DollarSign size={15} />{(convertToUSD(product.originalPrice - product.price))}
                </span>
              </>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className={`text-sm font-medium mb-3 ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Color</p>
              <div className="flex gap-3">
                {product.colors.map((color, i) => {
                  const colorLower = String(color).toLowerCase().trim()
                  const isWhiteColor = colorLower.includes('white') || colorLower === '#ffffff' || colorLower === '#fff'
                  const isBlackColor = colorLower.includes('black') || colorLower === '#000000' || colorLower === '#000'
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all color-circle-border ${
                        selectedColor === color 
                          ? 'ring-2 ring-amber-400 ring-offset-2 scale-110' 
                          : 'hover:scale-105'
                      } ${
                        isLight 
                          ? 'border-[2.5px] border-slate-500 ring-offset-slate-50' 
                          : (isWhiteColor || isBlackColor)
                            ? 'border-[2.5px] border-white/40 ring-offset-[#0a0a0a]'
                            : 'border-[2.5px] border-white/15 ring-offset-[#0a0a0a]'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-medium ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Size</p>
                <button className={`text-xs hover:underline ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSize === size 
                        ? 'bg-amber-400 text-black border-amber-400' 
                        : isLight
                          ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                          : 'bg-white/5 border-white/20 text-white/70 hover:border-white/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <p className={`text-sm font-medium ${isLight ? 'text-slate-600' : 'text-white/60'}`}>Qty:</p>
            <div className={`flex items-center rounded-full overflow-hidden ${isLight ? 'bg-white border border-slate-300' : 'bg-white/5 border border-white/10'}`}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className={`w-10 h-10 flex items-center justify-center transition-colors text-xl font-bold ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}>−</button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className={`w-10 h-10 flex items-center justify-center transition-colors text-xl font-bold ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}>+</button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-bold py-4 rounded-2xl text-lg transition-all ${
                added 
                  ? 'bg-green-500 text-white scale-95' 
                  : 'bg-amber-400 hover:bg-amber-300 text-black hover:scale-105 shadow-2xl shadow-amber-300'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckLine size={20} /> Added to Cart!
                </span>
              ) : 'Add to Cart'}
            </button>
            <button className={`px-6 py-4 rounded-2xl transition-all ${isLight ? 'bg-white border border-slate-300 hover:border-slate-400 text-slate-700' : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className={`border-t pt-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className="flex gap-6 mb-4">
              {['description', 'details', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium capitalize pb-2 border-b-2 transition-all ${
                    activeTab === tab 
                      ? isLight 
                        ? 'border-amber-600 text-amber-600' 
                        : 'border-amber-400 text-amber-400'
                      : isLight
                        ? 'border-transparent text-slate-500 hover:text-slate-900'
                        : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
              {activeTab === 'description' && (product.description || 'No description available.')}
              {activeTab === 'details' && (
                <ul className="space-y-2">
                  <li className='flex items-center justify-center'><CircleSmall size={15}/> Material: Premium Cotton Blend</li>
                  <li className='flex items-center justify-center'><CircleSmall size={15} /> Origin: Made in Pakistan</li>
                  <li className='flex items-center justify-center'><CircleSmall size={15} /> Care: Machine wash cold</li>
                  <li className='flex items-center justify-center'><CircleSmall size={15} /> Fit: Regular / Relaxed</li>
                </ul>
              )}
              {activeTab === 'reviews' && (
                <p className='flex items-center justify-center'><Star size={15} className="text-amber-400" /> {product.rating || 'N/A'}/5 based on {product.reviews || 0} verified reviews.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}