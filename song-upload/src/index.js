const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ debug: true });
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('song-upload service');
});

app.post('/upload', (req, res) => {
  const filePath = './songs/Cy-Curnin-Comfy-Couches.mp3';
});

app.listen(port, () => {
  console.log(`Upload Service running on http://localhost:${port}`);
});
