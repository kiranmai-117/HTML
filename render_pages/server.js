import { handleRequest } from "./render_pages/request_handler.js";

const readRequest = async (conn) => {
  const decoder = new TextDecoder();
  const request = new Uint8Array(1024);
  const n = await conn.read(request);
  return decoder.decode(request.slice(0, n));
}

const parseRequest = (request) => {
  const [reqLine, ...headers] = request.split('\r\n');
  const [method, path, protocol] = reqLine.split(' ');
  return { method, path, protocol, headers: { ...headers } };
}

const createHeaders = (headers) => {
  return Object.entries(headers).map(([key, value]) =>
    `${key}:${value}`).join('\r\n');
}

const createRespLine = (response) => {
  const msg = {
    200: ' OK',
    404: ' NOT FOUND'
  }
  return `${response.protocol} ${response.statusCode} ${msg[response.statusCode]}`;
}

const formatResponse = (response) =>
  [
    createRespLine(response),
    createHeaders(response.headers),
    '',
    response.body
  ].join('\r\n')

const sendResponse = async (conn, response) => {
  const encoder = new TextEncoder();
  await conn.write(encoder.encode(response));
}

const createResponse = (request, statusCode, type, body) => {
  const response = {
    protocol: request.protocol,
    statusCode,
    headers: {
      'content-length': body.length,
      'content-type': type,
    },
    body,
  }
  return response;
}

const htmlHandler = (request, path) => {
  const body = Deno.readTextFileSync(path);
  return createResponse(request, 200, 'text/html', body);
}

const notFoundHandler = (request) => {
  const body = '<h3>NOT FOUND</h3>';
  return createResponse(request, 404, 'text/html',body);
}

export const handleConnection = async (conn) => {
  const reqData = await readRequest(conn);
  const request = parseRequest(reqData);
  const response = await handleRequest(request, htmlHandler, notFoundHandler);
  const finalResponse = formatResponse(response);
  await sendResponse(conn, finalResponse);
}
