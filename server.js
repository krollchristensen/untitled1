const express = require('express');
const fs = require('fs-extra');
const EventEmitter = require('events');

const app = express();
const port = 3000;

// Middleware til at parse JSON-indhold i POST-anmodninger
app.use(express.json());

// Opret en EventEmitter-instans
const logEmitter = new EventEmitter();

// Definer en event-handler for log-beskeder
logEmitter.on('log', (message) => {
    console.log(`Log: ${message}`);
});

// Middleware til at logge alle indgående anmodninger
app.use((req, res, next) => {
    logEmitter.emit('log', `${req.method} ${req.url}`);
    next();
});

// GET-rute til at læse indholdet af en fil
app.get('/read-file', async (req, res) => {
    try {
        const data = await fs.readFile('data.txt', 'utf-8');
        res.send(data);
    } catch (error) {
        res.status(500).send('Fejl ved læsning af filen.');
    }
});

// POST-rute til at skrive data til en fil
app.post('/write-file', async (req, res) => {
    try {
        const { content } = req.body;
        await fs.writeFile('data.txt', content);
        res.send('Fil skrevet succesfuldt.');
    } catch (error) {
        res.status(500).send('Fejl ved skrivning til filen.');
    }
});

// Start serveren og lyt på den definerede port
app.listen(port, () => {
    logEmitter.emit('log', `Serveren er startet på port ${port}`);
    console.log(`Server lytter på http://localhost:${port}`);
});
