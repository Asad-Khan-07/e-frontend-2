import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <>
           <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        {/* Decorative Orb */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">New Collection 2025</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-none mb-6">
              DRESS YOUR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                AMBITION
              </span>
            </h1>

            <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg">
              Premium streetwear and lifestyle products curated for those who refuse to blend in. Quality that speaks before you do.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
              >
                Shop Now
              </Link>
              <Link
                to="/products"
                className="border border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-full transition-all hover:bg-white/5"
              >
                View Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-16">
              {[
                { value: '50K+', label: 'Happy Customers' },
                { value: '200+', label: 'Products' },
                { value: '4.9★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
        
        </>
    )
}

export default Hero
