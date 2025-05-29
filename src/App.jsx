import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import Collection from "./pages/Collection";
import PlantDetail from "./pages/PlantDetail";

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

function Home() {
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
        <h1 className="text-8xl md:text-9xl text-white mb-14 font-['Playfair_Display'] font-bold tracking-tight leading-tight">
          <span className="block text-7xl md:text-8xl mb-3">GOVOR</span>
          <span className="block text-8xl md:text-9xl">BILJAKA</span>
        </h1>
        <Link
          to="/zbirka"
          className="relative px-16 py-5 text-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-['Poppins'] font-semibold rounded-full
                    hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transform transition-all duration-300
                    border-2 border-white/20 overflow-hidden group"
          onClick={() => navigate('/zbirka')}
        >
          <span className="relative z-10 flex items-center">
            <span className="mr-2">Uđi</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/zbirka" element={<Collection />} />
      <Route path="/vrste/:id" element={<PlantDetail />} />
    </Routes>
  );
}

export default App;
