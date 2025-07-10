import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { plantsData } from '../data/plantData';
import PlantCard from '../components/PlantCard';

const Collection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlants, setFilteredPlants] = useState(plantsData);

  // Filter plants based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlants(plantsData);
      return;
    }

    const filtered = plantsData.filter(
      (plant) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.scientificName &&
          plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredPlants(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Pretraži biljke..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Plant grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant, index) => (
            <PlantCard key={plant.id} plant={plant} index={index} />
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nema pronađenih biljaka.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
