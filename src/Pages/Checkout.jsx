import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/context'
import { placeOrder } from '../services/api'

const steps = ['Cart', 'Shipping', 'Payment', 'Confirm']

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    payMethod: 'card', delivery: 'standard',
  })

  const { cart, setCart } = useCart()

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 10000 ? 0 : 299
  const discount = 500
  const total = subtotal + shipping - discount

  const updateQty = (cartItemId, delta) => {
    setCart(prev => {
      const updated = prev.map(i =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (cartItemId) => {
    setCart(prev => {
      const updated = prev.filter(i => i.cartItemId !== cartItemId)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const handleInput = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4)
    return v.length >= 3 ? v.slice(0, 2) + '/' + v.slice(2) : v
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/60 transition-colors"
  const labelCls = "block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wide"

  // ✅ FIXED: Place order saves to database
  const handlePlaceOrder = async () => {
    setPlacing(true)
    setOrderError('')
    try {
      const orderData = {
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        customerEmail: form.email,
        customerPhone: form.phone,
        address: form.address,
        city: form.city,
        items: cart.map(item => {
          // Sirf valid MongoDB ObjectId bhejo (24 char hex string)
          // Numeric id (local data se) backend reject karta hai
          const isMongoId = typeof item._id === 'string' && /^[a-f\d]{24}$/i.test(item._id)
          return {
            ...(isMongoId && { product: item._id }),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || '',
            color: item.color || '',
          }
        }),
        totalAmount: total,
        paymentMethod: form.payMethod,
        paymentStatus: 'unpaid',
      }

      const result = await placeOrder(orderData)

      if (result && result._id) {
        // Success — clear cart
        localStorage.removeItem('cart')
        setCart([])
        setPlaced(true)
      } else {
        setOrderError(result?.message || 'Order failed. Please check your details.')
      }
    } catch (err) {
      setOrderError('Network error. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (placed) return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-3">Order Placed!</h1>
        <p className="text-white/50 mb-2">Thank you, <span className="text-white font-bold">{form.firstName || 'Customer'}</span>!</p>
        <p className="text-white/40 text-sm mb-8">Confirmation sent to <span className="text-amber-400">{form.email || 'your email'}</span></p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm"><span className="text-white/40">Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Shipping</span><span>{shipping === 0 ? 'Free' : `Rs ${shipping}`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/40">Discount</span><span className="text-green-400">-Rs {discount}</span></div>
          <div className="flex justify-between font-black text-amber-400 border-t border-white/10 pt-2 mt-2"><span>Total</span><span>Rs {total.toLocaleString()}</span></div>
        </div>
        <Link to="/" className="bg-amber-400 text-black font-black px-8 py-4 rounded-full hover:bg-amber-300 transition-colors inline-block">
          Back to Home
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <button onClick={() => i < step && setStep(i)} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-amber-400 text-black' :
                'bg-white/10 text-white/30'
              }`}>
                {i < step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-amber-400' : i < step ? 'text-green-400' : 'text-white/30'}`}>{s}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 transition-all ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* STEP 0: Cart */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-black mb-6">
                Your Cart <span className="text-white/30 font-normal text-lg">({cart.length} items)</span>
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-20 text-white/40">
                  <p className="text-xl mb-4">Your cart is empty</p>
                  <Link to="/products" className="text-amber-400 hover:underline">Browse Products →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              {item.color && (
                                <div className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                                  <span className="text-white/40 text-xs">Color</span>
                                </div>
                              )}
                              {item.size && <span className="text-white/40 text-xs">Size: <span className="text-white/60">{item.size}</span></span>}
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.cartItemId)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden">
                            <button onClick={() => updateQty(item.cartItemId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-lg">−</button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQty(item.cartItemId, +1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-lg">+</button>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-400 font-black">Rs {(item.price * item.quantity).toLocaleString()}</p>
                            {item.quantity > 1 && <p className="text-white/30 text-xs">Rs {item.price.toLocaleString()} each</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setStep(1)}
                disabled={cart.length === 0}
                className="mt-6 w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.01]"
              >
                Proceed to Shipping →
              </button>
            </div>
          )}

          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black mb-6">Shipping Info</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleInput} className={inputCls} placeholder="Ali" />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleInput} className={inputCls} placeholder="Khan" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleInput} className={inputCls} placeholder="ali@email.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleInput} className={inputCls} placeholder="03XX-XXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Street Address</label>
                  <input name="address" value={form.address} onChange={handleInput} className={inputCls} placeholder="House #, Street, Area" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>City</label>
                    <input name="city" value={form.city} onChange={handleInput} className={inputCls} placeholder="Karachi" />
                  </div>
                  <div>
                    <label className={labelCls}>Province</label>
                    <select name="province" value={form.province} onChange={handleInput} className={inputCls + " cursor-pointer"}>
                      <option value="" className="bg-[#0f0f0f]">Select</option>
                      {['Sindh','Punjab','KPK','Balochistan','Gilgit-Baltistan','AJK'].map(p => (
                        <option key={p} value={p} className="bg-[#0f0f0f]">{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>ZIP Code</label>
                    <input name="zip" value={form.zip} onChange={handleInput} className={inputCls} placeholder="75600" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Delivery Method</label>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: subtotal > 10000 ? 'Free' : 'Rs 299' },
                      { id: 'express', label: 'Express Delivery', sub: '2–3 business days', price: 'Rs 599' },
                      { id: 'same', label: 'Same Day (Karachi only)', sub: 'Order before 2 PM', price: 'Rs 999' },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        form.delivery === opt.id ? 'border-amber-400/60 bg-amber-400/5' : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" value={opt.id} onChange={handleInput} className="accent-amber-400" />
                          <div>
                            <p className="font-bold text-sm">{opt.label}</p>
                            <p className="text-white/40 text-xs">{opt.sub}</p>
                          </div>
                        </div>
                        <span className="text-amber-400 font-bold text-sm">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="px-6 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-2xl transition-colors">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.01]">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black mb-6">Payment</h2>
              <div className="flex gap-3 mb-6">
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'easypaisa', label: 'Easypaisa' },
                  { id: 'cod', label: 'Cash on Delivery' },
                ].map(m => (
                  <button key={m.id} onClick={() => setForm(p => ({ ...p, payMethod: m.id }))}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex-1 justify-center ${
                      form.payMethod === m.id ? 'border-amber-400/60 bg-amber-400/10 text-amber-400' : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {form.payMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Cardholder Name</label>
                    <input name="cardName" value={form.cardName} onChange={handleInput} className={inputCls} placeholder="Ali Khan" />
                  </div>
                  <div>
                    <label className={labelCls}>Card Number</label>
                    <input name="cardNumber" value={form.cardNumber} onChange={e => setForm(p => ({ ...p, cardNumber: formatCard(e.target.value) }))} className={inputCls + " font-mono tracking-widest"} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Expiry Date</label>
                      <input name="expiry" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} className={inputCls} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className={labelCls}>CVV</label>
                      <input name="cvv" value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} className={inputCls} placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {form.payMethod === 'easypaisa' && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-3">
                  <p className="font-bold">Pay via Easypaisa</p>
                  <p className="text-white/40 text-sm">Send Rs {total.toLocaleString()} to <span className="text-white font-bold">0300-1234567</span></p>
                  <div>
                    <label className={labelCls}>Your Easypaisa Number</label>
                    <input name="phone" value={form.phone} onChange={handleInput} className={inputCls} placeholder="03XX-XXXXXXX" />
                  </div>
                </div>
              )}

              {form.payMethod === 'cod' && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <p className="font-bold">Cash on Delivery</p>
                  <p className="text-white/40 text-sm">Pay when your order arrives</p>
                  <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3">
                    <p className="text-amber-400 text-sm">Please keep exact change of <span className="font-bold">Rs {total.toLocaleString()}</span> ready.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="px-6 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-2xl transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.01]">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black mb-6">Review & Confirm</h2>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">Shipping To</h3>
                    <button onClick={() => setStep(1)} className="text-amber-400 text-xs hover:underline">Edit</button>
                  </div>
                  <p className="text-white font-medium">{form.firstName} {form.lastName}</p>
                  <p className="text-white/50 text-sm">{form.address || '—'}, {form.city || '—'}, {form.province || '—'} {form.zip}</p>
                  <p className="text-white/50 text-sm">{form.phone}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">Payment Method</h3>
                    <button onClick={() => setStep(2)} className="text-amber-400 text-xs hover:underline">Edit</button>
                  </div>
                  <p className="text-white/60 text-sm">
                    {form.payMethod === 'card' ? `Card ending in ${form.cardNumber.slice(-4) || '••••'}` :
                     form.payMethod === 'easypaisa' ? 'Easypaisa' : 'Cash on Delivery'}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-4">Items ({cart.length})</h3>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.cartItemId} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-white/40 text-xs">Size: {item.size || 'N/A'} · Qty: {item.quantity}</p>
                        </div>
                        <span className="text-amber-400 font-bold text-sm">Rs {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {orderError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-red-400 text-sm">{orderError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="px-6 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-2xl transition-colors">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.01]"
                >
                  {placing ? 'Placing Order...' : `Place Order · Rs ${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-28">
            <h3 className="font-black text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.cartItemId} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-black text-xs font-black rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name}</p>
                    <p className="text-white/40 text-xs">{item.size}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0">Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm"><span className="text-white/40">Subtotal</span><span>Rs {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/40">Shipping</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'Free' : `Rs ${shipping}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/40">Discount</span><span className="text-green-400">-Rs {discount.toLocaleString()}</span></div>
              <div className="flex justify-between font-black text-lg border-t border-white/10 pt-3 mt-1">
                <span>Total</span>
                <span className="text-amber-400">Rs {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
