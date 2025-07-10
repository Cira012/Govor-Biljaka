import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { containerClient, storageSasToken } from '../services/storageService';
import { Buffer } from 'buffer';
import { X } from 'lucide-react';
import { plantsData } from '../data/plantData';

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    };

    const handleError = (error) => {
      console.error('Geolocation error:', error);
      setError(`Unable to retrieve your location: ${error.message}`);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  }, []);

  return { location, error };
}

export default function PlantCapture() {
  const location = useLocation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const { location: userLocation, error: locationError } = useGeolocation();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Set selected plant from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plantId = params.get('plantId');
    if (plantId) {
      const plant = plantsData.find(p => p.id === parseInt(plantId));
      if (plant) {
        setSelectedPlant(plant);
      }
    }
  }, [location]);

  // Start the camera when a plant is selected and component is ready
  useEffect(() => {
    if (selectedPlant) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [selectedPlant]);

  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError('');
      
      // Stop any existing streams
      if (streamRef.current) {
        stopCamera();
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Prefer rear camera on mobile
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Nije moguće pristupiti kameri. Provjerite dozvole.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !streamRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImage(imageDataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setImage(null);
    startCamera();
  };

  // Convert base64 image to blob
  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlant) {
      setError('Molimo odaberite biljku prije nego što uslikate');
      return;
    }

    if (!image) {
      setError('Molimo uslikajte biljku prvo');
      return;
    }

    if (locationError) {
      setError(`Greška pri dohvaćanju lokacije: ${locationError}`);
      return;
    }

    console.log('Starting form submission...');
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const timestamp = Date.now();
      const date = new Date();
      const dateString = date.toISOString().split('T')[0];
      
      // Create folder structure: plants/{plant-id}/{date}/image-{timestamp}.jpg
      const folderPath = `plants/${selectedPlant.id}/${dateString}`;
      const imageName = `image-${timestamp}.jpg`;
      const imagePath = `${folderPath}/${imageName}`;
      
      // Convert base64 to blob
      const byteString = atob(image.split(',')[1]);
      const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      // Create metadata object
      const metadata = {
        plantId: selectedPlant.id.toString(),
        plantName: selectedPlant.name,
        scientificName: selectedPlant.scientificName,
        timestamp: date.toISOString(),
        date: date.toISOString().split('T')[0],
        location: userLocation ? `${userLocation.lat},${userLocation.lng}` : 'unknown',
        accuracy: userLocation?.accuracy?.toString() || 'unknown'
      };

      console.log('Uploading image with metadata:', metadata);
      
      // Upload the image to the plant's folder
      const imageBlobClient = containerClient.getBlockBlobClient(imagePath);
      const uploadResponse = await imageBlobClient.upload(ab, ab.byteLength, {
        blobHTTPHeaders: { 
          blobContentType: mimeString,
          blobContentMD5: undefined // Clear any existing MD5
        },
        metadata: metadata
      });

      console.log('Upload response:', uploadResponse);
      
      // Verify metadata was set correctly
      const properties = await imageBlobClient.getProperties();
      console.log('Blob properties after upload:', properties);
      console.log('Metadata after upload:', properties.metadata);
      
      setSuccess('Zapažanje uspješno spremljeno! Preusmjeravanje...');
      
      // Reset form
      setImage(null);
      setSelectedPlant(null);
      
      // Redirect to observations page after a short delay
      setTimeout(() => {
        navigate('/zapazanja');
      }, 1500);
      
    } catch (err) {
      console.error('Greška pri spremanju zapažanja:', err);
      let errorMessage = 'Došlo je do greške pri spremanju. ';
      
      if (err.message) {
        errorMessage += `Detalji: ${err.message}`;
      } else if (err.request) {
        errorMessage += 'Nije moguće spojiti se na server. Provjerite internetsku vezu.';
      } else if (err.response) {
        errorMessage += `Server je vratio grešku: ${err.response.status} ${err.response.statusText}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlant) {
    return (
      <div className="fixed inset-0 bg-white p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {plantsData.map((plant) => (
              <div 
                key={plant.id}
                onClick={() => setSelectedPlant(plant)}
                className="cursor-pointer bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-32 mb-2 overflow-hidden rounded">
                  <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm text-center">{plant.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white">
      {/* Simple header with back button */}
      <div className="p-4">
        <button 
          onClick={() => setSelectedPlant(null)}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="h-[calc(100%-4rem)] flex flex-col">
        <div className="flex-1 flex flex-col">
          {!image ? (
            <div className="flex-1 bg-gray-100 flex flex-col">
              {cameraActive ? (
                <div className="flex-1 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <button
                      type="button"
                      onClick={captureImage}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg"
                    >
                      Uslikaj
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Učitavam kameru...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                  src={image} 
                  alt="Snimljena biljka" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-4 flex space-x-4">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded"
                >
                  Ponovno uslikaj
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
                >
                  {isLoading ? 'Spremanje...' : 'Spremi'}
                </button>
              </div>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
