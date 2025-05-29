// File: src/components/Flashcard.jsx
import { Link } from "react-router-dom";

function Flashcard({ plant }) {
  return (
    <Link
      to={`/collection/${plant.id}`}
      className="bg-black/60 text-white rounded-xl p-4 w-72 shadow-xl hover:scale-105 transition-transform backdrop-blur-md border border-white/10"
    >
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full h-44 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold mb-1">{plant.name}</h3>
      <p className="text-sm text-gray-300">{plant.shortDesc}</p>
    </Link>
  );
}

export default Flashcard;
