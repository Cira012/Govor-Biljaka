import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlantObservations, storageSasToken } from '../services/cosmosDb';
import { MapPin, Calendar, Leaf, Clock } from 'lucide-react';

export default function Observations() {
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadObservations = async () => {
      try {
        setIsLoading(true);
        const observations = await getPlantObservations ? await getPlantObservations() : [];
        setObservations(observations);
      } catch (err) {
        console.error('Error loading observations:', err);
        setError('Došlo je do greške pri učitavanju zapažanja. Pokušajte ponovno.');
      } finally {
        setIsLoading(false);
      }
    };

    loadObservations();
  }, []); // Removed storageSasToken from deps as it's a constant

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('hr-HR', options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Moja zapažanja</h1>
        <Link 
          to="/snimi"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <Leaf className="mr-2 h-4 w-4" />
          Novi unos
        </Link>
      </div>

      {observations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Leaf className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nema zapažanja</h2>
          <p className="text-gray-600 mb-4">Još niste zabilježili nijedno zapažanje.</p>
          <Link 
            to="/snimi"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Dodaj prvo zapažanje
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {observations.map((obs) => (
            <div key={obs.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                {obs.imageName ? (
                  <img 
                    src={`https://govorbiljaka360.blob.core.windows.net/plant-observations/${obs.imageName}${storageSasToken || ''}`}
                    alt={obs.name || 'Biljka bez naziva'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Try with the imageUrl if available
                      if (obs.imageUrl) {
                        e.target.src = obs.imageUrl;
                      } else {
                        // Try with the imageName directly
                        e.target.src = `https://govorbiljaka360.blob.core.windows.net/plant-observations/${obs.imageName}`;
                        // If that fails, use fallback
                        e.target.onerror = () => {
                          e.target.src = '/assets/plants/mentha-spicata.png';
                        };
                      }
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <Leaf className="h-12 w-12 mx-auto mb-2" />
                    <p>Nema dostupne slike</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{obs.name || 'Biljka bez naziva'}</h3>
                {obs.description && (
                  <p className="text-gray-600 mb-3 line-clamp-2">{obs.description}</p>
                )}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(obs.timestamp)}</span>
                  </div>
                  {obs.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {obs.location.lat.toFixed(4)}, {obs.location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
