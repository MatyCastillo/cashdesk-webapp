const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const statusRoute = require('./routes/statusRoute');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', statusRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pagos', paymentsRoutes);

module.exports = app;
