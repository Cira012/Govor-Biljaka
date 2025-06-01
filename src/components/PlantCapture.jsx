import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savePlantObservation } from '../services/cosmosDb';

export default function PlantCapture() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Start the camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Molimo uslikajte biljku prvo');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const observation = {
        name: name || 'Nepoznata biljka',
        description,
        image,
        location: location || { lat: 0, lng: 0 },
        observationDate: new Date().toISOString(),
      };

      await savePlantObservation(observation);
      setSuccess('Zapažanje uspješno spremljeno!');
      
      // Reset form
      setImage(null);
      setName('');
      setDescription('');
      startCamera();
    } catch (err) {
      console.error('Greška pri spremanju zapažanja:', err);
      setError('Došlo je do greške pri spremanju. Pokušajte ponovno.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dodaj novo zapažanje biljke</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Fotografija biljke</h2>
          
          {!image ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  type="button"
                  onClick={captureImage}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                  disabled={!cameraActive}
                >
                  Uslikaj
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={image} 
                alt="Captured plant" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Ponovno uslikaj
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Ime biljke (opcionalno)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Unesite ime biljke"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Opis (opcionalno)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Dodatne napomene o biljci..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !image}
            className={`w-full py-3 px-4 rounded font-bold text-white ${isLoading || !image ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isLoading ? 'Spremanje...' : 'Spremi zapažanje'}
          </button>
        </div>
      </form>
    </div>
  );
}
