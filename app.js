const express = require('express');
const client = require('prom-client');

const app = express();
app.use(express.json());

client.collectDefaultMetrics();

let items = [
  {
    id: 1,
    name: 'Student ID Card',
    location: 'Library',
    claimed: false,
  },
  {
    id: 2,
    name: 'Black Umbrella',
    location: 'Building B',
    claimed: false,
  },
];

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Campus Lost and Found API',
  });
});

app.get('/items', (req, res) => {
  res.status(200).json(items);
});

app.post('/items', (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      error: 'Name and location are required',
    });
  }

  const newItem = {
    id: items.length + 1,
    name,
    location,
    claimed: false,
  };

  items.push(newItem);
  return res.status(201).json(newItem);
});

app.patch('/items/:id/claim', (req, res) => {
  const itemId = Number(req.params.id);
  const item = items.find((currentItem) => currentItem.id === itemId);

  if (!item) {
    return res.status(404).json({
      error: 'Item not found',
    });
  }

  item.claimed = true;
  return res.status(200).json(item);
});

app.delete('/items/:id', (req, res) => {
  const itemId = Number(req.params.id);
  const originalLength = items.length;

  items = items.filter((item) => item.id !== itemId);

  if (items.length === originalLength) {
    return res.status(404).json({
      error: 'Item not found',
    });
  }

  return res.status(200).json({
    message: 'Item deleted successfully',
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;