import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, NavLink } from "react-router-dom";
import { motion } from 'framer-motion';
import Collection from "./pages/Collection";
import PlantDetail from "./pages/PlantDetail";
import PlantCapture from "./components/PlantCapture";
import Observations from "./pages/Observations";
import { Camera, Home, BookOpen, List } from 'lucide-react';

// Sample featured plants data
export const featuredPlants = [
  {
    id: 1,
    name: "Mentha Spicata",
    scientificName: "Mentha spicata",
    image: "/assets/plants/mentha-spicata.png",
    description: "Mirisiše sveže i koristi se u kulinarstvu i medicini."
  },
  {
    id: 4,
    name: "Ljubičica",
    scientificName: "Viola odorata",
    image: "/assets/plants/violet.png",
    description: "Mirisni cvetovi koji označavaju dolazak proleća."
  },
  {
    id: 12,
    name: "Vrba Iva",
    scientificName: "Salix caprea L.",
    image: "/assets/plants/VRBA_IVA_-_Salix_caprea_20250507T174859.png",
    description: "Rani cvet koji je važan izvor polena za pčele."
  },
  {
    id: 14,
    name: "Mrazovac",
    scientificName: "Colchicum autumnale L.",
    image: "/assets/plants/MRAZOVAC_-_Colchicum_autumnale_20250507T174732.png",
    description: "Poznat i kao jesenji šafran, cveti u jesen."
  }
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/forest.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center transform -translate-y-16 text-center px-4">
        <div className="relative mb-16 text-center">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-white mb-2">
            <span className="block text-7xl md:text-8xl">GOVOR</span>
            <span className="block text-8xl md:text-9xl">BILJAKA</span>
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-transparent -z-10 rounded-full blur-2xl opacity-70" style={{
            transform: 'translateY(10%) scale(1.1)',
            filter: 'blur(60px)'
          }} />
        </div>
        <Link
          to="/zbirka"
          className="relative px-28 py-6 text-2xl font-bold text-white font-['Poppins'] rounded-full 
                    overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-2xl
                    hover:shadow-green-500/40 min-w-[280px]"
          onClick={() => navigate('/zbirka')}
        >
          {/* Main gradient background */}
          <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-500"></span>
          
          {/* Plant decoration - left */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/90">
              <path d="M12 2C12 2 7 7.5 7 12C7 15 9 17 12 17C15 17 17 15 17 12C17 7.5 12 2 12 2Z" fill="currentColor" />
              <path d="M12 17V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          
          {/* Plant decoration - right */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 group-hover:opacity-100 transition-opacity duration-300 rotate-180">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/90">
              <path d="M12 2C12 2 7 7.5 7 12C7 15 9 17 12 17C15 17 17 15 17 12C17 7.5 12 2 12 2Z" fill="currentColor" />
              <path d="M12 17V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          
          {/* Shine effect */}
          <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine transition-all duration-500"></span>
          
          {/* Button content */}
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl tracking-wide">ISTRAŽI ZBIRKU</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
          </span>
          
          {/* Border glow */}
          <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Govor Biljaka</h1>
          <nav className="flex space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded ${isActive ? 'bg-green-600' : 'hover:bg-green-600'}`
              }
            >
              <Home className="mr-1 h-4 w-4" />
              <span>Početna</span>
            </NavLink>
            <NavLink 
              to="/snimi" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded ${isActive ? 'bg-green-600' : 'hover:bg-green-600'}`
              }
            >
              <Camera className="mr-1 h-4 w-4" />
              <span>Snimi biljku</span>
            </NavLink>
            <NavLink 
              to="/zbirka" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded ${isActive ? 'bg-green-600' : 'hover:bg-green-600'}`
              }
            >
              <BookOpen className="mr-1 h-4 w-4" />
              <span>Zbirka</span>
            </NavLink>
            <NavLink 
              to="/zapazanja" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded ${isActive ? 'bg-green-600' : 'hover:bg-green-600'}`
              }
            >
              <List className="mr-1 h-4 w-4" />
              <span>Moja zapažanja</span>
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zbirka" element={<Collection />} />
          <Route path="/vrste/:id" element={<PlantDetail />} />
          <Route path="/snimi" element={<PlantCapture />} />
          <Route path="/zapazanja" element={<Observations />} />
        </Routes>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Govor Biljaka. Sva prava zadržana.</p>
      </footer>
    </div>
  );
}

export default App;
