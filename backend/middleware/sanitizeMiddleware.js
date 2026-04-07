function sanitizeObject(value) {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => sanitizeObject(item));
    return;
  }

  Object.keys(value).forEach((key) => {
    const raw = value[key];

    // Strip MongoDB operator-style keys and dotted keys that can lead to query selector injection.
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key];
      return;
    }

    sanitizeObject(raw);
  });
}

function sanitizeMiddleware(req, res, next) {
  try {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    sanitizeObject(req.query);
    return next();
  } catch (error) {
    console.error('sanitizeMiddleware error:', error);
    return next(error);
  }
}

module.exports = {
  sanitizeMiddleware,
};
