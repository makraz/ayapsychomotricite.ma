// www -> apex 301. Pages _redirects can't match on hostname, and Bulk Redirects need dashboard access.
export const onRequest = ({ request, next }) => {
  const url = new URL(request.url);
  if (url.hostname !== 'www.ayapsychomotricite.ma') return next();
  url.hostname = 'ayapsychomotricite.ma';
  url.protocol = 'https:';
  return Response.redirect(url.toString(), 301);
};
