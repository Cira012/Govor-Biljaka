import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Map as MapIcon, Minimize2, Maximize2 } from 'lucide-react';
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
  // Visibaba
  1: [
    { 
      lat: 44.8200, 
      lng: 20.4600, 
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Found in forested areas near the lake shore.',
      date: '2024-03-15'
    },
    { 
      lat: 44.8186, 
      lng: 20.4541, 
      location: 'Košutnjak Park, Beograd',
      verified: true,
      description: 'Growing in partial shade near walking paths.',
      date: '2024-03-18'
    },
    { 
      lat: 44.8167, 
      lng: 20.4667, 
      location: 'Avala Mountain',
      verified: true,
      description: 'Forest clearings and edges, partial shade.',
      date: '2024-03-10'
    },
    { 
      lat: 44.6693, 
      lng: 20.6863, 
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Deciduous forests and clearings.',
      date: '2024-03-12'
    },
    { 
      lat: 43.6189, 
      lng: 21.8962, 
      location: 'Sićevo Gorge',
      verified: true,
      description: 'Rocky slopes and forest edges.',
      date: '2024-03-20'
    }
  ],
  // Podbel (Konjsko kopito) - ID 2
  2: [
    {
      lat: 44.8150,
      lng: 20.4500,
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Found in wastelands and along roadsides.',
      date: '2024-04-05'
    },
    {
      lat: 44.6700,
      lng: 20.6900,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Growing in open areas and forest edges.',
      date: '2024-04-10'
    }
  ],
  // Mrazovac - ID 3
  3: [
    {
      lat: 44.8300,
      lng: 20.4500,
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Found in meadows and forest edges.',
      date: '2024-09-15'
    },
    {
      lat: 44.6800,
      lng: 20.7000,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Growing in forest clearings.',
      date: '2024-09-20'
    }
  ],
  // Ljubičica (Viola odorata) - ID 4
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
  // Vrba Iva (Salix caprea L.) - ID 5
  5: [
    {
      lat: 44.8150,
      lng: 20.4700,
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Growing near the lake shore.',
      date: '2024-03-25'
    },
    {
      lat: 44.8190,
      lng: 20.4520,
      location: 'Košutnjak Park, Beograd',
      verified: true,
      description: 'Found near small streams.',
      date: '2024-03-28'
    }
  ],
  // Divlji kesten (Aesculus hippocastanum) - ID 7
  7: [
    {
      lat: 44.8170,
      lng: 20.4570,
      location: 'Pioneers Park, Beograd',
      verified: true,
      description: 'Mature tree near the main promenade.',
      date: '2024-05-05'
    },
    {
      lat: 44.8180,
      lng: 20.4580,
      location: 'Studentski Park, Beograd',
      verified: true,
      description: 'Group of trees near the Faculty of Philosophy.',
      date: '2024-05-08'
    }
  ],
  // Bukva (Fagus sylvatica) - ID 9
  9: [
    {
      lat: 44.2691,
      lng: 19.8905,
      location: 'Tara National Park',
      verified: true,
      description: 'Beech forest on mountain slopes.',
      date: '2024-05-15'
    },
    {
      lat: 43.3914,
      lng: 20.5497,
      location: 'Golija Mountain',
      verified: true,
      description: 'Old-growth beech forest, UNESCO site.',
      date: '2024-05-20'
    }
  ],
  // Hrast lužnjak (Quercus robur) - ID 10
  10: [
    {
      lat: 45.0026,
      lng: 20.5162,
      location: 'Fruška Gora National Park',
      verified: true,
      description: 'Ancient oak in the forest.',
      date: '2024-05-10'
    },
    {
      lat: 44.8185,
      lng: 20.4520,
      location: 'Košutnjak Forest, Beograd',
      verified: true,
      description: 'Mature oak trees in the protected area.',
      date: '2024-05-12'
    }
  ],
  // Jasen (Fraxinus excelsior) - ID 11
  11: [
    {
      lat: 44.8175,
      lng: 20.4560,
      location: 'Pioneers Park, Beograd',
      verified: true,
      description: 'Along the walking paths.',
      date: '2024-05-08'
    },
    {
      lat: 44.6690,
      lng: 20.6860,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Mixed forest area.',
      date: '2024-05-15'
    }
  ],
  // Nana (Mentha spicata) - ID 14
  14: [
    {
      lat: 44.8150,
      lng: 20.4700,
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Near the lake shore, moist soil.',
      date: '2024-07-10'
    },
    {
      lat: 44.8186,
      lng: 20.4541,
      location: 'Košutnjak Park, Beograd',
      verified: true,
      description: 'Shaded area near the stream.',
      date: '2024-07-15'
    }
  ],
  // Maslačak (Taraxacum officinale) - ID 16
  16: [
    {
      lat: 44.8200,
      lng: 20.4600,
      location: 'Ada Ciganlija, Beograd',
      verified: true,
      description: 'Lawns and meadows throughout the park.',
      date: '2024-04-20'
    },
    {
      lat: 44.8180,
      lng: 20.4580,
      location: 'Studentski Park, Beograd',
      verified: true,
      description: 'Common in grassy areas.',
      date: '2024-04-22'
    }
  ],
  // Trnina (Prunus spinosa) - ID 6
  6: [
    {
      lat: 44.8160,
      lng: 20.4550,
      location: 'Košutnjak Forest, Beograd',
      verified: true,
      description: 'Thorny shrubs along the forest edge.',
      date: '2024-04-10'
    },
    {
      lat: 44.6700,
      lng: 20.6900,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Common in open areas and forest edges.',
      date: '2024-04-15'
    }
  ],
  // Zova (Sambucus nigra) - ID 13
  13: [
    {
      lat: 44.8170,
      lng: 20.4560,
      location: 'Pioneers Park, Beograd',
      verified: true,
      description: 'Growing near the stream in partial shade.',
      date: '2024-05-20'
    },
    {
      lat: 44.6695,
      lng: 20.6865,
      location: 'Kosmaj Mountain',
      verified: true,
      description: 'Common in forest edges and clearings.',
      date: '2024-05-25'
    }
  ],
  // Zova (Sambucus nigra) - ID 15 (duplicate entry)
  15: [
    {
      lat: 44.8180,
      lng: 20.4570,
      location: 'Studentski Park, Beograd',
      verified: true,
      description: 'Near the Faculty of Philosophy building.',
      date: '2024-05-22'
    },
    {
      lat: 44.6710,
      lng: 20.6870,
      location: 'Avala Mountain',
      verified: true,
      description: 'Forest edge near the hiking trail.',
      date: '2024-05-28'
    }
  ],
  // Jorgovan (Syringa vulgaris) - ID 12
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
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Set initial selected location
  useEffect(() => {
    if (locations.length > 0) {
      setSelectedLocation(locations[0]);
      setMapCenter([locations[0].lat, locations[0].lng]);
    }
  }, [id]);

  // Set initial map center when locations change
  useEffect(() => {
    if (locations.length > 0) {
      setMapCenter([locations[0].lat, locations[0].lng]);
    }
  }, [id]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setZoom(14);
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
    // Force map to update its size when toggling fullscreen
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-emerald-800 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Collection
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Plant image and basic info */}
        <div className="lg:w-2/5">
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl shadow-md overflow-hidden mb-6 h-[650px] flex items-center justify-center p-2">
            <img 
              src={plant.image} 
              alt={plant.name}
              className="max-w-[90%] max-h-[90%] object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/plants/mentha-spicata.png';
                e.target.classList.add('opacity-30');
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">{plant.name}</h1>
            {plant.scientificName && (
              <p className="text-lg text-amber-700 italic mb-4">{plant.scientificName}</p>
            )}
            {plant.description && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="text-lg font-medium text-emerald-800 mb-2">Opis</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{plant.description}</p>
              </div>
            )}
            {plant.floweringSeason && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Cveta:</span> {plant.floweringSeason}
              </p>
            )}
          </div>
        </div>

        {/* Map and locations */}
        <div className="lg:w-3/5">
          {/* Map Toggle Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-emerald-900">Lokacije</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                {showMap ? 'Sakrij mapu' : 'Prikaži mapu'}
                <MapIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Map */}
          {showMap && (
            <div 
              ref={mapContainerRef}
              className={`relative bg-white rounded-xl shadow-md overflow-hidden mb-6 ${
                isMapFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : 'h-[600px]'
              }`}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={toggleMapFullscreen}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={isMapFullscreen ? 'Minimize map' : 'Maximize map'}
                >
                  {isMapFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                className="w-full h-full z-0"
                whenCreated={(map) => {
                  mapRef.current = map;
                  map.on('zoomend', () => setZoom(map.getZoom()));
                }}
                style={{ minHeight: '500px' }}
                zoomControl={false}
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
                        <a 
                          href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 text-sm mt-2 block"
                        >
                          Open in Google Maps →
                        </a>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          )}
          <div className="mt-6">
            {/* Location details */}
            {selectedLocation && (
              <div className="mb-6 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-emerald-900 mb-3">
                  {selectedLocation.location}
                  {selectedLocation.verified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Verifikovana lokacija
                    </span>
                  )}
                </h3>
                <p className="text-gray-700">{selectedLocation.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>Last seen: {selectedLocation.date}</span>
                  <span className="mx-2">•</span>
                  <span>Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                </div>
              </div>
            )}
                
            {/* Location List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">Verified Locations</h2>
                <span className="text-sm text-emerald-600">
                  {locations.length} {locations.length === 1 ? 'location' : 'locations'} found
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {locations.length > 0 ? (
                  locations.map((loc, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${selectedLocation === loc ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => handleLocationSelect(loc)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <MapPin className={`w-5 h-5 ${selectedLocation === loc ? 'text-emerald-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <p className="font-medium text-gray-800">{loc.location}</p>
                            {loc.verified && (
                              <svg className="ml-2 h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Observed: {loc.date} • {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {loc.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <MapPin className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-gray-500">No verified locations found for this plant.</p>
                    <p className="text-sm text-gray-400">Be the first to report a sighting!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
