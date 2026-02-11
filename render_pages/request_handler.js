export const handleRequest = (request, htmlHandler, notFoundHandler) => {
  const paths = {
    '/': 'main_page.html',
    '/page1': 'page1.html',
    '/main_page': 'main_page.html'
  }

  const filePath = paths[request.path];
  const response = filePath ?
    htmlHandler(request,filePath) :
    notFoundHandler(request);
  return response;
}