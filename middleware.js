const waitForChange = (timeout = 30000) => {
    let resolver;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });
  
    const timeoutId = setTimeout(() => {
      resolver();
    }, timeout);
  
    return {
      promise,
      resolver,
      timeoutId
    };
  };
  
  const clients = new Set();
  
  const longPollingMiddleware = (req, res, next) => {

    console.log("in the middleware");
    if (req.method === 'GET' && req.path === '/poll') {
      const { promise, resolver, timeoutId } = waitForChange();
      clients.add({ resolver, timeoutId });
  
      promise.then(() => {
        res.status(200).json({ message: 'Update available' });
        clients.delete({ resolver, timeoutId });
      });
    } else {
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        req.on('end', () => {
          clients.forEach(({ resolver, timeoutId }) => {
            clearTimeout(timeoutId);
            resolver();
          });
          clients.clear();
        });
      }
      next();
    }
  };
  
  module.exports = longPollingMiddleware;
  