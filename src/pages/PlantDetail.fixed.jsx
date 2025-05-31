import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Maximize2, Minimize2, ArrowLeft, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { plantsData } from '../data/plantData';
import './PlantDetail.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Sample location data for plants (multiple locations per plant)
const plantLocations = {
  1: [
    { lat: 44.8200, lng: 20.4600, location: 'Beograd, Srbija' },
    { lat: 45.2671, lng: 19.8335, location: 'Novi Sad, Srbija' },
    { lat: 43.8563, lng: 18.4131, location: 'Sarajevo, BiH' },
    { lat: 44.7722, lng: 17.1910, location: 'Banja Luka, BiH' },
    { lat: 45.8000, lng: 15.9000, location: 'Zagreb, Hrvatska' },
    { lat: 46.1512, lng: 14.9955, location: 'Ljubljana, Slovenija' },
    { lat: 42.4602, lng: 19.2595, location: 'Podgorica, Crna Gora' },
    { lat: 42.0000, lng: 21.4333, location: 'Skoplje, Severna Makedonija' },
    { lat: 41.3275, lng: 19.8187, location: 'Tirana, Albanija' },
    { lat: 44.4268, lng: 26.1025, location: 'Bukurešt, Rumunija' }
  ],
  2: [
    { lat: 44.0165, lng: 21.0059, location: 'Kragujevac, Srbija' },
    { lat: 44.0128, lng: 20.9114, location: 'Kraljevo, Srbija' },
    { lat: 43.8563, lng: 18.4131, location: 'Sarajevo, BiH' }
  ],
  3: [
    { lat: 45.2671, lng: 19.8335, location: 'Novi Sad, Srbija' },
  ]
};

// Helper function to get plant locations
const getPlantLocations = (plantId) => {
  return plantLocations[plantId] || [];
};

// Get plant by ID
const getPlantById = (id) => {
  return plantsData.find(plant => plant.id === parseInt(id)) || null;
};

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get plant data
  const plant = getPlantById(id);
  const locations = getPlantLocations(parseInt(id));
  
  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter] = useState(plant?.lat && plant?.lng ? [plant.lat, plant.lng] : [44.0165, 21.0059]);
  const [zoom, setZoom] = useState(7);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
  };
  
  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setZoom(12);
  };

  if (!plant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Plant not found</h2>
          <p className="text-lg text-gray-600 mb-6">The requested plant could not be found.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-800 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Collection
        </button>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Plant Image */}
            <div className="md:w-1/2 relative">
              <img 
                src={plant.image} 
                alt={plant.name}
                className={`w-full h-64 md:h-full object-cover ${isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen object-contain bg-black bg-opacity-90 p-8' : ''}`}
                onClick={toggleFullscreen}
              />
              <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
            
            {/* Plant Details */}
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-emerald-800">{plant.name}</h1>
                  <p className="text-lg text-gray-600 italic">{plant.scientificName}</p>
                </div>
                <button 
                  onClick={toggleMap}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <MapIcon className="w-5 h-5 mr-2" />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700">{plant.description || 'No description available.'}</p>
              </div>
              
              {/* Map Section */}
              {showMap && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Locations</h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={zoom} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {locations.map((loc, index) => (
                        <Marker 
                          key={`${loc.lat}-${loc.lng}-${index}`} 
                          position={[loc.lat, loc.lng]}
                          icon={L.icon({
                            iconUrl: '/marker-icon.png',
                            iconRetinaUrl: '/marker-icon-2x.png',
                            shadowUrl: '/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                          })}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-semibold">{loc.location}</p>
                              <p>Lat: {loc.lat.toFixed(4)}</p>
                              <p>Lng: {loc.lng.toFixed(4)}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              )}
              
              {/* Location List */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Found In</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {locations.length > 0 ? (
                    locations.map((loc, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          handleLocationSelect(loc);
                          if (!showMap) setShowMap(true);
                        }}
                      >
                        <MapPin className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">{loc.location}</p>
                          <p className="text-sm text-gray-500">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No location data available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
