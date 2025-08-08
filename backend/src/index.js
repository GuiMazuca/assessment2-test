const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const killPort = require('kill-port');
const path = require('path');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const { initRuntimeConfig } = require('./config/runtimeConfig');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 4001;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:3000`;

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const startServer = (port) => {
    initRuntimeConfig();
    const server = app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
    });

    const shutdownHandler = (signal) => {
        console.log(`\nCaught ${signal}. Shutting down gracefully...`);
        server.close(() => {
            console.log('Server closed. Port released.');
            process.exit(0);
        });

        setTimeout(() => {
            console.error('Force exiting after timeout');
            process.exit(1);
        }, 5000);
    };

    process.on('SIGINT', () => shutdownHandler('SIGINT'));
    process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        shutdownHandler('uncaughtException');
    });
};

killPort(PORT, 'tcp')
    .then(() => {
        console.log(`Port ${PORT} killed. Starting fresh server...`);
        startServer(PORT);
    })
    .catch((err) => {
        console.warn(`Port ${PORT} may not have been in use. Starting server anyway...`);
        startServer(PORT);
    });
