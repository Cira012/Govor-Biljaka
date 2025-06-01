const { BlobServiceClient } = require('@azure/storage-blob');

// Replace with your storage account name and SAS token
const accountName = 'govorbiljaka360';
const sasToken = 'se=2026-06-02&sp=racwdl&spr=https&sv=2022-11-02&sr=c&sig=P6hghc6DKQoXr3paYyFIyKQlzfQeNBqpaMRyUJPx0zk%3D';

async function setCors() {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net${sasToken.startsWith('?') ? '' : '?'}${sasToken}`
    );

    // Define CORS rules
    const corsRule = {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'],
      exposedHeaders: ['*'],
      maxAgeInSeconds: 86400 // 24 hours
    };

    // Set CORS rules
    const serviceProperties = await blobServiceClient.getProperties();
    serviceProperties.cors = [corsRule];
    await blobServiceClient.setProperties(serviceProperties);

    console.log('CORS rules have been set successfully!');
  } catch (error) {
    console.error('Error setting CORS rules:', error);
  }
}

setCors();
