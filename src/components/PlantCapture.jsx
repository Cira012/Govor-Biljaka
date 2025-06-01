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

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // ... [keep all existing camera and location code until handleSubmit] ...

  // Update the handleSubmit function
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
      // Create observation object
      const observation = {
        name: name || 'Nepoznata biljka',
        description,
        image,
        location: location || { lat: 0, lng: 0 },
        observationDate: new Date().toISOString(),
        // Add any additional fields you want to save
      };

      // Save to Cosmos DB
      await savePlantObservation(observation);

      // Show success message
      setSuccess('Zapažanje uspješno spremljeno!');

      // Reset form
      setImage(null);
      setName('');
      setDescription('');
      startCamera(); // Restart camera
    } catch (err) {
      console.error('Greška pri spremanju zapažanja:', err);
      setError('Došlo je do greške pri spremanju. Pokušajte ponovno.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... [keep the rest of the component code] ...
}
