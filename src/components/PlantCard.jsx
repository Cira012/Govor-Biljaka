import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Leaf, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import ImageWithFallback from './ImageWithFallback';

const PlantCard = ({ plant, index }) => {
  const hasLocations = plant.locations && plant.locations.length > 0;
  const isFlowering = isFloweringNow(plant.floweringSeason);
  const lastSeen = hasLocations ? getRelativeTime(plant.locations[0]?.date) : null;

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      data-testid="plant-card"
      data-plant-id={plant.id}
      style={{
        opacity: 0,
        animation: `fadeIn 0.3s ease-out forwards ${index * 0.05}s`,
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <Link to={`/vrste/${plant.id}`} className="block h-full">
          <ImageWithFallback
            src={plant.image}
            alt={plant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {isFlowering && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            U cvetu
          </span>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/vrste/${plant.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {plant.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium mb-2">
            {plant.scientificName}
          </p>
        </Link>
        
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          {plant.floweringSeason && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{plant.floweringSeason}</span>
            </div>
          )}
          
          {hasLocations && lastSeen && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">
                {plant.locations[0].location} • {lastSeen}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const isFloweringNow = (floweringSeason) => {
  if (!floweringSeason) return false;
  
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthNames = [
    'januar', 'februar', 'mart', 'april', 'maj', 'jun',
    'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'
  ];
  
  const currentMonthName = monthNames[currentMonth - 1].substring(0, 3);
  return floweringSeason.toLowerCase().includes(currentMonthName);
};

const getRelativeTime = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Danas';
    if (diffInDays === 1) return 'Juče';
    if (diffInDays < 7) return `Pre ${diffInDays} dana`;
    if (diffInDays < 30) return `Pre ${Math.floor(diffInDays / 7)} nedelje`;
    
    return formatDate(dateString);
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Nema podataka';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Nevažeći datum';
    
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\./g, '.');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Greška u datumu';
  }
};

PlantCard.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    scientificName: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    floweringSeason: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.shape({
      location: PropTypes.string.isRequired,
      date: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
    })),
  }).isRequired,
  index: PropTypes.number,
};

export default React.memo(PlantCard);
