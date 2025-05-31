import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Leaf, X, BarChart2, Info, BookOpen, Filter, Clock, Calendar, Thermometer, Sun } from "lucide-react";

// Import the plants data and locations
import { plantsData } from "../data/plantData";
import { plantLocations } from "./PlantDetail";

// Helper function to get plant by ID
const getPlantById = (id) => {
  return plantsData.find(plant => plant.id === parseInt(id)) || null;
};

// Helper function to get plant locations
const getPlantLocations = (plantId) => {
  // First check if the plant has specific locations in plantLocations
  if (plantLocations[plantId]) {
    return plantLocations[plantId];
  }
  
  // If not, try to get the plant data and return its locations if they exist
  const plant = getPlantById(plantId);
  if (plant && plant.locations) {
    return Array.isArray(plant.locations) ? plant.locations : [];
  }
  
  // If no locations found, return empty array
  return [];
};

// Scientific project data
const projectInfo = {
  title: "Fenološki Monitoring Biljnih Vrsta",
  subtitle: "Građanska nauka u praćenju klimatskih promena",
  objective: "Ovaj projekat ima za cilj praćenje fenoloških fenomena biljnih vrsta u Srbiji, sa fokusom na uticaj klimatskih promena na njihov životni ciklus.",
  methodology: "Podaci se prikupljaju kroz terenska posmatranja i učešće građana, sa standardizovanim protokolima za beleženje fenoloških faza.",
  importance: "Praćenje fenologije biljaka ključno je za razumevanje ekosistemskih promena i prilagođavanje poljoprivrednih praksi."
};

// Scientific classification helper
const getScientificClassification = (plant) => {
  return {
    'Kraljevstvo': 'Plantae',
    'Odeljenje': 'Magnoliophyta',
    'Klasa': 'Magnoliopsida',
    'Red': plant.family === 'Rosaceae' ? 'Rosales' : 
           plant.family === 'Lamiaceae' ? 'Lamiales' :
           plant.family === 'Asteraceae' ? 'Asterales' : 'Nepoznato',
    'Porodica': plant.family || 'Nepoznato',
    'Rod': plant.scientificName ? plant.scientificName.split(' ')[0] : 'Nepoznato'
  };
};

// Add fallback image for missing plant images
const fallbackImage = "/assets/plants/mentha-spicata.png";

// Custom Image component with fallback and loading state
const ImageWithFallback = ({ src, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      setImgSrc(src);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      setIsLoading(false);
      setHasError(true);
      setImgSrc(fallbackImage);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          ...style,
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        onError={(e) => {
          if (!hasError) {
            e.target.onerror = null;
            setHasError(true);
            setImgSrc(fallbackImage);
          }
        }}
      />
    </div>
  );
};

// Calculate statistics
const calculateStats = (plants) => {
  const families = new Set();
  const floweringMonths = new Set();
  const allLocations = new Set();
  
  plants.forEach(plant => {
    // Count families
    if (plant.family) families.add(plant.family);
    
    // Count flowering months
    if (plant.floweringSeason) {
      const months = plant.floweringSeason.toLowerCase()
        .split(/[^a-zčćšđž]+/)
        .filter(Boolean);
      months.forEach(month => floweringMonths.add(month));
    }
    
    // Count unique locations using getPlantLocations
    const locations = getPlantLocations(plant.id);
    locations.forEach(location => {
      allLocations.add(location.location);
    });
  });
  
  return {
    totalPlants: plants.length,
    totalFamilies: families.size,
    totalFloweringMonths: floweringMonths.size,
    totalLocations: allLocations.size,
    averageLocations: (allLocations.size > 0 ? (allLocations.size / plants.length).toFixed(1) : '0.0')
  };
};

export default function Collection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("sve");
  const [showMethodology, setShowMethodology] = useState(false);
  
  // Sort plants by name
  const sortedPlants = useMemo(() => 
    [...plantsData].sort((a, b) => a.name.localeCompare(b.name)),
    [plantsData]
  );

  // Filter plants based on search term and active filter
  const filteredPlants = useMemo(() => 
    sortedPlants.filter(plant => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.scientificName && plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (activeFilter === "sve") return matchesSearch;
      if (activeFilter === "cvetaju") {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const monthNames = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
        const currentMonthName = monthNames[currentMonth - 1];
        return matchesSearch && 
               plant.floweringSeason && 
               plant.floweringSeason.toLowerCase().includes(currentMonthName.slice(0, 3));
      }
      return matchesSearch && plant.family === activeFilter;
    }),
    [searchTerm, sortedPlants, activeFilter]
  );

  // Get unique families for filter
  const plantFamilies = useMemo(() => {
    const families = new Set();
    plantsData.forEach(plant => {
      if (plant.family) families.add(plant.family);
    });
    return Array.from(families).sort();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(filteredPlants), [filteredPlants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-50 p-4 md:p-8">
      {/* Scientific Project Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
            {projectInfo.title}
          </h1>
          <p className="text-lg text-emerald-700 mb-6 max-w-3xl mx-auto">
            {projectInfo.subtitle}
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto rounded-full" />
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-emerald-500">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <Info className="mr-2 h-5 w-5" /> O projektu
          </h2>
          <p className="text-gray-700 mb-4">{projectInfo.objective}</p>
          <button 
            onClick={() => setShowMethodology(!showMethodology)}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center"
          >
            {showMethodology ? 'Sakrij metodologiju' : 'Prikaži metodologiju istraživanja'}
            <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${showMethodology ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showMethodology && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-800 mb-2">Metodologija istraživanja:</h3>
              <p className="text-gray-700">{projectInfo.methodology}</p>
              <h4 className="font-medium text-emerald-800 mt-3 mb-1">Važnost istraživanja:</h4>
              <p className="text-gray-700">{projectInfo.importance}</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-900">Ukupno biljaka</h3>
              <Leaf className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-800">{stats.totalPlants}</p>
            <p className="text-xs text-emerald-600 mt-1">različitih vrsta</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-900">Botaničke porodice</h3>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-800">{stats.totalFamilies}</p>
            <p className="text-xs text-emerald-600 mt-1">različitih porodica</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-900">Ukupno lokacija</h3>
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-800">{stats.totalLocations}</p>
            <p className="text-xs text-emerald-600 mt-1">zabeleženih lokacija</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-emerald-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-900">Meseci cvetanja</h3>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-800">{stats.totalFloweringMonths}</p>
            <p className="text-xs text-emerald-600 mt-1">različitih meseci</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <Search className="mr-2 h-5 w-5" /> Pretraga i filtri
          </h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-500" />
            </div>
            <input
              type="text"
              placeholder="Pretraži biljke po imenu ili naučnom nazivu..."
              className="w-full px-12 py-3.5 text-base rounded-xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-sm focus:shadow-lg focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("sve")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "sve"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sve vrste
            </button>
            <button
              onClick={() => setActiveFilter("cvetaju")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                activeFilter === "cvetaju"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Cvetaju sada
            </button>
            
            {plantFamilies.slice(0, 3).map(family => (
              <button
                key={family}
                onClick={() => setActiveFilter(family === activeFilter ? "sve" : family)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === family
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {family}
              </button>
            ))}
            
            {plantFamilies.length > 3 && (
              <div className="relative group">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                    activeFilter !== "sve" && activeFilter !== "cvetaju" && plantFamilies.includes(activeFilter)
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Još filtera
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-10 hidden group-hover:block hover:block">
                  {plantFamilies.slice(3).map(family => (
                    <button
                      key={family}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(family === activeFilter ? "sve" : family);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        activeFilter === family ? "text-emerald-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {family}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            {filteredPlants.length} {filteredPlants.length === 1 ? 'rezultat' : 'rezultata'} pronađeno
          </div>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="max-w-7xl mx-auto px-2">
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <Link
                key={plant.id}
                to={`/vrste/${plant.id}`}
                className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-emerald-100"
              >
                {/* Image container with natural aspect ratio */}
                <div className="relative w-full pt-[130%] bg-gradient-to-br from-emerald-50 to-green-50">
                  <div className="absolute inset-0 p-1 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <ImageWithFallback
                          src={plant.image}
                          alt={plant.name}
                          className="h-auto w-auto max-h-[120%] max-w-[120%] object-contain transition-all duration-500 group-hover:scale-[1.03] rounded-xl"
                          style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom card section */}
                <div className="p-5 bg-white flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                        {plant.name}
                      </h3>
                      {plant.scientificName && (
                        <p className="text-sm text-gray-600 italic truncate">
                          {plant.scientificName}
                        </p>
                      )}
                    </div>
                    
                    {/* Flowering season */}
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0 mb-1">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {plant.floweringSeason}
                      </span>
                      {plant.family && (
                        <span className="text-xs font-medium text-amber-700 bg-amber-100/70 rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0">
                          {plant.family}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Scientific Classification */}
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(getScientificClassification(plant)).map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="font-medium text-gray-600">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location and observation info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {(() => {
                      const locations = getPlantLocations(plant.id);
                      if (locations.length > 0) {
                        return (
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <MapPin className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0" />
                            <span className="truncate">
                              {locations[0].location}
                              {locations.length > 1 && ` +${locations.length - 1}`}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {plant.lastObservation && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 text-amber-500 flex-shrink-0" />
                        Poslednje posmatranje: {plant.lastObservation}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-50">
            <div className="text-7xl mb-6 transform transition-transform duration-500 hover:scale-110 inline-block">🌿</div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2 font-playfair italic">
              Herbarium Vivum
            </h1>
            <p className="text-emerald-700/90 mb-6">Pokušajte sa drugim pojmom za pretragu</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-50"
            >
              Poništi pretragu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
