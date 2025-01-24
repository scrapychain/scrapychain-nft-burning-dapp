require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
const nftRoutes = require('./routes/nftRoutes');
const burnRoutes = require('./routes/burnRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/nfts', nftRoutes);
app.use('/api/burn', burnRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
