const express = require('express');
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
  res.send('streaming service');
});

// Endpoint to stream stems
app.get('/stems/:stemName', (req, res) => {
  const stemName = req.params.stemName;
  const filePath = path.join(__dirname, '..', 'stems', stemName + '.wav');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const file = fs.createReadStream(filePath, { start, end });
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/wav',
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/wav',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(
    `Stemplayer streaming service listening at http://localhost:${PORT}`
  );
});
