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

  return (
    // Component JSX
  );
}



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
  const [userLocations, setUserLocations] = useState(() => {
    const savedLocations = localStorage.getItem(`userLocations_${plantId}`);
    return savedLocations ? JSON.parse(savedLocations) : [];
  });

  // Get default locations for the current plant
  const defaultLocations = useMemo(() => {
    return getPlantLocations(parseInt(plantId));
  }, [plantId]);

  // Combine default and user locations with type information
  const allLocations = useMemo(() => {
    return [
      ...defaultLocations.map(loc => ({
        ...loc,
        type: 'default',
        icon: '📍',
        color: 'text-emerald-600'
      })),
      ...userLocations.filter(loc => 
        !defaultLocations.some(dl => dl.lat === loc.lat && dl.lng === loc.lng)
      ).map(loc => ({
        ...loc,
        type: 'user',
        icon: '👤',
        color: 'text-blue-600'
      }))
    ];
  }, [defaultLocations, userLocations]);

  // Set initial selected location when component mounts
  useEffect(() => {
    if (plant) {
      setSelectedLocation({
        lat: plant.lat,
        lng: plant.lng,
        location: plant.location || 'Nepoznata lokacija'
      });
    }
  }, [plant]);

  // Load saved data from localStorage and set up cleanup
  useEffect(() => {
    const savedImages = getFromLocalStorage(`plantImages_${plantId}`) || [];
    const savedLocations = getFromLocalStorage(`userLocations_${plantId}`) || [];
    setUserImages(savedImages);
    setUserLocations(savedLocations);
    
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [plantId]);

  // Handle geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location: 'Vaša lokacija'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
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
const plantsWithLocations = [
  {
    id: 1,
    name: "Mentha Spicata",
    scientificName: "Mentha spicata",
    image: "/assets/plants/mentha-spicata.png",
    fullDesc: `Mentha spicata je osnovni međunarodni fenološki objekat. Mentha spicata ili špicasta mušterija je višegodišnja zeljasta biljka koja raste u celoj Evropi, posebno u jugoistočnoj i srednjoj Evropi. Često se pojavljuje na vlagežnjim i sunčanim položajima, na obalama reka i vodnih površina, kao i u poljima i livadama. Listovi su uski, dužine oko 4 cm, zelene boje sa nazubljenim rubom. Cvetovi su skupljeni u uspravne cvasti, srebrno-bijele ili ljubičaste boje, mirisni i cvetaju od juna do avgusta. Plod je čaura. Mentha spicata je važan medonosac i lekovita biljka.`,
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
  },
  {
    id: 7,
    name: "Hrast Lužnjak",
    scientificName: "Quercus pedunculata Ehrh.",
    image: "/assets/plants/HRAST_LU_NJAK_-_Quercus_pedunculata_20250507T175059.png",
    fullDesc: `Hrast lužnjak je osnovni međunarodni fenološki objekat. Ima više vrsta hrastova. Fenološke faze razvoja se kod pojedinačnih vrsta hrastova pojavljuju u različito vreme, zato se mora tačno utvrditi da li je osmatrano drvo zaista hrast lužnjak. Ovaj se od drugih hrastova razlikuje između ostalog i po listovima i plodovima. Hrast lužnjak ima lišće sa kratkim peteljkama - peteljka nije duža od 1 cm. Kod hrasta lužnjaka lisne površine nisu zaoštrene, već su tupo zaobljene, osnova lista nije klinasta već srcoliko urezana, kod peteljke malo uvijena i ima oblik donjeg dela uha. Još lakše razlikujemo hrast lužnjak od drugih hrastova po plodovima nego po lišću. Od svih hrastova hrast lužnjak ima plodove - žirove na najdužoj peteljci. Hrast lužnjak je, slično kao drugi hrastovi, jednodomo drvo, na istom drvetu su muški – prašni i ženski - tučkasti cvetovi. Oni su združeni u duge rese. Obično na jednoj resi ima 15 do 20 cvetova. Rese se pojavljuju tek u proleće i to na novim izdancima. Imaju bledo zelenu boju, sličnu kao mlado lišće i zato se teško vide iz daljine. Plod je žir.`
  },
  {
    id: 8,
    name: "Jasen",
    scientificName: "Fraxinus excelsior L.",
    image: "/assets/plants/JASEN_-_Fraxinus_excelsior_20250507T175053.png",
    fullDesc: `Jasen bijeli veliki, osnovni je međunarodni fenološki objekat. Raste skoro u celoj srednjoj Evropi, osim u severoistočnoj Rusiji i na Pirinejskom poluostrvu. Kod jasena cvetanje nastaje pre listanja. Zbog njegovog visokog rasta osmatranje cvetanja je otežano, mada nije nemoguće. Beli jasen je drvo visoko od 10 do 40 m. Listovi su naspramni, složeno perasti, sastavljeni od 7 do 13 uskih, po obodu nazubljenih, šiljastih, duguljastih listića. Cvetovi su bez cvetnog omotača, sakupljeni u metlice, crvenkasti, hermafroditni, muški i ženski. Plod je krilata orasica.`
  },
  {
    id: 9,
    name: "Bukva",
    scientificName: "Fagus silvatica L.",
    image: "/assets/plants/BUKVA_-_Fagus_silvatica_20250507T175016.png",
    fullDesc: `Bukva je veoma važan osnovni međunarodni fenološki objekat. Bukva raste kako u nizijskim, tako i u visinskim predelima. Od svog listopadnog drveća, koje je uključeno u fenološki program osmatranja, bukva dostiže na najveće visine, tako da je kod nas nalazimo i na visini od oko 1500 m. Zato je ona dobar klimatsko-fenološki pokazatelj za predele sa različitim nadmorskim visinama. Bukva je jednodomo drvo: muški i ženski cvetovi su na istom drvetu. Muški cvetovi su skupljeni u svetlo-zelene rese, koje vise nadole. Za razliku od leske, breze, rese kod bukve nisu duge, već su slične okruglastom klupku, koje visi na relativno dugoj peteljci. Ženski cvetovi stoje usamljeni ili po dva zajedno na kraju mladog izdanka, cvetove odaje meko - bodljikast omotač crvenkaste boje. Pojava početka cvetanja osmatra se na muškim resama, koje se opažaju tek u proleće. Sazreo plod predstavija odrvenjena bodljikava čahura u kojoj se obično nalaze po dva svetlomrka oraščića. Bukva cveta obično samo svakih pet do sedam godina. U pojedinim godinama se dakle može dogoditi da osmatrano drvo uopšte ne cveta.`
  },
  {
    id: 10,
    name: "Divlji Kesten",
    scientificName: "Aesculus hipocastanum L.",
    image: "/assets/plants/DIVLJI_KESTEN_-_Aesculus_hipocastanum_20250507T174933.png",
    fullDesc: `Divlji kesten je vrlo važan osnovni međunarodni fenološki objekat. Divlji kesten, jedan je od retkih fenoloških objekata koji doseže relativno daleko na sever i jug Evrope, sve od Norveške pa do Italije. On je posredni vremenski i klimatski pokazatelj za velika teritorijalna područja. Divlji kesten je listopadno drvo i nije srodan sa pitomim kestenom. Prstasto složeni listovi su na dugoj lisnoj dršci sa 6-9 sedećih listova, elipsasto izduženih i po obodu testerasti, srednji je najveći, a svaki ispod njega je manji. Cvetovi su skupqeni u metličaste, krupne i uspravne cvasti. Plod je okruglasta kožasta, bodqikava okrugla čaura veličine oko 6cm. Čaura nakon sazrevawa puca na tri dela, oslobađajući od jednog do tri krupna poluloptasta do loptasta semena.`
  },
  {
    id: 11,
    name: "Trnjina",
    scientificName: "Prunus spinoza L.",
    image: "/assets/plants/TRNJINA_-_Prunus_spinoza_20250507T174918.png",
    fullDesc: `Trnjina je vrsta šljive, raste u vidu listpadnog žbunastog grma. Boja kore drveta se menja sa starošću i jako je bogata lenticelama. Široko je rasprostranjena u Evropi, severozapadnoj Africi, zapadnoj Aziji. Trnjina je osnovni međunarodni fenološki objekat. Početak cvetanja označava glavni period ranog proljeća, to je period kada temperaturni uslovi već dozvoljavaju sađenje ranog krompira, setvu stočne repe, cvetanje ranih vrsta voćaka itd. Pojava početka listanja označava početak pravog proljeća. Trnjina već pre listanja razvije sitne bele cvetove u takvom mnoštvu, da je celi grm beo kao da je pokriven snegom. Prelaz iz pupoljaka u početak cvetanja, kao i u opšte cvetanje je vrlo nagao, naročito pri toplom i sunčanom vremenu. Odrasli listovi trnjine su relativno mali; prosečna dužina iznosi oko 4 cm a širina lista obično nije veća od 2 cm.`
  },
  {
    id: 12,
    name: "Vrba Iva",
    scientificName: "Salix caprea L.",
    image: "/assets/plants/VRBA_IVA_-_Salix_caprea_20250507T174859.png",
    fullDesc: `Vrba iva je osnovni međunarodni fenološki objekat. Iva spada u brojnu familiju vrba, zato je važno da se ne zamieni sa drugim vrbama. Od ostalih vrba se između ostalog razlikuje po obliku lišća, po obliku i veličini resa i po vremenu cvetanja. Zeleno lišće nije tako dugo, usko i dugačko zašiljeno kao kod većine drugih vrba, već kraće, široko, jajoliko odnosno elipsasto. Rese su kraće i deblje. Od svih vrba ona prva cveta. Iva je dvodoma biljka, muški (prašni) cvetovi nalaze se na jednom žbunu, a ženski (tučkasti) na drugom. Muške cveti su goli (pojedinačni cvet sastavljen je samo iz dva prašnika) i združeni su u resu. Rese su kasno u jesen prikrivene debelim zaštitnim ljuskama i slične su zadebljalim lisnim pupoljcima, blede zelenkasto - žute boje. Već u toku zime zaštitne ljuske postanu mrke i iz njih izvire svilenkaste, srebrno bele dlakave rese.`
  },
  {
    id: 13,
    name: "Leska",
    scientificName: "Corylus avellana L.",
    image: "/assets/plants/LESKA_-_Corylus_20250507T174753.png",
    fullDesc: `Leska je rod listopadnog drveća i velikog žbunja koje raste na severnoj hemisferi, u područjima sа umerenom klimom. Leska je osnovni međunarodni fenološki objekat. Leske imaju jednostavne, zaobljene listove sa dvostruko nazubljenim rubovima. Cvetovi se razvijaju u vrlo ranoj fazi proleća, pre lišća, i jednodomni su, sa jednopolnim resama; muške rese su bledožute i duge 5–12 cm, a ženske su vrlo male i većim delom skrivene u pupoljcima; vidljivi su samo svetlocrveni delovi tučka dužine 1–3 mm. Plodovi su orasi dužine 1–2,5 cm i prečnika 1–2 cm, oko kojih je ljuska (involukrum), koja delomično ili potpuno zatvara orah. Leska, kao jednodoma biljka, ima na istom grmu i muške - prašne i ženske - tučkaste cvetove. Početak cvetanja se osmatra na muškim cvetovima. Oni su cvasti viseće rese. Rese sa muškim cvetovima se pojavljuju već leti. Tada su one maslinasto zelene boje, kratke, dužina 2-3 cm i tvrde. Ovaj stadijum nije još stadijum početka cvetanja. Sledeće godine, obično u februaru ili martu, a ako je zima blaga već u januaru, rese se otvore, omekšaju i izduže do dužine 4-6 cm. Opšte cvetanje osmatra se na ženskim - tučkastim cvjetovima. Oni su sitni, slični lisnim pupoljcima i iz njih vire lepljive, koralno crvene niti. Datum opšteg cvetanja beleži se tada kada su na osmatranom grmu već otvoreni mnogobrojni ženski cvetovi koralno crvene boja. Iz oplođenih ženskih cvetova razvijaju se plodovi - odrvenele orašice, sa ukusnim uljanim semenom - lešnikom.`
  },
  {
    id: 14,
    name: "Mrazovac",
    scientificName: "Colchicum autumnale L.",
    image: "/assets/plants/MRAZOVAC_-_Colchicum_autumnale_20250507T174732.png",
    fullDesc: `Mrazovac je osnovni međunarodni fenološki objekat. Pojava prvih cvetova kod mrazovca je vrlo značajna, jer označava nastupanje rane jeseni. Uskoro posle završetka košenja otave, na pokošenim livadama se pojavljuju svetloljubičasti cvetovi mrazovca, kao prvi vesnici približavajuće jeseni. Krunični listići levkasto - zvonastog cveta su sa donje strane srasli u bielo cvetno stablo. U vrijeme pupoljaka stablo je još kratko, kasnije, kad cvet odraste, stablo se izduži i do 10 cm dužine. Cvetovi se otvaraju samo pri vedrom vremenu, a pri oblačnom vremenu cvetovi su zatvoreni i prašnici se ne vide. Zatvoreni ali već odrasli cvetovi razlikuju se od pupoljaka samo po tome što su duži i deblji. Mrazovac ima šest prašnika za razliku od šafrana koji ima tri prašnika i koji mu je inače po izgledu cveta sličan, te se ova dva objekta često zamjenjuju. U osnovi razlikuju se po vremenu cvetanja, šafran je vesnik proljeća, a mrazovac jeseni. Osim toga, kod mrazovca u vreme cvatnja iz lukovice izraste samo cvijet – bez lišća. Sledećeg proleća raste lišće i razvija se seme.`
  },
  {
    id: 15,
    name: "Podbel (Konjsko kopito)",
    scientificName: "Tussilago farfara L.",
    image: "/assets/plants/PODBEL_KONJSKO_KOPITO_-_Tussilago_farfar_20250507T174703.png",
    fullDesc: `Podbel ili konjsko kopito je osnovni međunarodni fenološki objekat. Višegodišnja zeljasta biljka sa većim brojem stabala koji su pokriveni ljuspastim, zelenim ili ružičastim listićima. Na vrhu stabaoceta je zlatnožuta cvast glavica. Krupni, zeleni listovi na dugačkim drškama obrazuju se posle cvetanja. Podbel je široko rasprostranjen, zato je faza prvih cvetova isto tako značajna kao kod visibabe i označava početak predproleća. Podbel obični raste u velikim skupinama te ga je lako primietiti. Počinje da cveta već vrlo rano: u toplijim krajevima, na sunčanim položajima i u godinama sa blagim zimama već krajem februara, a ponekad tek krajem marta, zavisi od toga kakve su vremenske prilike i položaj mesta.`
  },
  {
    id: 16,
    name: "Visibaba",
    scientificName: "Galanthus nivalis L.",
    image: "/assets/plants/VISIBABA_-_Galanthus_nivalis_20250507T174625.png",
    fullDesc: `Visibaba je osnovni međunarodni fenološki objekat. Visibaba raste skoro u celoj severnoj, srednjoj, a ponegde i u južnoj Evropi. Visibaba je najranija efemeroidna, višegodišnja biljka sa lukovicom. Često cveta u šumama (dok sneg još nije okopnio) u periodu od januara do marta. Koren joj je žiličast. Stablo zeljasto i uspravno. Podzemni deo stabla je lukovica. Listovi su nepotpuni (sedeći) i u vreme cvetanja su 8 do 9 cm dugi i oko pola centimentra široki. Iz osnove izlaze 2 do 3 linearna lista. Cvetovi su pojedinačni, snežno beli, slabog mirisa. Plod je mesnata čaura, žuto-zelene boje i otvara se sa tri šava. Sadrži nekoliko semena svetle boje. Visibaba je mirmekohorna biljka, što znači da njeno seme raznose mravi. Živi u listopadnim, mešovitim i četinarskim šumama, od poplavnih nizijskih šuma do subalpskih regiona. U Alpima se može naći na visinama i do 2200 m nadmorske visine. Raste u manje-više vlažnim šumama. Pojava prvih cvetova označava donekle kraj zime, odnosno početak vegetacionog perioda, tj. vreme kada vegetacija počinje da buja.`,
    lat: plantLocations[16].lat,
    lng: plantLocations[16].lng,
    location: plantLocations[16].location
  }
];

const openGoogleMapsDirections = (lat, lng) => {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank');
};

export default function PlantDetail() {
  const { id: plantId } = useParams();
  const navigate = useNavigate();
  const plant = plantsWithLocations.find(p => p.id === parseInt(plantId));
  // ... rest of the code

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

  // Debug plant data
  console.log('Plant data:', plant);
  
  // State for map
  const [mapCenter, setMapCenter] = useState(() => {
    // Default center for Serbia
    const defaultCenter = [44.0165, 21.0059];
    
    if (!plant) return defaultCenter;
    
    // Check if plant has valid coordinates
    const hasValidCoords = plant.lat !== undefined && plant.lng !== undefined && 
                         !isNaN(plant.lat) && !isNaN(plant.lng);
    
    return hasValidCoords ? [plant.lat, plant.lng] : defaultCenter;
  });
  const [zoomLevel, setZoomLevel] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Location management
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });
  
  // Image management
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Camera state
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const cameraRef = useRef(null);
  const [hasConsented, setHasConsented] = useState(false);
  
  // Set initial selected location when component mounts
  useEffect(() => {
    if (plant) {
      setSelectedLocation({
        lat: plant.lat,
        lng: plant.lng,
        location: plant.location || 'Nepoznata lokacija'
      });
    }
  }, [plant]);

  // User data from localStorage
  const [userImages, setUserImages] = useState(() => {
    const savedImages = localStorage.getItem(`plantImages_${plantId}`);
    return savedImages ? JSON.parse(savedImages) : [];
  });

  const [userLocations, setUserLocations] = useState(() => {
    const savedLocations = localStorage.getItem(`userLocations_${plantId}`);
    return savedLocations ? JSON.parse(savedLocations) : [];
  });

  // Get default locations for the current plant
  const defaultLocations = useMemo(() => {
    return getPlantLocations(parseInt(plantId));
  }, [plantId]);

  // Combine default and user locations with type information
  const allLocations = useMemo(() => {
    return [
      ...defaultLocations.map(loc => ({
        ...loc,
        type: 'default',
        icon: '📍',
        color: 'text-emerald-600'
      })),
      ...userLocations.filter(loc => 
        !defaultLocations.some(dl => dl.lat === loc.lat && dl.lng === loc.lng)
      ).map(loc => ({
        ...loc,
        type: 'user',
        icon: '👤',
        color: 'text-blue-600'
      }))
    ];
  }, [defaultLocations, userLocations]);

  // Handle location selection
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
  }, []);

  // Handle map click to add new location
  const handleMapClick = useCallback((e) => {
    const { lat, lng } = e.latlng;
    const newLoc = {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      name: `Nova lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      type: 'user',
      icon: '👤',
      color: 'text-blue-600',
      location: `Korisnička lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };
    
    setClickedPosition({ lat, lng });
    setNewLocation({
      name: `Moja lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6)
    });
    
    // Set as selected location
    setSelectedLocation(newLoc);
    setMapCenter([lat, lng]);
    
    // Show the add location form
    setShowAddLocation(true);
  }, []);

  // Function to add a new location
  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) return;
    
    const location = {
      lat: parseFloat(newLocation.lat),
      lng: parseFloat(newLocation.lng),
      location: newLocation.name,
      type: 'user',
      icon: '👤',
      color: 'text-blue-600'
    };
    
    // Add to user locations if it doesn't exist
    const locationExists = userLocations.some(loc => 
      loc.lat === location.lat && 
      loc.lng === location.lng
    );
    
    if (!locationExists) {
      const updatedLocations = [...userLocations, location];
      setUserLocations(updatedLocations);
      saveToLocalStorage(`userLocations_${plantId}`, updatedLocations);
      
      // Show success message
      alert('Lokacija je uspešno dodata!');
    } else {
      // If location exists, just select it
      alert('Ova lokacija već postoji u vašoj listi.');
    }
    
    // Select the new location
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    
    // Reset the form
    setNewLocation({ name: '', lat: '', lng: '' });
    setShowAddLocation(false);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Molimo izaberite sliku!');
      return;
    }

    // Update state
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload
  const handleUploadImage = async () => {
    if (!imageFile || !selectedLocation) return;
    
    setIsUploading(true);
    try {
      // Create a new image object
      const newImage = {
        id: Date.now(),
        url: imagePreview,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          location: selectedLocation.location || 'Nepoznata lokacija'
        },
        uploadedAt: new Date().toISOString()
      };

      // Update state and save to localStorage
      const updatedImages = [...userImages, newImage];
      setUserImages(updatedImages);
      saveToLocalStorage(`plantImages_${plantId}`, updatedImages);

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('image-upload');
      if (fileInput) {
        fileInput.value = '';
      }

      // Show success message
      alert('Fotografija je uspešno sačuvana!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Došlo je do greške prilikom čuvanja fotografije.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button and title */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-700 hover:text-emerald-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Nazad na kolekciju</span>
          </button>
          
          <div className="border-l-4 border-emerald-500 pl-4">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900">
              {plant.name}
            </h1>
            <p className="text-gray-600 mt-2">{plant.scientificName}</p>
          </div>
        </div>

        {/* Plant locations */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lokacije</h3>
          <div className="flex flex-wrap gap-3">
            {allLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLocation && selectedLocation.lat === location.lat && selectedLocation.lng === location.lng
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className={location.color}>{location.icon}</span>
                <span className="ml-2">{location.location}</span>
                <span className="ml-2 text-sm text-gray-600">{location.type === 'default' ? '(verifikovana)' : '(korisnik)'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map container */}
        <div className="mb-6">
          <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {allLocations.map((location, index) => (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                icon={location.type === 'user' ? userIcon : defaultIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{location.location}</h3>
                    <p className="text-sm text-gray-600">
                      {location.type === 'default' ? 'Verifikovana lokacija' : 'Korisnička lokacija'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationSelect(location);
                      }}
                      className="mt-2 px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Izaberi lokaciju
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Add location form */}
        {showAddLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Dodajte novu lokaciju</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Naziv lokacije</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newLocation.lat}
                    onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newLocation.lng}
                    onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setNewLocation({ name: '', lat: '', lng: '' });
                    setShowAddLocation(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Odustani
                </button>
                <button
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  Dodaj lokaciju
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image upload section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dodavanje slika</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera section */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-4">Kamera</h4>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                {cameraStream ? (
                  <video
                    ref={cameraRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <button
                      onClick={() => {
                        if (hasConsented) {
                          navigator.mediaDevices.getUserMedia({ video: true })
                            .then(stream => {
                              setCameraStream(stream);
                              if (cameraRef.current) {
                                cameraRef.current.srcObject = stream;
                              }
                            })
                            .catch(err => console.error('Error accessing camera:', err));
                        } else {
                          setHasConsented(true);
                        }
                      }}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {hasConsented ? 'Prikaži kameru' : 'Dopusti pristup kameri'}
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    if (cameraRef.current) {
                      const canvas = document.createElement('canvas');
                      canvas.width = cameraRef.current.videoWidth;
                      canvas.height = cameraRef.current.videoHeight;
                      canvas.getContext('2d').drawImage(cameraRef.current, 0, 0);
                      setCameraImage(canvas.toDataURL('image/jpeg'));
                      setHasConsented(false);
                    }
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Snimi
                </button>
                <button
                  onClick={() => {
                    if (cameraStream) {
                      cameraStream.getTracks().forEach(track => track.stop());
                      setCameraStream(null);
                      setHasConsented(false);
                    }
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Zatvori
                </button>
              </div>
            </div>

            {/* File upload section */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-4">Dodavanje slike</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Kliknite ili prevucite sliku</p>
                  </div>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <div className="mt-2 flex justify-between">
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        const fileInput = document.getElementById('image-upload');
                        if (fileInput) {
                          fileInput.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={handleUploadImage}
                      disabled={isUploading}
                      className={`px-4 py-2 ${isUploading ? 'bg-gray-400' : 'bg-emerald-600'} text-white rounded-lg transition-colors`}
                    >
                      {isUploading ? 'Sačekajte...' : 'Sačuvaj sliku'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image gallery */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Galerija slika</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userImages.map((image, index) => (
              <div
                key={index}
                className="relative group"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={`Plant ${image.id}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                  <p className="text-sm">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-200">{image.location.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Pregled slike</h3>
                  <button
                    onClick={closeImageModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="relative aspect-video mb-6">
                  <img
                    src={selectedImage.url}
                    alt={`Plant ${selectedImage.id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lokacija: {selectedImage.location.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

  // Debug plant data
  console.log('Plant data:', plant);
  
  // State for map
  const [mapCenter, setMapCenter] = useState(() => {
    // Default center for Serbia
    const defaultCenter = [44.0165, 21.0059];
    
    if (!plant) return defaultCenter;
    
    // Check if plant has valid coordinates
    const hasValidCoords = plant.lat !== undefined && plant.lng !== undefined && 
                         !isNaN(plant.lat) && !isNaN(plant.lng);
    
    return hasValidCoords ? [plant.lat, plant.lng] : defaultCenter;
  });
  const [zoomLevel, setZoomLevel] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Location management
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });
  
  // Image management
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Camera state
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const cameraRef = useRef(null);
  const [hasConsented, setHasConsented] = useState(false);
  
  // Set initial selected location when component mounts
  useEffect(() => {
    if (plant) {
      setSelectedLocation({
        lat: plant.lat,
        lng: plant.lng,
        location: plant.location || 'Nepoznata lokacija'
      });
    }
  }, [plant]);
  
  // User data from localStorage
  const [userImages, setUserImages] = useState(() => {
    const savedImages = localStorage.getItem(`plantImages_${plantId}`);
    return savedImages ? JSON.parse(savedImages) : [];
  });
  
  const [userLocations, setUserLocations] = useState(() => {
    const savedLocations = localStorage.getItem(`userLocations_${plantId}`);
    return savedLocations ? JSON.parse(savedLocations) : [];
  });
  
  // Get default locations for the current plant
  const defaultLocations = useMemo(() => {
    return getPlantLocations(parseInt(plantId));
  }, [plantId]);
  
  // Combine default and user locations with type information
  const allLocations = useMemo(() => {
    return [
      ...defaultLocations.map(loc => ({
        ...loc,
        type: 'default',
        icon: '📍',
        color: 'text-emerald-600'
      })),
      ...userLocations.filter(loc => 
        !defaultLocations.some(dl => dl.lat === loc.lat && dl.lng === loc.lng)
      ).map(loc => ({
        ...loc,
        type: 'user',
        icon: '👤',
        color: 'text-blue-600'
      }))
    ];
  }, [defaultLocations, userLocations]);
  
  // Set initial selected location if not set
  useEffect(() => {
    if (allLocations.length > 0 && !selectedLocation) {
      setSelectedLocation(allLocations[0]);
    }
  }, [allLocations, selectedLocation]);
  
  // Load saved data from localStorage and set up cleanup
  useEffect(() => {
    const savedImages = getFromLocalStorage(`plantImages_${plantId}`) || [];
    const savedLocations = getFromLocalStorage(`userLocations_${plantId}`) || [];
    setUserImages(savedImages);
    setUserLocations(savedLocations);
    
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [plantId]);
  
  // Handle geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location: 'Vaša lokacija'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);
  
  // Handle location selection
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
  }, []);
  
  // Handle map click to add new location
  const handleMapClick = useCallback((e) => {
    const { lat, lng } = e.latlng;
    const newLoc = {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      name: `Nova lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      type: 'user',
      icon: '👤',
      color: 'text-blue-600',
      location: `Korisnička lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };
    
    setClickedPosition({ lat, lng });
    setNewLocation({
      name: `Moja lokacija (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6)
    });
    
    // Set as selected location
    setSelectedLocation(newLoc);
    setMapCenter([lat, lng]);
    
    // Show the add location form
    setShowAddLocation(true);
  }, []);

  // Function to add a new location
  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.lat || !newLocation.lng) return;
    
    const location = {
      lat: parseFloat(newLocation.lat),
      lng: parseFloat(newLocation.lng),
      location: newLocation.name,
      type: 'user',
      icon: '👤',
      color: 'text-blue-600'
    };
    
    // Add to user locations if it doesn't exist
    const locationExists = userLocations.some(loc => 
      loc.lat === location.lat && 
      loc.lng === location.lng
    );
    
    if (!locationExists) {
      const updatedLocations = [...userLocations, location];
      setUserLocations(updatedLocations);
      saveToLocalStorage(`userLocations_${plantId}`, updatedLocations);
      
      // Show success message
      alert('Lokacija je uspešno dodata!');
    } else {
      // If location exists, just select it
      alert('Ova lokacija već postoji u vašoj listi.');
    }
    
    // Select the new location
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    
    // Reset the form
    setNewLocation({ name: '', lat: '', lng: '' });
    setShowAddLocation(false);
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Molimo izaberite sliku!');
      return;
    }

    // Update state
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
      alert('Molimo izaberite isključivo slike.');
      return;
    }
    
    // Set the image file
    setImageFile(file);
    
    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setShowImagePreview(true);
      
      // If we're using the camera, also set the camera image
      if (e.target.id === 'camera-upload') {
        setCameraImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset the file input
    e.target.value = '';
  };

  // Camera functions
  const handleCameraClick = async () => {
    // If camera is already active, stop it
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraImage(null);
      return;
    }

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      setCameraStream(stream);
      
      // Set the stream to the video element
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        cameraRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Nije moguće pristupiti kameri. Molimo osigurajte dozvole za korištenje kamere.');
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (!cameraStream || !cameraRef.current) return;
    
    const video = cameraRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    try {
      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Create a blob from the data URL
      fetch(imageDataUrl)
        .then(res => res.blob())
        .then(blob => {
          // Create a file from the blob
          const file = new File([blob], `plant-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // Set the image file and preview
          setImageFile(file);
          setImagePreview(URL.createObjectURL(blob));
          setCameraImage(URL.createObjectURL(blob));
          setShowImagePreview(true);
          
          // Stop the camera stream
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        })
        .catch(error => {
          console.error('Error creating image blob:', error);
          alert('Došlo je do greške prilikom snimanja fotografije.');
        });
    } catch (error) {
      console.error('Error capturing image:', error);
      alert('Došlo je do greške prilikom snimanja fotografije.');
    }
  };

  const handleCameraUpload = async () => {
    if (cameraImage && selectedLocation) {
      try {
        setIsUploading(true);
        const imageBlob = dataURLtoBlob(cameraImage);
        const file = new File([imageBlob], 'camera-image.jpg', { type: 'image/jpeg' });
        const newImage = await uploadImage(file, selectedLocation);
        
        // Update the user images state
        setUserImages(prev => [...prev, newImage]);
        setCameraImage(null);
        
        // Show success message
        alert('Fotografija je uspešno sačuvana!');
      } catch (error) {
        console.error('Error uploading camera image:', error);
        alert('Došlo je do greške prilikom čuvanja fotografije.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Handle image upload
  const handleUploadImage = async () => {
    if (!imageFile || !selectedLocation) return;
    
    setIsUploading(true);
    try {
      // Create a new image object
      const newImage = {
        id: Date.now(),
        url: imagePreview,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          location: selectedLocation.location || 'Nepoznata lokacija'
        },
        uploadedAt: new Date().toISOString()
      };

      // Update state and save to localStorage
      const updatedImages = [...userImages, newImage];
      setUserImages(updatedImages);
      saveToLocalStorage(`plantImages_${plantId}`, updatedImages);

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('image-upload');
      if (fileInput) {
        fileInput.value = '';
      }

      // Show success message
      alert('Fotografija je uspešno sačuvana!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Došlo je do greške prilikom čuvanja fotografije.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Lokacije</h3>
        <div className="flex flex-wrap gap-3">
          {allLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLocation && selectedLocation.lat === location.lat && selectedLocation.lng === location.lng
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className={location.color}>{location.icon}</span>
              <span className="ml-2">{location.location}</span>
              <span className="ml-2 text-sm text-gray-600">{location.type === 'default' ? '(verifikovana)' : '(korisnik)'}</span>
            </button>
          ))}
        </div>
      </div>
        {/* Back button and title */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-700 hover:text-emerald-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Nazad na kolekciju</span>
          </button>
          
          <div className="border-l-4 border-emerald-500 pl-4">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900">
              {plant.name}
            </h1>
            {plant.scientificName && (
              <p className="text-lg text-amber-700 italic mt-1">
                {plant.scientificName}
              </p>
            )}
            {plant.location && (
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1 text-amber-600" />
                <span className="text-sm">{plant.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Plant Image - Maximized Display */}
          <div className="relative rounded-xl shadow-xl border-2 border-emerald-200 overflow-hidden" style={{ minHeight: '28rem' }}>
            {/* Plant background pattern */}
            <div className="absolute inset-0 bg-[url('/assets/plant-bg-pattern.png')] opacity-10 rounded-xl"></div>
            {/* Green frame */}
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-xl"></div>
            
            {/* Main image container */}
            <div className="relative h-full w-full p-2 flex items-center justify-center">
              {cameraStream ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    ref={cameraRef}
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg border border-emerald-200"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={captureImage}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      aria-label="Capture image"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-white"></div>
                    </button>
                  </div>
                </div>
              ) : cameraImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={cameraImage}
                    alt="Captured plant"
                    className="w-full h-full max-h-[70vh] object-contain rounded-lg border border-emerald-200"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={() => setCameraImage(null)}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      aria-label="Retake photo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCameraUpload}
                      disabled={isUploading}
                      className="p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      aria-label="Upload photo"
                    >
                      {isUploading ? (
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full max-w-4xl flex items-center justify-center p-4">
                  {/* Clickable overlay for zoom functionality */}
                  <div 
                    className="absolute inset-0 cursor-zoom-in" 
                    onClick={() => {
                      const img = document.querySelector('.plant-main-image');
                      img?.classList.toggle('scale-110');
                    }}
                  ></div>
                  
                  {/* Plant image */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="plant-main-image h-full w-full object-cover transition-transform duration-300 ease-in-out rounded-lg border border-emerald-200"
                      style={{
                        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                        imageRendering: 'crisp-edges'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/placeholder-plant.png';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Image action hint */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-emerald-50/80 to-emerald-100/80 border-t border-emerald-200 backdrop-blur-sm">
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm text-emerald-700">Kliknite za uvećanje slike</p>
                {isUploading ? (
                  <Image className="w-6 h-6 text-emerald-600 animate-spin" />
                ) : (
                  <div className="flex gap-2">
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer flex items-center"
                    >
                      <Image className="w-4 h-4 mr-1" />
                      <span>Dodajte fotografiju</span>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <button
                      onClick={handleCameraClick}
                      className={`px-4 py-2 ${
                        cameraStream 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      } text-white rounded-lg transition-colors flex items-center`}
                    >
                      {cameraStream ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          <span>Zatvori kameru</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-1" />
                          <span>Fotografiraj</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {cameraImage && (
                  <div className="mt-2">
                    <img
                      src={cameraImage}
                      alt="Camera preview"
                      className="w-32 h-32 object-cover rounded-lg border border-emerald-200"
                    />
                    <button
                      onClick={handleCameraUpload}
                      className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Upload slike
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Plant Description */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-1 bg-emerald-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-semibold text-emerald-800">
                Opis biljke
              </h2>
            </div>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {plant.fullDesc ? (
                <p>{plant.fullDesc}</p>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Opis ove biljke trenutno nije dostupan.</p>
                  <p className="mt-2 text-sm">Vratite se kasnije za više informacija.</p>
                </div>
              )}
            </div>
            
            {/* Additional information section */}
            <div className="mt-8 pt-6 border-t border-amber-100">
              <h3 className="text-lg font-medium text-emerald-800 mb-3">Dodatne informacije</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-amber-700">Verifikovane lokacije</p>
                  <div className="flex flex-col gap-2">
                    {allLocations.filter(loc => loc.type === 'default').map((loc, index) => (
                      <span key={index} className="text-emerald-600 flex items-center">
                        <span className="text-emerald-600">📍</span>
                        <span className="ml-2">{loc.location}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Lokacije korisnika</p>
                  <div className="flex flex-col gap-2">
                    {allLocations.filter(loc => loc.type === 'user').map((loc, index) => (
                      <span key={index} className="text-blue-600 flex items-center">
                        <span className="text-blue-600">👤</span>
                        <span className="ml-2">{loc.location}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

      {/* Map Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
          {currentLocation && (
            <div className="p-4 bg-emerald-50 border-b border-emerald-200">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-800">Vaša lokacija</p>
                  <p className="text-sm text-gray-600">{currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => setSelectedLocation(currentLocation)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
                    >
                      Koristi ovu lokaciju
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.clearWatch();
                          setCurrentLocation(null);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Isključi praćenje lokacije
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="p-6 border-b border-amber-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-emerald-800 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-amber-600" />
                  Lokacije biljke
                </h2>
                <p className="text-gray-600 mt-1">
                  Gde se ova biljka može naći u prirodi
                </p>
              </div>
              <button
                onClick={() => setShowAddLocation(!showAddLocation)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                {showAddLocation ? 'Otkaži' : 'Dodaj lokaciju'}
              </button>
            </div>

            {/* Add Location Form */}
            {showAddLocation && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-medium text-emerald-800 mb-3">Dodajte novu lokaciju</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naziv lokacije</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Npr. Fruška gora, Srbija"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Širina (lat)</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="44.8200"
                        value={newLocation.lat}
                        onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dužina (lng)</label>
                      <input
                        type="number"
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="20.4600"
                        value={newLocation.lng}
                        onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddLocation(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Otkaži
                  </button>
                  <button
                    onClick={handleAddLocation}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                    disabled={!newLocation.name || !newLocation.lat || !newLocation.lng}
                  >
                    Sačuvaj lokaciju
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-96 w-full relative">
            {mapCenter && mapCenter.every(coord => coord !== undefined && !isNaN(coord)) ? (
              <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                className="z-0"
                whenCreated={(map) => {
                  // Add click handler to the map
                  map.on('click', handleMapClick);
                  return map;
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {allLocations.map((location, index) => {
                  const isSelected = selectedLocation && 
                    selectedLocation.lat === location.lat && 
                    selectedLocation.lng === location.lng;
                   
                  return (
                    <Marker
                      key={`location-${index}`}
                      position={[location.lat, location.lng]}
                      icon={isSelected ? selectedIcon : defaultIcon}
                      eventHandlers={{
                        click: () => handleLocationSelect(location)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">{location.location}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGoogleMapsDirections(location.lat, location.lng);
                            }}
                            className="mt-2 text-sm text-blue-600 hover:underline"
                          >
                            Prikaži pravce
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                
                {userLocations.map((loc, index) => {
                  const isSelected = selectedLocation && 
                    selectedLocation.lat === loc.lat && 
                    selectedLocation.lng === loc.lng;
                  
                  return (
                    <Marker
                      key={`user-location-${index}`}
                      position={[loc.lat, loc.lng]}
                      icon={isSelected ? selectedIcon : userIcon}
                      eventHandlers={{
                        click: () => handleLocationSelect(loc)
                      }}
                  >
                    <Popup className="text-center">
                      <div className="font-medium text-emerald-800">
                        {loc.name || 'Vaša lokacija'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {loc.location || `(${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`}
                      </div>
                      <div className="flex justify-center space-x-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMapsDirections(loc.lat, loc.lng);
                          }}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 flex items-center"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Pravci
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(loc);
                            document.getElementById('image-upload').click();
                          }}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded hover:bg-emerald-200 flex items-center"
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          Dodaj sliku
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Clicked position marker */}
              {clickedPosition && (
                <Marker 
                  position={[clickedPosition.lat, clickedPosition.lng]} 
                  icon={createCustomIcon('#e74c3c')}
                />
              )}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p>Učitavanje mape...</p>
              </div>
            )}
          </div>
          
          {/* Location List */}
          <div className="border-t border-amber-100">
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Lokacije</h3>
              <div className="space-y-2">
                {allLocations?.map((loc, index) => (
                  <div 
                    key={`${loc.lat}-${loc.lng}-${index}`}
                    className={`p-3 rounded-lg cursor-pointer ${selectedLocation?.lat === loc.lat && selectedLocation?.lng === loc.lng ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => handleLocationSelect(loc)}
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium">{loc.location || 'Nepoznata lokacija'}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {loc.lat}, {loc.lng}
                    </div>
                  </div>
                ))}
                {allLocations.length === 0 && (
                  <p className="text-gray-500 text-sm">Nema dostupnih lokacija za ovu biljku.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
          <div className="p-6 border-b border-amber-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-emerald-800 flex items-center">
                  <Camera className="h-6 w-6 mr-2 text-amber-600" />
                  Galerija slika
                </h2>
                {imagePreview && (
                  <>
                    <h3 className="font-medium text-emerald-800 mb-3">Pregled fotografije</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Pregled" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija</label>
                          <div className="bg-white border border-gray-300 rounded-md p-2 text-sm">
                            {selectedLocation?.location || 'Nepoznata lokacija'}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Otkaži
                          </button>
                          <button
                            onClick={handleUploadImage}
                            disabled={isUploading}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center"
                          >
                            {isUploading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Šaljem...
                              </>
                            ) : (
                              'Sačuvaj fotografiju'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
          </div>
          
          {/* Image Grid */}
          {userImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2">
              {userImages.map((img) => (
                <div 
                  key={img.id} 
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(img)}
                >
                  <img 
                    src={img.url} 
                    alt={`Fotografija ${plant.name}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs truncate">{img.location.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
               <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>Još uvek nema slika za ovu biljku.</p>
              <p className="text-sm mt-1">Budite prvi koji će podeliti svoju fotografiju!</p>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
            <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button 
                onClick={closeImageModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden">
                <img 
                  src={selectedImage.url} 
                  alt={`Fotografija ${plant.name}`} 
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                <div className="p-4 bg-white">
                  <p className="font-medium">{selectedImage.location.location}</p>
                  <p className="text-sm text-gray-600">
                    Dodato: {new Date(selectedImage.timestamp).toLocaleDateString()}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedImage.location.lat},${selectedImage.location.lng}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 mt-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    onClick={e => e.stopPropagation()}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Pravci
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to top button for better navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm"
          >
            Nazad na vrh
          </button>
        </div>
      </div>

      {/* Camera UI */}
      {cameraStream && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <video 
            ref={cameraRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8">
            <button 
              onClick={handleCameraClick}
              className="bg-red-500 text-white rounded-full p-3"
              aria-label="Close camera"
            >
              <X className="h-6 w-6" />
            </button>
            <button 
              onClick={captureImage}
              className="bg-white rounded-full p-2 border-4 border-white"
              aria-label="Take photo"
            >
              <div className="w-12 h-12 rounded-full bg-white" />
            </button>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        </div>
      )}
    </div>
  );
}
