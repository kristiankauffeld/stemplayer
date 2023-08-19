const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ debug: true });

const port = process.env.PORT;
