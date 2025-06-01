import { CosmosClient } from '@azure/cosmos';

// Load environment variables from Vite
const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT;
const key = import.meta.env.VITE_COSMOS_KEY;
const databaseId = import.meta.env.VITE_COSMOS_DATABASE || 'plants-db';
const containerId = import.meta.env.VITE_COSMOS_CONTAINER || 'plant-observations';

if (!endpoint || !key) {
    throw new Error('Missing required Cosmos DB configuration. Please set VITE_COSMOS_ENDPOINT and VITE_COSMOS_KEY environment variables.');
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
