// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const fromRR = require('./routing-request');

// Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const queryStringObject = parsedUrl.query;

    const method = req.method.toLocaleLowerCase();

    const headers = req.headers;

    // Get the payload
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => buffer += decoder.write(data));
    req.on('end', () => {
        buffer += decoder.end();

        // Chose the handler this request should go to;
        const chosenHandler = typeof(fromRR.router[trimmedPath]) !== 'undefined'
        ? fromRR.router[trimmedPath] : fromRR.handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler ,or default to an empty object
            payload = typeof(payload) === 'object' ? payload : {};
            const  payloadString = JSON.stringify(payload);

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Request this response: ', statusCode, payloadString);
        });
    });
});

// Start Server
server.listen(3000, () => {
    console.log('The server is listening on port 3000 now');
});


