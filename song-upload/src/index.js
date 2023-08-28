const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const amqp = require('amqplib');

dotenv.config({ debug: true });

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT;

//configures connection to stem-separation service
const DEMUCS_HOST = process.env.DEMUCS_HOST;
const DEMUCS_PORT = process.env.DEMUCS_PORT;

if (!PORT || !RABBIT) {
  throw new Error('Missing environment variables');
}

// Function to send a message for stem separation
function sendStemSeparationMessage(messageChannel, filePath) {
  // The name of the queue should match what you declared in the FastAPI service
  const queueName = 'StemSeparation';

  // Make sure the queue exists
  messageChannel.assertQueue(queueName, { durable: true });

  // Send a message
  messageChannel.sendToQueue(queueName, Buffer.from(filePath), {
    // Persistent makes sure the message survives RabbitMQ server restarts
    persistent: true,
  });

  console.log(`Sent a stem separation request for file: ${filePath}`);
}

async function main() {
  console.log(`Connecting to RabbitMQ server at ${RABBIT}.`);

  const messagingConnection = await amqp.connect(RABBIT); // Connect to the RabbitMQ server.

  console.log('Connected to RabbitMQ.');

  const messageChannel = await messagingConnection.createChannel(); // Create a RabbitMQ messaging channel.

  const app = express();

  app.post('/upload', async (req, res) => {
    const filePath = path.join(
      __dirname,
      '..',
      'songs',
      'Cy-Curnin-Comfy-Couches.mp3'
    );

    try {
      sendStemSeparationMessage(messageChannel, filePath);

      res.json({
        status: 'success',
        message: 'Received file and sent for stem separation',
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.listen(PORT, () => {
    console.log(`Upload Service running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Microservice failed to start.');
  console.error((err && err.stack) || err);
});
