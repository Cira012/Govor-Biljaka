import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, MapPin, Upload } from 'lucide-react';
import PropTypes from 'prop-types';

const PhotoCaptureModal = ({ plant, onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split('T')[0]);

  // Get current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Nije moguće dobiti vašu lokaciju. Molimo omogućite pristup lokaciji.');
        }
      );
    } else {
      setError('Vaš pregledač ne podržava geolokaciju.');
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Here you would typically upload the image to your backend
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess({
        image,
        location,
        dateTaken,
        plantId: plant.id,
        plantName: plant.name
      });
      
      onClose();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Došlo je do greške prilikom slanja fotografije. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Dodaj fotografiju - {plant.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            {!image ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Kliknite za izbor fotografije
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ili prevucite i pustite ovde
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Pregled" 
                  className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
              <span>
                {location 
                  ? `Lokacija: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : 'Učitavanje lokacije...'}
              </span>
            </div>
            
            <div>
              <label htmlFor="date-taken" className="block text-sm font-medium text-gray-700 mb-1">
                Datum snimanja
              </label>
              <input
                type="date"
                id="date-taken"
                value={dateTaken}
                onChange={(e) => setDateTaken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                disabled={isLoading}
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={!image || isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                  !image || isLoading
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Šaljem...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Pošalji
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

PhotoCaptureModal.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PhotoCaptureModal;
