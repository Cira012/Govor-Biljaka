import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Leaf, X } from "lucide-react";

// Import the plants data
import { plantsData } from "../data/plantData";

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

export default function Collection() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sort plants by name
  const sortedPlants = [...plantsData].sort((a, b) => a.name.localeCompare(b.name));

  // Filter plants based on search term
  const filteredPlants = sortedPlants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plant.scientificName && plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-50 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-12 group">
        <div className="inline-block transform transition-all duration-500 hover:scale-105">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-amber-600 tracking-wide">
            Herbarium Vivum
          </h1>
          <p className="text-sm md:text-base text-amber-700/90 italic mt-2 tracking-wider font-montserrat">
            Flora et herbaria &mdash; naturae thesaurus
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto mt-3 rounded-full shadow-md transform transition-all duration-500 group-hover:w-32 group-hover:from-emerald-500 group-hover:to-amber-500" />
        </div>
        
        {/* Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-amber-500" />
            </div>
            <input
              type="text"
              placeholder="Pretraži biljke..."
              className="w-full px-12 py-3.5 text-base rounded-xl border-2 border-amber-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-sm focus:shadow-lg focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <p className="text-sm text-emerald-700/80 mt-3 font-medium">
            {filteredPlants.length} {filteredPlants.length === 1 ? 'biljka pronađena' : 'biljaka pronađeno'}
          </p>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="max-w-7xl mx-auto px-2">
        {filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <Link
                key={plant.id}
                to={`/collection/${plant.id}`}
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
                      <h3 className="text-lg font-bold text-gray-900 truncate leading-tight">
                        {plant.name}
                      </h3>
                      {plant.scientificName && (
                        <p className="text-sm text-gray-600 italic truncate">
                          {plant.scientificName}
                        </p>
                      )}
                    </div>
                    
                    {/* Flowering season */}
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0">
                      {plant.floweringSeason}
                    </span>
                  </div>
                  
                  {/* Location info */}
                  {plant.locations && plant.locations.length > 0 && (
                    <div className="flex items-center text-xs text-gray-600 mt-2.5">
                      <MapPin className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">
                        {plant.locations[0].location}
                        {plant.locations.length > 1 && ` +${plant.locations.length - 1}`}
                      </span>
                    </div>
                  )}
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
