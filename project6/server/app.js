import React from 'react';
import 'path';

const express = require('express');
const db = require('./db/database');
const app = express();
const router = express.Router();

app.use(cors()); // lock this down

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));