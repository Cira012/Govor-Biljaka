module.exports = async function (context, req) {
    context.log('Processing plant observation request');

    try {
        // Get the request body
        const observation = req.body;

        // Add timestamp if not provided
        if (!observation.timestamp) {
            observation.timestamp = new Date().toISOString();
        }

        // Add a unique ID
        observation.id = context.invocationId || `obs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Log the observation (for debugging)
        context.log('Saving observation:', observation);

        // Save to blob storage
        context.bindings.outputBlob = JSON.stringify(observation);

        // Return success response
        context.res = {
            status: 201,
            body: {
                ...observation,
                // Include the blob path for reference
                blobPath: `plant-observations/${observation.id}.json`
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    } catch (error) {
        context.log.error('Error processing request:', error);
        
        // Return error response
        context.res = {
            status: 500,
            body: {
                error: 'Failed to save observation',
                details: error.message
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
};
