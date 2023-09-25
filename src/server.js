const http = require('http');
const url = require('url');

const query = require('querystring');

const htmlHandler = require('./Responses.js');
const jsonHandler = require('./Responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// struct for each possible default URL
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  notFound: jsonHandler.notFound,
};

// handle the request
const onRequest = (request, response) => {
  // parse the URL
  const parsedUrl = url.parse(request.url);

  // check query parameters
  const params = query.parse(parsedUrl.query);

  // check what type the user wants
  const acceptedTypes = request.headers.accept.split(',');

  // if its valid, handle appropriately
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else { // send a 404 for invalid url
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
