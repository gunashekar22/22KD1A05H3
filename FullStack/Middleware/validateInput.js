const validator = require('validator');

const validateInputMiddleware = (req, res, next) => {
  const { url, validity } = req.body;

  if (!url || !validator.isURL(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (validity && (isNaN(validity) || validity > 30 || validity <= 0)) {
    return res.status(400).json({ error: 'Validity must be a number between 1 and 30 minutes' });
  }

  next(); 
};

module.exports = validateInputMiddleware;