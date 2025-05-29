import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="/forest.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Pratimo Prirodu Zajedno</h1>
        <Link
          to="/zbirka"
          className="px-8 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-gray-100 transition-colors"
        >
          Uđi
        </Link>
      </div>
    </div>
  );
}
