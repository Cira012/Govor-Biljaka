import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { featuredPlants } from '../App';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Istražite biljni svet Srbije</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Otkrijte raznovrsnost autohtonih biljaka i njihovu ulogu u našoj prirodi
          </p>
          <Link
            to="/zbirka"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Pregledajte zbirku
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Izdvojene biljke</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPlants.map((plant) => (
              <div key={plant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-plant.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-600 italic">{plant.scientificName}</p>
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{plant.description}</p>
                  <Link
                    to={`/vrste/${plant.id}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    Saznajte više
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">O projektu</h2>
            <p className="text-lg text-gray-700 mb-8">
              Naša platforma posvećena je dokumentovanju i prezentaciji bogatstva biljnog sveta Srbije.
              Kroz interaktivnu zbirku, želimo da približimo javnosti lepotu i značaj autohtonih biljaka.
            </p>
            <Link
              to="/o-projektu"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors duration-200"
            >
              Više o projektu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
