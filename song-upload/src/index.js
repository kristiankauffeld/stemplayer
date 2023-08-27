const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const amqp = require('amqplib');

if (!process.env.PORT) {
  throw new Error(
    'Please specify the port number for the HTTP server with the environment variable PORT.'
  );
}

if (!process.env.RABBIT) {
  throw new Error(
    'Please specify the name of the RabbitMQ host using environment variable RABBIT'
  );
}

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT;

//configures connection to stem-separation service
const DEMUCS_HOST = process.env.DEMUCS_HOST;
const DEMUCS_PORT = process.env.DEMUCS_PORT;

console.log(`Connecting to RabbitMQ server at ${RABBIT}.`);

const app = express();
dotenv.config({ debug: true });

console.log('Connected to RabbitMQ.');

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
