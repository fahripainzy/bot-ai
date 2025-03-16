const { spawn } = require('child_process');
const path = require('path');
const express = require('express');

const app = express();
const port = process.argv[2] || 3000; // Ambil port dari argumen atau default 3000

app.use(express.static(path.join(__dirname, 'public'))); // Folder untuk file website

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Render halaman utama
});

function startHaruka() {
    let args = [path.join(__dirname, 'main.js'), port, ...process.argv.slice(3)];

    console.log(`Starting Haruka on port ${port}...`);

    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    p.on('message', data => {
        if (data == 'reset') {
            console.log('Restarting Bot...');
            p.kill();
            startHaruka();
        }
    });

    p.on('exit', code => {
        console.error('Exited with code:', code);
        if (code === 1 || code === 0) startHaruka();
    });
}

// Jalankan web server
app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});

// Jalankan bot
startHaruka();