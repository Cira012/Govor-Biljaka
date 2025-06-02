import { BlobServiceClient } from '@azure/storage-blob';

// Configuration from your code
const accountName = 'govorbiljaka360';
const sasToken = 'se=2026-06-02T02:45Z&sp=rwdlacup&sv=2022-11-02&ss=b&srt=sco&sig=TuD4VW%2B8670mDWZbGHWak8C7CgBSZTZoYCfqGuRtP3A%3D';

// Ensure proper formatting
const cleanSasToken = sasToken.startsWith('?') ? sasToken : `?${sasToken}`;

async function testConnection() {
  try {
    // Create client
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net${cleanSasToken}`
    );

    console.log('Testing connection to Blob Storage...');
    
    // List containers
    console.log('Listing containers...');
    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`Container ${i++}: ${container.name}`);
    }

    // Test specific container
    const containerName = 'plant-observations';
    console.log(`\nTesting container '${containerName}'...`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    const exists = await containerClient.exists();
    console.log(`Container exists: ${exists}`);
    
    if (exists) {
      console.log('\nListing blobs in container:');
      let j = 1;
      for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`Blob ${j++}: ${blob.name} (${blob.properties.contentLength} bytes)`);
      }
    }
    
  } catch (error) {
    console.error('Error testing connection:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details || 'No additional details');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response body:', error.response.bodyAsText);
    }
  }
}

testConnection();
