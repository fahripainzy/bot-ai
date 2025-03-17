const { spawn } = require('child_process');
const path = require('path');
const express = require('express');

const app = express();
const port = process.argv[2] || 3000; // Ambil port dari argumen atau default 3000

// Hapus rute yang memerlukan index.html
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

function startHaruka() {
    let botPath = path.join(__dirname, 'main.js');

    console.log(`Starting Haruka bot...`);

    let p = spawn('node', [botPath], {
        stdio: 'inherit',
    });

    p.on('exit', code => {
        console.error('Bot exited with code:', code);
        if (code !== 0) startHaruka(); // Restart jika error
    });
}

// Jalankan bot tanpa perlu server web jika tidak digunakan
startHaruka();

// Jika ingin tetap menggunakan web server, aktifkan bagian ini
app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});