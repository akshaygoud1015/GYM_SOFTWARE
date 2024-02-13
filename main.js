const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await support

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'gymclient',
    connectionLimit: 10 // Adjust the connection limit as per your requirements
});

async function insertFormData(data) {
    try {
        const connection = await pool.getConnection();
        // Insert data into the database
        await connection.execute('INSERT INTO clients (name, mobile, gender, address, age, fee, payment_duration) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [data.name, data.mobile, data.gender, data.address, data.age, data.fee, data.paymentDuration]);
        connection.release();
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

// Handle IPC event from renderer process
ipcMain.on('insert-client', (event, clientData) => {
    insertFormData(clientData);
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js') // Adjust the path if needed
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
