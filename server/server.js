const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chat.routes');
const analyzeRoutes = require('./routes/analyze.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'AgroGuard AI Backend is running' });
});

// AI Routes
app.use('/api/chat', chatRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/admin', adminRoutes);

// Database logging routes or others can be added here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
