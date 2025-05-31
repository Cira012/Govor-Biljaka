import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { plantsData } from '../data/plantData';
import './PlantDetail.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Verified plant locations with additional details
const plantLocations = {
  // Mentha Spicata (Nana)
  1: [
    { 
      lat: 44.8200, 
      lng: 20.4600, 
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Found near the lake shore, thriving in moist soil.',
      date: '2024-05-15'
    },
    { 
      lat: 44.8186, 
      lng: 20.4541, 
      location: 'Košutnjak Park, Beograd',
      verified: true,
      description: 'Growing in partial shade near walking paths.',
      date: '2024-05-18'
    },
    { 
      lat: 45.2671, 
      lng: 19.8335, 
      location: 'Fruška Gora National Park',
      verified: true,
      description: 'Abundant in forest clearings and near streams.',
      date: '2024-05-10'
    },
    { 
      lat: 43.8563, 
      lng: 18.4131, 
      location: 'Vrelo Bosne, Sarajevo',
      verified: true,
      description: 'Growing along riverbanks in the park.',
      date: '2024-05-20'
    },
    { 
      lat: 44.7722, 
      lng: 17.1910, 
      location: 'Banja Luka City Park',
      verified: true,
      description: 'Found in urban park environment.',
      date: '2024-05-12'
    }
  ],
  // Ljubičica (Viola odorata)
  4: [
    {
      lat: 44.8167,
      lng: 20.4667,
      location: 'Avala Mountain',
      verified: true,
      description: 'Forest clearings and edges, partial shade.',
      date: '2024-04-05'
    },
    {
      lat: 44.6693,
      lng: 20.6863,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Deciduous forests, often near streams.',
      date: '2024-04-12'
    },
    {
      lat: 43.6189,
      lng: 21.8962,
      location: 'Sićevo Gorge',
      verified: true,
      description: 'Rocky slopes and forest edges.',
      date: '2024-04-18'
    },
    {
      lat: 43.7229,
      lng: 19.6938,
      location: 'Tara National Park',
      verified: true,
      description: 'Mountain meadows and mixed forests.',
      date: '2024-04-22'
    },
    {
      lat: 43.3333,
      lng: 21.9000,
      location: 'Niš City Park',
      verified: true,
      description: 'Urban park environment, well-maintained areas.',
      date: '2024-04-15'
    }
  ],
  // Vrba Iva (Salix caprea L.)
  12: [
    {
      lat: 44.7692,
      lng: 20.4644,
      location: 'Ada Huja, Beograd',
      verified: true,
      description: 'Riverbanks and wet areas, early spring bloomer.',
      date: '2024-03-10'
    },
    {
      lat: 45.2500,
      lng: 19.8500,
      location: 'Fruška Gora - Stražilovo',
      verified: true,
      description: 'Forest edges and clearings, sunny positions.',
      date: '2024-03-15'
    },
    {
      lat: 44.0165,
      lng: 21.0059,
      location: 'Šumarak Forest, Kragujevac',
      verified: true,
      description: 'Mixed forests, prefers moist soil.',
      date: '2024-03-08'
    },
    {
      lat: 43.3247,
      lng: 21.9033,
      location: 'Nišava River Banks',
      verified: true,
      description: 'Along riverbanks and in wet meadows.',
      date: '2024-03-12'
    },
    {
      lat: 43.1367,
      lng: 20.5122,
      location: 'Kopaonik National Park',
      verified: true,
      description: 'Mountain streams and wet areas.',
      date: '2024-03-20'
    }
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
  
  // Map state
  const [mapCenter, setMapCenter] = useState([44.8200, 20.4600]);
  const [zoom, setZoom] = useState(13);
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Set initial selected location
  useEffect(() => {
    if (locations.length > 0) {
      setSelectedLocation(locations[0]);
      setMapCenter([locations[0].lat, locations[0].lng]);
    }
  }, [id, locations]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setZoom(14);
  };

  if (!plant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Plant not found</h2>
          <p className="text-gray-600 mb-6">The requested plant could not be found in our database.</p>
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
    <div className="min-h-screen bg-emerald-50 p-4">
      <div className="container mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-800 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Collection
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Plant image */}
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6 h-full flex items-center justify-center">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="max-h-96 w-auto object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/plants/placeholder-plant.png';
                      e.target.classList.add('opacity-30');
                    }}
                  />
                </div>
              </div>

              {/* Plant details */}
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-emerald-900 mb-2">{plant.name}</h1>
                <p className="text-emerald-700 italic mb-4">{plant.scientificName}</p>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">{plant.description}</p>
                </div>

                {/* Map section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-emerald-900">Locations</h2>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      {showMap ? 'Hide Map' : 'Show Map'}
                      <MapIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {showMap && (
                    <div className="h-96 rounded-lg overflow-hidden mb-6 border border-gray-200">
                      <MapContainer
                        center={mapCenter}
                        zoom={zoom}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        whenCreated={(map) => {
                          mapRef.current = map;
                          map.on('zoomend', () => setZoom(map.getZoom()));
                        }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {locations.map((loc, idx) => {
                          const isSelected = selectedLocation && 
                                         selectedLocation.lat === loc.lat && 
                                         selectedLocation.lng === loc.lng;
                          
                          return (
                            <Marker
                              key={idx}
                              position={[loc.lat, loc.lng]}
                              eventHandlers={{
                                click: () => handleLocationSelect(loc),
                              }}
                              icon={L.icon({
                                iconUrl: isSelected ? markerIcon2x : markerIcon,
                                iconSize: isSelected ? [35, 56] : [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowUrl: markerShadow,
                                shadowSize: [41, 41],
                              })}
                            >
                              <Popup>
                                <div className="font-medium">{loc.location}</div>
                                <div className="text-sm text-gray-600">{loc.date}</div>
                                <div className="text-sm mt-1">{loc.description}</div>
                              </Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
                    </div>
                  )}

                  {/* Location details */}
                  {selectedLocation && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                        {selectedLocation.location}
                        {selectedLocation.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Verified Location
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 mb-3">{selectedLocation.description}</p>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-2">
                        <span>Last seen: {selectedLocation.date}</span>
                        <span>•</span>
                        <span>
                          Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
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
