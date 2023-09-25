const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// gets the HTML
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write(index);

  response.end();
};

// gets the CSS
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(css);

  response.end();
};

// handler for XML
const respondXML = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'text/xml',
  };

  response.writeHead(status, headers);

  let responseXML = '<response>';
  responseXML = `${responseXML}<message>${object.message}</message>`;
  if (object.id) {
    responseXML = `${responseXML}<id>${object.id}</id>`;
  }
  responseXML = `${responseXML}</response>`;

  response.write(responseXML);

  response.end();
};

// handler for JSON
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);

  response.write(JSON.stringify(object));

  response.end();
};

// functions for each URL (sending back XML if requested, JSON by default)
const success = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
  };
  if (acceptedTypes[0] === 'text/xml') {
    respondXML(request, response, 200, responseJSON);
  } else {
    respondJSON(request, response, 200, responseJSON);
  }
};

const badRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';

    responseJSON.id = 'badRequest';

    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 400, responseJSON);
    }
    return respondJSON(request, response, 400, responseJSON);
  }

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (acceptedTypes[0] === 'text/xml') {
    respondXML(request, response, 404, responseJSON);
  } else {
    respondJSON(request, response, 404, responseJSON);
  }
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'You have successfully viewed the content.',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing valid query parameter set to yes';

    responseJSON.id = 'unauthorized';

    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 401, responseJSON);
    }
    return respondJSON(request, response, 401, responseJSON);
  }

  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  if (acceptedTypes[0] === 'text/xml') {
    respondXML(request, response, 403, responseJSON);
  } else {
    respondJSON(request, response, 403, responseJSON);
  }
};

const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  if (acceptedTypes[0] === 'text/xml') {
    respondXML(request, response, 500, responseJSON);
  } else {
    respondJSON(request, response, 500, responseJSON);
  }
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  if (acceptedTypes[0] === 'text/xml') {
    respondXML(request, response, 501, responseJSON);
  } else {
    respondJSON(request, response, 501, responseJSON);
  }
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
