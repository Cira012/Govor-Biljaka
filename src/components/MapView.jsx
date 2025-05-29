import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { Loader2, MapPin } from 'lucide-react';

// Create a custom icon
const createCustomIcon = (isSelected = false) => {
  return L.divIcon({
    html: `<div style="position: relative; width: 30px; height: 30px;">
      <svg viewBox="0 0 24 24" width="30" height="30" style="color: ${isSelected ? '#166534' : '#15803d'};">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const defaultIcon = createCustomIcon();
const selectedIcon = createCustomIcon(true);

const MapBounds = ({ locations }) => {
  const map = useMap();
  const [boundsSet, setBoundsSet] = useState(false);

  useEffect(() => {
    if (locations?.length > 0 && !boundsSet) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.lat, loc.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      setBoundsSet(true);
    }
  }, [locations, map, boundsSet]);

  return null;
};

const MapView = ({ 
  locations = [], 
  selectedPlantId = null,
  onMarkerClick = () => {},
  className = 'h-96 rounded-lg border border-gray-200',
  zoom = 7,
  center = [44.0165, 21.0059], // Center of Serbia
  scrollWheelZoom = true,
  zoomControl = true,
  dragging = true,
  tap = true,
  loading = false
}) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Initialize map when component mounts
    if (mapRef.current && !mapReady) {
      try {
        setMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to load map. Please try again later.');
      }
    }
  }, [mapReady]);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      setMapReady(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-10 z-10 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
          <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
          <span>Učitavanje mape...</span>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">{mapError}</p>
          <button 
            onClick={() => setMapError(null)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-600">Nema dostupnih lokacija za prikaz</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={zoomControl}
        dragging={dragging}
        tap={tap}
        className="h-full w-full"
        whenCreated={map => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={`${location.lat}-${location.lng}-${index}`}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => onMarkerClick(location),
            }}
            icon={location.id === selectedPlantId ? selectedIcon : defaultIcon}
          >
            {location.name && (
              <Popup>
                <div className="text-sm">
                  <h4 className="font-semibold">{location.name}</h4>
                  {location.description && <p className="mt-1 text-gray-600">{location.description}</p>}
                  {location.date && <p className="mt-1 text-xs text-gray-500">Poslednje viđeno: {location.date}</p>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        <MapBounds locations={locations} />
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    location: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
  })),
  selectedPlantId: PropTypes.number,
  onMarkerClick: PropTypes.func,
  className: PropTypes.string,
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  scrollWheelZoom: PropTypes.bool,
  zoomControl: PropTypes.bool,
  dragging: PropTypes.bool,
  tap: PropTypes.bool,
  loading: PropTypes.bool,
};

export default React.memo(MapView);
