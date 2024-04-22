import React from 'react';
import 'path';

const express = require('express');

const app = express();

app.use(cors()); // lock this down

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));