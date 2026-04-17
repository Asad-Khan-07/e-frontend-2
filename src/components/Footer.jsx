import { Copyright } from 'lucide-react'
import React from 'react'

function Footer() {
    return (
    <>
         {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-12 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-sm">M</div>
            <span className="text-xl font-black">MEGA<span className="text-amber-400">.</span></span>
          </div>
          <p className="text-white/30 text-sm flex items-center gap-2"><Copyright size={15} /> 2026 Vault. All rights reserved.</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    
    </>    
    )
}

export default Footer
