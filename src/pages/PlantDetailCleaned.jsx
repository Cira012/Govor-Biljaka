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
    { lat: 44.7722, lng: 17.1910, location: 'Banja Luka, BiH' },
    { lat: 45.8000, lng: 15.9000, location: 'Zagreb, Hrvatska' },
    { lat: 46.1512, lng: 14.9955, location: 'Ljubljana, Slovenija' },
    { lat: 42.4602, lng: 19.2595, location: 'Podgorica, Crna Gora' },
    { lat: 42.0000, lng: 21.4333, location: 'Skoplje, Severna Makedonija' },
    { lat: 41.3275, lng: 19.8187, location: 'Tirana, Albanija' },
    { lat: 44.4268, lng: 26.1025, location: 'Bukurešt, Rumunija' }
  ],
  2: [
    { lat: 44.0165, lng: 21.0059, location: 'Kragujevac, Srbija' },
    { lat: 44.0128, lng: 20.9114, location: 'Kraljevo, Srbija' },
    { lat: 43.8563, lng: 18.4131, location: 'Sarajevo, BiH' }
  ],
  3: [
    { lat: 45.2671, lng: 19.8335, location: 'Novi Sad, Srbija' },
    { lat: 45.7750, lng: 19.1125, location: 'Subotica, Srbija' },
    { lat: 45.2551, lng: 19.8447, location: 'Sremski Karlovci, Srbija' }
  ],
  16: [
    { lat: 44.8200, lng: 20.4600, location: 'Beograd, Srbija' },
    { lat: 44.0128, lng: 20.9114, location: 'Kragujevac, Srbija' },
    { lat: 43.8563, lng: 18.4131, location: 'Sarajevo, BiH' }
  ]
};

// Plants data with locations
const plantsWithLocations = [
  {
    id: 1,
    name: "Mentha Spicata",
    scientificName: "Mentha spicata",
    image: "/assets/plants/mentha-spicata.png",
    fullDesc: `Mentha spicata je osnovni međunarodni fenološki objekat. Mentha spicata ili špicasta mušterija je višegodišnja zeljasta biljka koja raste u celoj Evropi, posebno u jugoistočnoj i srednjoj Evropi. Često se pojavljuje na vlagežnjim i sunčanim položajima, na obalama reka i vodnih površina, kao i u poljima i livadama. Listovi su uski, dužine oko 4 cm, zelene boje sa nazubljenim rubom. Cvetovi su skupljeni u uspravne cvasti, srebrno-bijave ili ljubičaste boje, mirisni i cvetaju od juna do avgusta. Plod je čaura. Mentha spicata je važan medonosac i lekovita biljka.`,
    lat: 45.8150,
    lng: 15.9819,
    location: 'Srednja Europa'
  },
  {
    id: 2,
    name: "Taraxacum Officinale",
    scientificName: "Taraxacum officinale",
    image: "/assets/plants/taraxacum-officinale.png",
    fullDesc: `Taraxacum officinale je osnovni međunarodni fenološki objekat. Taraxacum officinale ili mleč je višegodišnja zeljasta biljka koja raste skoro u celoj Evropi, posebno u oblastima sa umerenom klimom. Mleč je značajna biljka jer je značajna za završni period proleća. Cvet je žuto-zvonastog oblika, sastavljen od mnogih zlatnožutih kruničnih listića bez čašičnih listića. Cvetovi su pojedinačni na dugačkim, praznim peteljkama. Cvetanje se vrši od mara do avgusta. Plod je čaura sa dlakavom peteljkom koja omogućava da se seme raznosi vodom. Mleč je značajan medonosac i lekovita biljka.`,
    lat: 47.1625,
    lng: 19.5033,
    location: 'Istočna Evropa'
  },
  {
    id: 3,
    name: "Sambucus Nigra (Original)",
    scientificName: "Sambucus nigra",
    image: "/assets/plants/sambucus-nigra.png",
    fullDesc: `Zova je osnovni međunarodni fenološki objekat. Cvetovi su male, žuto-bele mirisne "zvezdice" sa 5 čašičnih, 5 kruničnih listića i sa 5 prašnika. Cvetovi su združeni u velike štitašte cvasti. Cvetanje se vrši tako, što najprije počinju da cvetaju cvetovi na spoljašnjoj ivici štitaste cvasti. Kao cvetovi i plodovi su udruženi u štitašte cvasti. Plodovi su male, ljubičasto-crne, sjajne i meke bobice. Datum prvih zrelih plodova beleži se tek tada kada na prvim cvastima sazru sve bobice`,
    lat: 46.1000,
    lng: 14.8167,
    location: 'Jugoistočna Evropa'
  },
  {
    id: 4,
    name: "Ljubičica",
    scientificName: "Viola odorata",
    image: "/assets/plants/violet.png",
    fullDesc: `Ljubičica je višegodišnja zeljasta biljka poznata po svojim mirisnim cvetovima, obično tamnoljubičaste ili bele boje. Često raste u šumama, na livadama i kao ukrasna biljka u baštama. Cvetovi se pojavljuju rano u proleće i cenjeni su zbog svoje lepote i karakterističnog mirisa.`,
    lat: 44.8200,
    lng: 20.4600,
    location: 'Balkan'
  },
  {
    id: 5,
    name: "Jorgovan",
    scientificName: "Syringa vulgaris L.",
    image: "/assets/plants/JORGOVAN_-_Syringa_vulgaris_20250507T175240.png",
    fullDesc: `Jorgovan je osnovni međunarodni fenološki objekat. Kod jorgovana se osmatraju dve faze: početak cvetanja i opšte cvetanje Ove faze označavaju glavni period pravog proleća. Mnogobrojni, sitni, ljubičasti i jako mirisni cvetovi združeni su u uspravne grozdaste cvasti. Slično kao kod divljeg kestena i kod jorgovana počinju prvo da se otvaraju cvetovi na donjem delu cvasti; najstariji cvjetovi su pri dnu cvasti, a najmlađi pri vrhu. Datum početka cvetanja beleži se odmah kada se na prvim cvastima rascvetaju cvetovi na donjem delu grozdaste cvasti, pojedinačni cvetovi su otvoreni. Ako se cvet pogleda iz blizine, unutar svakog cveta vidi se dva žuta prašnika, prirasla za cevastu krunicu. Datum opšteg cvetanja beleži se kada se rascveta većina cvetova na većem broju grozdastih cvasti. Na gornjem i na donjem delu grozdaste cvasti su cvetovi rascvetani. Jorgovan je listopadni žbun jugoistočne Evrope i Male Azije. Ime mu potiče od grčke reči syrinx-pištaljka, pošto se njegovo drvo koristi za izradu pištaljki. Visina mu varira 2-10 m. Listovi su prosti, ovalni do izduženi, zelene boje. Cveta od aprila do maja. Cvetovi su mirisni, skupljeni u cvasti konusnog ili piramidalnog oblika. Mogu biti ljubičaste, bledoljubičaste i bele boje. Plod je čaura. Razmnožava se semenom, poluodrvenelim reznicama u julu i avgustu kao i kalemljenjem. Dobro raste na otvorenim i osunčanim položajima, senku i polusenku loše podnosi.`,
    lat: 44.0165,
    lng: 21.0059,
    location: 'Balkan'
  }
];

export default function PlantDetail() {
  const { id: plantId } = useParams();
  const navigate = useNavigate();

  // Get the plant data
  const plant = plantsWithLocations.find(p => p.id === parseInt(plantId));

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

  // Get locations for this plant
  const locations = getPlantLocations(plantId);

  // Local storage helper functions
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // Create marker icons using L.divIcon for better control and to avoid default icon issues
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

  // Set default icon for all markers
  L.Marker.prototype.options.icon = defaultIcon;

  // State declarations
  const [mapCenter, setMapCenter] = useState(() => {
    // Default center for Serbia
    const defaultCenter = [44.0165, 21.0059];
    
    if (!plant) return defaultCenter;
    return [plant.lat, plant.lng];
  });

  const [zoom, setZoom] = useState(8);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userLocations, setUserLocations] = useState(() => 
    getFromLocalStorage('userLocations') || []
  );

  // Rest of the component code...
}
