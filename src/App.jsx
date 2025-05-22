import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import Collection from "./pages/Collection";
import PlantDetail from "./pages/PlantDetail";

// Sample featured plants data - in a real app, this would come from an API
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

// Current season - in a real app, this would be dynamic
const currentSeason = 'proleće';
const seasonalHighlights = [
  { name: 'Jorgovan', period: 'april-maj' },
  { name: 'Trešnjin cvet', period: 'mart-april' },
  { name: 'Zumbul', period: 'mart-maj' },
  { name: 'Ljiljan', period: 'maj-jun' }
];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/collection');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="hero-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
              Govor Biljaka
            </h1>
            <p className="hero-subheading text-lg md:text-xl text-emerald-100 mb-8 tracking-wider">
              Istražite svet lekovitog bilja i njegovu upotrebu
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Pronađite biljku..."
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Pretraži
                </button>
              </div>
            </form>
            
            <div className="mt-8">
              <Link
                to="/collection"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50"
              >
                🌿 Pregledajte celu kolekciju
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-gradient-to-b from-emerald-900 to-emerald-700">
        {/* Featured Plants */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Istražite našu kolekciju
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-emerald-100 sm:mt-4">
                Otkrijte raznovrsnost biljnog sveta kroz naše najpopularnije biljke
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPlants.map((plant) => (
                <div key={plant.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative pt-[120%] bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-lg border-2 border-emerald-200 bg-white p-2">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    {/* Decorative corner elements */}
                    <div className="absolute left-0 top-0 h-8 w-8 -translate-x-1 -translate-y-1 rotate-45 transform border-l-2 border-t-2 border-emerald-300"></div>
                    <div className="absolute right-0 top-0 h-8 w-8 translate-x-1 -translate-y-1 -rotate-45 transform border-r-2 border-t-2 border-emerald-300"></div>
                    <div className="absolute bottom-0 left-0 h-8 w-8 -translate-x-1 translate-y-1 -rotate-45 transform border-b-2 border-l-2 border-emerald-300"></div>
                    <div className="absolute bottom-0 right-0 h-8 w-8 translate-x-1 translate-y-1 rotate-45 transform border-b-2 border-r-2 border-emerald-300"></div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      <Link to={`/collection/${plant.id}`} className="hover:text-emerald-600 transition-colors">
                        {plant.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
                    <p className="text-sm text-gray-600 mt-auto">{plant.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/collection"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Vidi sve biljke
                <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Seasonal Highlights */}
        <div className="bg-emerald-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-emerald-900 sm:text-4xl">
                Sezonski vodič
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-emerald-700">
                Šta trenutno cveti u {currentSeason}?
              </p>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
                  {seasonalHighlights.map((plant, index) => (
                    <div key={index} className="p-4 border border-emerald-100 rounded-lg bg-emerald-50">
                      <h3 className="text-lg font-medium text-emerald-900">{plant.name}</h3>
                      <p className="mt-1 text-sm text-emerald-600">Cveta: {plant.period}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-emerald-600">
                    Želite da znate više o sezonskim biljkama?{' '}
                    <Link to="/collection" className="font-medium text-emerald-700 hover:text-emerald-600">
                      Pogledajte naš kalendar cvetanja
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Istražite svet lekovitog bilja</span>
              <span className="block">zajedno s nama</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-emerald-100">
              Pridružite se zajednici koja neguje znanje o lekovitom bilju i tradicionalnoj medicini.
            </p>
            <Link
              to="/collection"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 sm:w-auto transition-colors duration-200"
            >
              Istražite kolekciju
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App font-['Crimson_Pro']">
      <Routes>
        {/* 🌿 HOMEPAGE */}
        <Route path="/" element={<Home />} />
        
        {/* 📚 COLLECTION + DETAIL */}
        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:id" element={<PlantDetail />} />
      </Routes>
    </div>
  );
}

export default App;
