import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, MapPin, X, Plus, Minus, Maximize2, Minimize2, ChevronLeft, ChevronRight, MapPin as MapPinIcon, Clock, Map as MapIcon, Upload, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PlantDetail.css';

// Sample location data for plants (multiple locations per plant)
const plantLocations = {
  1: [
    { lat: 44.8200, lng: 20.4600, location: 'Beograd, Srbija' },
    { lat: 45.2671, lng: 19.8335, location: 'Novi Sad, Srbija' },
    { lat: 43.8563, lng: 18.4131, location: 'Sarajevo, BiH' },
  ],
  2: [
    { lat: 44.0165, lng: 21.0059, location: 'Kragujevac, Srbija' },
    { lat: 44.0128, lng: 20.9114, location: 'Kraljevo, Srbija' },
  ],
  3: [
    { lat: 45.2671, lng: 19.8335, location: 'Novi Sad, Srbija' },
  ]
};

// Helper function to get plant locations
const getPlantLocations = (plantId) => {
  return plantLocations[plantId] || [];
};

// Plants data with locations
const plantsWithLocations = [
  {
    id: 1,
    name: "Mentha Spicata",
    scientificName: "Mentha spicata",
    image: "/assets/plants/mentha-spicata.png",
    fullDesc: `Mentha spicata je osnovni međunarodni fenološki objekat.`,
    lat: 45.8150,
    lng: 15.9819,
    location: 'Srednja Evropa'
  },
  {
    id: 2,
    name: "Taraxacum Officinale",
    scientificName: "Taraxacum officinale",
    image: "/assets/plants/taraxacum-officinale.png",
    fullDesc: `Taraxacum officinale je osnovni međunarodni fenološki objekat.`,
    lat: 47.1625,
    lng: 19.5033,
    location: 'Istočna Evropa'
  },
  {
    id: 3,
    name: "Sambucus Nigra",
    scientificName: "Sambucus nigra",
    image: "/assets/plants/sambucus-nigra.png",
    fullDesc: `Zova je osnovni međunarodni fenološki objekat.`,
    lat: 46.1000,
    lng: 14.8167,
    location: 'Jugoistočna Evropa'
  }
];

export default function PlantDetail() {
  const { id: plantId } = useParams();
  const navigate = useNavigate();

  // Get the plant data
  const plant = plantsWithLocations.find(p => p.id === parseInt(plantId));
  const locations = getPlantLocations(plantId);

  // Local storage helper functions
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // Create marker icons
  const createCustomIcon = (color = 'red') => {
    const size = 32;
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        position: relative;
        margin: ${size/2}px 0 0 ${size/2}px;
        box-shadow: -1px 1px 4px rgba(0,0,0,0.5);
      ">
        <div style="
          position: absolute;
          width: 50%;
          height: 50%;
          left: 25%;
          top: 25%;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size/2]
    });
  };

  // Default icons
  const defaultIcon = createCustomIcon('#2ecc71');
  const selectedIcon = createCustomIcon('#e74c3c');
  const userIcon = createCustomIcon('#3498db');

  // State
  const [mapCenter, setMapCenter] = useState(() => {
    const defaultCenter = [44.0165, 21.0059];
    return plant ? [plant.lat, plant.lng] : defaultCenter;
  });

  const [zoom, setZoom] = useState(8);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userLocations, setUserLocations] = useState(() => 
    getFromLocalStorage('userLocations') || []
  );

  // Handle location selection
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Biljka nije pronađena</h2>
          <p className="text-lg text-gray-600 mb-6">Tražena biljka ne postoji u našoj bazi podataka.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Nazad na kolekciju
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Plant Image */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img 
              src={plant.image} 
              alt={plant.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-emerald-800">{plant.name}</h1>
              <p className="text-gray-600 italic">{plant.scientificName}</p>
              <p className="mt-4 text-gray-700">{plant.fullDesc}</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            <div className="h-96 w-full">
              <MapContainer 
                center={mapCenter} 
                zoom={zoom} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Plant locations */}
                {locations.map((location, index) => (
                  <Marker 
                    key={`location-${index}`}
                    position={[location.lat, location.lng]}
                    icon={selectedLocation === location ? selectedIcon : defaultIcon}
                    eventHandlers={{
                      click: () => handleLocationSelect(location)
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">{location.location}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* User locations */}
                {userLocations.map((loc, index) => (
                  <Marker
                    key={`user-loc-${index}`}
                    position={[loc.lat, loc.lng]}
                    icon={userIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">Vaša lokacija</p>
                        {loc.timestamp && (
                          <p className="text-sm text-gray-600">
                            {new Date(loc.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            {/* Image upload section */}
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Dodajte fotografiju</h2>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <div className="flex items-center gap-2">
                    <Upload size={18} />
                    Izaberite sliku
                  </div>
                </label>
                
                <button 
                  onClick={handleCameraClick}
                  className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-2"
                >
                  <Camera size={18} />
                  Uslikajte
                </button>
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-48 rounded-lg border border-gray-200"
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">
                      Sačuvaj
                    </button>
                    <button 
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                      onClick={() => setImagePreview(null)}
                    >
                      Otkaži
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Image gallery */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Galerija</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[plant.image, ...(userLocations.map(loc => loc.imageUrl).filter(Boolean))].map((img, index) => (
            <div 
              key={`gallery-${index}`}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img 
                src={img} 
                alt={`Gallery ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Image modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh]" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size preview"
              className="max-w-full max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
