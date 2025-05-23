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
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/zbirka?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/zbirka');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-900/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-white text-2xl font-bold">
              Cvetni Fenolog
            </Link>
          </div>
        </div>
      </nav>

      {/* Video Background */}
      <div className="relative h-screen w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/forest.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        {/* Hero Content Over Video */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <h1 className="hero-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight font-serif">
              Pratimo Prirodu Zajedno
            </h1>
            <p className="hero-subheading text-xl md:text-2xl text-blue-100 mb-8 tracking-wider max-w-3xl mx-auto">
              Pridružite se naučnom projektu praćenja fenologije biljaka
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex shadow-xl rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-6 py-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pronađite biljku..."
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Pretraži
                </button>
              </div>
            </form>
            
            <div className="mt-12">
              <Link
                to="/zbirka"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-700 text-lg font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Pregledajte celu zbirku
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
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
