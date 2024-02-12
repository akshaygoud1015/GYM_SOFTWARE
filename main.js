const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const db = new sqlite3.Database('client.db');

// Create table to store client details
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mobile TEXT,
        gender TEXT,
        address TEXT,
        age INTEGER,
        fee REAL,
        payment_duration TEXT
    )`);
});

// Listen for insert-client event from renderer process
ipcMain.on('insert-client', (event, clientData) => {
    // Insert data into SQLite database
    db.run(`INSERT INTO clients (name, mobile, gender, address, age, fee, payment_duration)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            Object.values(clientData),
            (err) => {
                if (err) {
                    event.reply('insert-client-reply', err.message);
                } else {
                    event.reply('insert-client-reply', null);
                }
            });
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname,'src', 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
