import { CosmosClient } from '@azure/cosmos';

// Direct configuration (for development only)
const endpoint = 'https://suza-plants-db-eu.documents.azure.com:443/';
const key = 'fRtDjSJ6EP7Gvo9mCtPPFqVYnGc9tX5qkguNTlB6Dl8UVJXqww4uyetqia1E8bkSFp7UoMxpnVyeACDb6NaxIW==';
const databaseId = 'plants-db';
const containerId = 'plant-observations';

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
