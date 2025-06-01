module.exports = async function (context, req) {
    context.log('Processing plant observation request');

    try {
        // Get the request body
        const observation = req.body;

        // Add timestamp if not provided
        if (!observation.timestamp) {
            observation.timestamp = new Date().toISOString();
        }

        // Add ID for Cosmos DB
        observation.id = context.invocationId;

        // Log the observation (for debugging)
        context.log('Saving observation:', observation);

        // Return the observation (it will be saved to Cosmos DB by the output binding)
        context.bindings.outputDocument = observation;

        // Return success response
        context.res = {
            status: 201,
            body: observation,
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

    context.done();
};
