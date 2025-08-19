const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

const corsMiddleware = require('./middleware/cors');
const bodyParserMiddleware = require('./middleware/bodyParser');
const validateInputMiddleware = require('./middleware/validateInput');
const loggerMiddleware = require('./middleware/logger');
const errorHandlerMiddleware = require('./middleware/errorHandler');


app.use(loggerMiddleware);
app.use(bodyParserMiddleware);
app.use(corsMiddleware);

const shortUrls = {};


app.post('/shorturls', validateInputMiddleware, (req, res) => {
  const { url, validity } = req.body;
  const shortCode = uuidv4().slice(0, 6);
  const expiry = validity ? Date.now() + validity * 60000 : null;
  shortUrls[shortCode] = { originalUrl: url, expiry, clicks: [] };

  const shortLink = `http://${req.headers.host}/short/${shortCode}`;
  res.status(201).json({
    shortlink: shortLink,
    validity: validity ? `${validity} minutes` : 'Unlimited',
    shortcode: shortCode
  });
});

app.get('/shorturls/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const data = shortUrls[shortCode];

  if (!data) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  if (data.expiry && Date.now() > data.expiry) {
    return res.status(410).json({ error: 'Short URL expired' });
  }

  res.json({
    originalUrl: data.originalUrl,
    createdAt: new Date(data.expiry ? data.expiry - (validity * 60000) : Date.now()).toISOString(),
    expiry: data.expiry ? new Date(data.expiry).toISOString() : 'Unlimited',
    totalClicks: data.clicks.length,
    clickData: data.clicks
  });
});


app.get('/short/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const data = shortUrls[shortCode];

  if (!data || (data.expiry && Date.now() > data.expiry)) {
    return res.status(410).send('Expired or not found');
  }

  data.clicks.push({
    timestamp: new Date().toISOString(),
    source: req.headers.referer || 'Direct',
    location: req.headers['x-forwarded-for'] || 'Unknown'
  });

  res.redirect(data.originalUrl);
});


app.use(errorHandlerMiddleware);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));