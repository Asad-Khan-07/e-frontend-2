import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/context'
import { TypeAnimation } from 'react-type-animation'
import { Plus, Star } from 'lucide-react'
import CountUp from '../components/Countup'

function Hero() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80"
          alt="Hero"
          className={`w-full h-full object-cover ${isLight ? 'opacity-90 brightness-90' : 'opacity-100 brightness-90'}`}
        />
      </div>

      {/* Decorative Orb */}
      <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] pointer-events-none ${isLight ? 'bg-amber-300/20' : 'bg-amber-400/10'}`} />
      
      {/* Content Container */}
      <div className="relative w-full h-screen flex flex-col lg:flex-row">
        
        {/* Left Section - Full Height */}
        <div className={`w-full lg:w-1/2 xl:w-2/5 h-full flex flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-16 z-10 ${isLight ? 'bg-white/95' : 'bg-black/95'}`}>
          <div className="max-w-xl mx-auto lg:mx-0 w-full  flex flex-col items-center justify-center gap-6 sm:gap-8 p-6 rounded-2xl">
            
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 shadow-2xl ${isLight ? 'bg-amber-400/10 border border-amber-300/40 shadow-slate-700' : 'bg-amber-400/10 border border-amber-400/30 shadow-amber-300'}`}>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className={`${isLight ? 'text-black' : 'text-amber-400'} text-sm font-medium`}>New Collection 2026</span>
            </div>

            {/* Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black h-32 sm:h-40 leading-tight mb-6 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <TypeAnimation
                sequence={[
                  'DRESS YOUR\nAMBITION', 2000,
                  'WEAR YOUR\nSUCCESS', 2000,
                  'STYLE YOUR\nFUTURE', 2000,
                  'LIVE YOUR\nLEGACY', 2000,
                  'OWN YOUR\nSTORY', 2000,
                ]}
                wrapper="span"
                speed={50}
                style={{ display: 'inline-block', whiteSpace: 'pre-line' }}
                repeat={Infinity}
                cursor={false}
              />
            </h1>

            {/* Description */}
            <p className={`text-base sm:text-lg mb-8 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
              Premium streetwear and lifestyle products curated for those who refuse to blend in.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/products"
                className={`bg-amber-400 hover:bg-amber-300 shadow-2xl ${isLight ? 'shadow-slate-700' : 'shadow-amber-300'} text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all hover:scale-105 text-center`}
              >
                Shop Now
              </Link>
              <Link
                to="/products"
                className={`shadow-2xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold transition-all hover:scale-105 text-center ${isLight ? 'shadow-slate-700 border border-slate-800 text-slate-950 hover:border-slate-400 hover:bg-slate-100' : 'border border-amber-300 shadow-amber-300 text-white hover:border-amber-300/50 hover:bg-white/5'}`}
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Right Stats Section */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center w-full max-w-3xl">
            <div className={`flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-4 rounded-2xl p-6 sm:p-8 backdrop-blur-md w-full ${isLight ? 'bg-white/20' : 'bg-white/10'}`}>
              {[
                { to: 50, suffix: 'K+', label: 'Happy Customers', Icon: Plus },
                { to: 200, suffix: '+', label: 'Products', Icon: Plus },
                { to: 4.9, suffix: '', label: 'Average Rating', Icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center flex flex-col items-center sm:px-4">
                  <p className={`text-3xl sm:text-4xl md:text-5xl font-black flex items-center justify-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    <CountUp
                      to={stat.to}
                      from={0}
                      duration={2}
                    />
                    <stat.Icon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </p>
                  <p className={`text-sm sm:text-base md:text-lg mt-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero