import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlantCapture() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Request camera access and start stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture image from video stream
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setImage(imageDataUrl);
      stopCamera();
    }
  };

  // Get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Initialize camera and location when component mounts
  useEffect(() => {
    getLocation();
    startCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  // Toggle camera on/off
  const toggleCamera = () => {
    if (streamRef.current) {
      stopCamera();
      setImage(null);
    } else {
      startCamera();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please capture an image first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/plant-observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || 'Unnamed Plant',
          description,
          image,
          location: location || { lat: 0, lng: 0 },
          observationDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save observation');
      }

      const result = await response.json();
      setSuccess('Plant observation saved successfully!');
      
      // Reset form
      setImage(null);
      setName('');
      setDescription('');
      startCamera();
    } catch (err) {
      console.error('Error saving observation:', err);
      setError('Failed to save observation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Snimi biljku</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ime biljke (opciono)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Unesite ime biljke"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Opis (opciono)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Dodatne napomene o biljci..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fotografija biljke
          </label>
          
          {!image ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  type="button"
                  onClick={captureImage}
                  className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={image}
                alt="Captured plant"
                className="w-full h-auto rounded-lg"
              />
              <button
                type="button"
                onClick={toggleCamera}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                title="Retake photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {location && (
          <div className="text-sm text-gray-600">
            <p>Lokacija: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
            <p>Tačnost: ~{Math.round(location.accuracy)} metara</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !image}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading || !image
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Spremanje...' : 'Spremi zapažanje'}
          </button>
        </div>
      </form>
    </div>
  );
}
