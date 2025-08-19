const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const shortUrls = {};

app.post('/shorturls', (req, res) => {
  const { url, validity } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  if (validity && (isNaN(validity) || validity > 30 || validity <= 0)) {
    return res.status(400).json({ error: 'Validity must be between 1 and 30 minutes' });
  }

  const shortCode = uuidv4().slice(0, 6);
  const expiry = validity ? Date.now() + validity * 60000 : null;
  shortUrls[shortCode] = { originalUrl: url, expiry, clicks: [] };

  const shortLink = `http://${req.headers.host}/shorturls/${shortCode}`;
  res.status(201).json({
    shortlink: shortLink,
    validity: validity || 'Unlimited',
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
    delete shortUrls[shortCode];
    return res.status(410).json({ error: 'Short URL expired' });
  }

  const click = {
    timestamp: new Date().toISOString(),
    source: req.headers.referer || 'Direct',
    location: req.headers['x-forwarded-for'] || 'Unknown'
  };
  data.clicks.push(click);

  res.json({
    originalUrl: data.originalUrl,
    creationDate: new Date(data.expiry ? data.expiry - (validity * 60000) : Date.now()).toISOString(),
    expiryDate: data.expiry ? new Date(data.expiry).toISOString() : 'None',
    totalClicks: data.clicks.length,
    clickData: data.clicks
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));