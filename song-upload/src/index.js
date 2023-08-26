const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ debug: true });
const PORT = process.env.PORT;

//configures connection to stem-separation service
const DEMUCS_HOST = process.env.DEMUCS_HOST;
const DEMUCS_PORT = process.env.DEMUCS_PORT;

app.get('/', (req, res) => {
  res.send('song-upload service');
});

app.post('/upload', async (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'songs',
    'Cy-Curnin-Comfy-Couches.mp3'
  );
  //const filePath = './songs/Cy-Curnin-Comfy-Couches.mp3';

  try {
    const audioData = fs.readFileSync(filePath);
    const response = await axios.post(
      `http://${DEMUCS_HOST}:${DEMUCS_PORT}/process_audio/`,
      audioData,
      {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Upload Service running on http://localhost:${PORT}`);
});
