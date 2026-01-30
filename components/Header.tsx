
import React from 'react';

interface HeaderProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminToggle, isAdmin, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="bg-white text-black px-3 py-1 font-black text-2xl rounded-sm tracking-tighter select-none">
              SYM
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-black text-sm md:text-base leading-tight tracking-tight">STRENGTHEN YOUR MIND</span>
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">Premium Footwear</span>
            </div>
          </div>
          
          {/* Search Bar - Center */}
          <div className="flex-grow max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="BUSCAR MODELO..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-[10px] font-black tracking-widest uppercase rounded-sm py-2.5 pl-10 pr-4 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Admin Access Button */}
          <nav className="flex items-center flex-shrink-0">
            <button 
              onClick={onAdminToggle}
              className={`px-4 sm:px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                isAdmin 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
              }`}
            >
              {isAdmin ? "Admin: ON" : "Acceso"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
