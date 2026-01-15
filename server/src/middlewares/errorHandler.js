function notFound(req, res, next) {
  res.status(404).json({ success: false, data: null, message: 'Not Found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, data: null, message });
}

module.exports = { notFound, errorHandler };
