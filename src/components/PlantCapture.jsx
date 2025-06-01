import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { savePlantObservation, containerClient, sasToken } from '../services/cosmosDb';
import { Buffer } from 'buffer';
import { List } from 'lucide-react';

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

    if (!image) {
      setError('Molimo uslikajte biljku prvo');
      return;
    }

    console.log('Starting form submission...');
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create a unique filename for the image
      const timestamp = Date.now();
      const imageName = `image-${timestamp}.jpg`;
      const jsonName = `observation-${timestamp}.json`;
      
      // Convert base64 to blob
      const byteString = atob(image.split(',')[1]);
      const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const imageBlob = new Blob([ab], { type: mimeString });
      
      // Upload the image first
      const imageBlobClient = containerClient.getBlockBlobClient(imageName);
      const uploadResponse = await imageBlobClient.upload(ab, ab.byteLength, {
        blobHTTPHeaders: { blobContentType: mimeString }
      });
      
      if (!uploadResponse.requestId) {
        throw new Error('Image upload failed');
      }
      
      // Create the observation object with the image URL
      const cleanSasToken = sasToken.startsWith('?') ? sasToken.substring(1) : sasToken;
      const imageUrl = `https://${containerClient.accountName}.blob.core.windows.net/${containerClient.containerName}/${imageName}?${cleanSasToken}`;
      
      const observation = {
        id: jsonName,
        name: name || 'Nepoznata biljka',
        description,
        imageName,
        imageUrl,
        location: location || { lat: 0, lng: 0 },
        timestamp: new Date().toISOString(),
      };

      // Save the observation as JSON
      const jsonBlobClient = containerClient.getBlockBlobClient(jsonName);
      const jsonString = JSON.stringify(observation, null, 2);
      await jsonBlobClient.upload(jsonString, Buffer.byteLength(jsonString), {
        blobHTTPHeaders: { blobContentType: 'application/json' }
      });
      
      setSuccess('Zapažanje uspješno spremljeno! Preusmjeravanje...');
      
      // Redirect to observations page after a short delay
      setTimeout(() => {
        navigate('/zapazanja');
      }, 1500);
      
      // Reset form
      setImage(null);
      setName('');
      setDescription('');
      startCamera();
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dodaj novo zapažanje biljke</h1>
        <Link 
          to="/zapazanja"
          className="text-green-600 hover:text-green-800 font-medium flex items-center"
        >
          <List className="mr-1 h-4 w-4" />
          Pregledaj sva zapažanja
        </Link>
      </div>
      
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
