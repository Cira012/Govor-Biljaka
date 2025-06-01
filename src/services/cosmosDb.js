import { CosmosClient } from '@azure/cosmos';

// Helper function to get environment variables in both Vite and Node.js
const getEnv = (key, defaultValue = '') => {
  // In browser (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  // In Node.js
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

// Get configuration from environment variables
// Using PUBLIC_ prefix for Vite client-side environment variables
const connectionString = getEnv('PUBLIC_COSMOS_CONNECTION_STRING') || getEnv('VITE_COSMOS_CONNECTION_STRING');
const databaseId = getEnv('PUBLIC_COSMOS_DATABASE') || getEnv('VITE_COSMOS_DATABASE', 'plants-db');
const containerId = getEnv('PUBLIC_COSMOS_CONTAINER') || getEnv('VITE_COSMOS_CONTAINER', 'plant-observations');

if (!connectionString) {
  throw new Error('Missing required Cosmos DB configuration. Please set VITE_COSMOS_CONNECTION_STRING environment variable.');
}

// Parse connection string
const endpoint = connectionString.match(/AccountEndpoint=([^;]+)/)?.[1];
const key = connectionString.match(/AccountKey=([^;]+)/)?.[1];

if (!endpoint || !key) {
  throw new Error('Invalid Cosmos DB connection string format');
}

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

export const savePlantObservation = async (observation) => {
    try {
        // Add timestamp and ID if not present
        const observationWithId = {
            ...observation,
            id: observation.id || `obs-${Date.now()}`,
            timestamp: observation.timestamp || new Date().toISOString(),
            // Ensure location is properly formatted
            location: observation.location || { lat: 0, lng: 0 }
        };

        const { resource } = await container.items.create(observationWithId);
        return resource;
    } catch (error) {
        console.error("Error saving to Cosmos DB:", error);
        throw error;
    }
};

export const getPlantObservations = async () => {
    try {
        const querySpec = {
            query: "SELECT * FROM c ORDER BY c.timestamp DESC"
        };
        const { resources } = await container.items.query(querySpec).fetchAll();
        return resources;
    } catch (error) {
        console.error("Error reading from Cosmos DB:", error);
        throw error;
    }
};
