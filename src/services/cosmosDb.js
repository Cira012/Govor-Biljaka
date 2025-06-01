import { BlobServiceClient } from '@azure/storage-blob';

// Azure Blob Storage configuration
const accountName = 'govorbiljaka360';
const containerName = 'plant-observations';
const sasToken = 'se=2026-06-02&sp=racwdl&spr=https&sv=2022-11-02&sr=c&sig=P6hghc6DKQoXr3paYyFIyKQlzfQeNBqpaMRyUJPx0zk%3D'; // Valid until 2026-06-02

// Ensure SAS token starts with ? if it doesn't already
const formattedSasToken = sasToken.startsWith('?') ? sasToken : `?${sasToken}`;

// Create a BlobServiceClient with SAS token
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net${formattedSasToken}`
);

// Get a reference to the container
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Helper function to convert stream to text
 * @param {ReadableStream} readable - The readable stream to convert
 * @returns {Promise<string>} - The text content of the stream
 */
async function streamToText(readable) {
  const chunks = [];
  const reader = readable.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString('utf-8');
  } finally {
    reader.releaseLock();
  }
}

/**
 * Saves a plant observation to Blob Storage
 * @param {Object} observation - The plant observation data to save
 * @returns {Promise<Object>} - The saved observation with additional metadata
 */
async function savePlantObservation(observation) {
  try {
    // Add timestamp if not present
    const observationWithTimestamp = {
      ...observation,
      timestamp: observation.timestamp || new Date().toISOString(),
    };

    // Create a unique blob name using timestamp
    const blobName = `observation-${Date.now()}.json`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Upload the data to the blob
    const uploadBlobResponse = await blockBlobClient.upload(
      JSON.stringify(observationWithTimestamp, null, 2),
      Buffer.byteLength(JSON.stringify(observationWithTimestamp))
    );

    return {
      ...observationWithTimestamp,
      id: blobName,
      _etag: uploadBlobResponse.etag,
      _timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving plant observation:', error);
    throw error;
  }

}

/**
 * Gets all plant observations from Blob Storage
 * @returns {Promise<Array>} - Array of plant observations
 */
async function getPlantObservations() {
  try {
    const observations = [];
    
    // List all blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
      if (blob.name.endsWith('.json')) {
        try {
          const blobClient = containerClient.getBlobClient(blob.name);
          const downloadBlockBlobResponse = await blobClient.download();
          const downloaded = await streamToText(downloadBlockBlobResponse.readableStreamBody);
          observations.push(JSON.parse(downloaded));
        } catch (error) {
          console.error(`Error processing blob ${blob.name}:`, error);
        }
      }
    }
    
    // Sort by timestamp descending
    return observations.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error('Error listing plant observations:', error);
    throw error;
  }
}

/**
 * Gets a single plant observation by ID
 * @param {string} id - The ID of the observation to retrieve
 * @returns {Promise<Object>} - The requested plant observation
 */
async function getPlantObservationById(id) {
  try {
    const blobClient = containerClient.getBlobClient(id);
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToText(downloadBlockBlobResponse.readableStreamBody);
    return JSON.parse(downloaded);
  } catch (error) {
    console.error(`Error fetching plant observation with id ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a plant observation by ID
 * @param {string} id - The ID of the observation to delete
 * @returns {Promise<Object>} - The result of the delete operation
 */
async function deletePlantObservation(id) {
  try {
    const blobClient = containerClient.getBlobClient(id);
    await blobClient.delete();
    return { id, deleted: true };
  } catch (error) {
    console.error(`Error deleting plant observation with id ${id}:`, error);
    throw error;
  }
}

// Export all functions and variables
export {
  savePlantObservation,
  getPlantObservations,
  getPlantObservationById,
  deletePlantObservation,
  containerClient,
  sasToken
};
