const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await support

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Hari@0118',
    database: 'gymclient',
    connectionLimit: 10 // Adjust the connection limit as per your requirements
});

ipcMain.on('insert-client', async (event, clientData) => {
    try {
        // Replace undefined values with null
        
        const data = {
            name: clientData.name || null,
            mobile: clientData.mobile || null,
            gender: clientData.gender || null,
            adress: clientData.adress || null,
            age: clientData.age || null,
            fee: clientData.fee || null,
            paymentDuration: clientData.paymentDuration || null,
            formattedDate: clientData.formattedDate || null
        };
        

        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO clients (name, mobile, gender, address, age, fee, payment_duration,date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [data.name, data.mobile, data.gender, data.adress, data.age, data.fee, data.paymentDuration, data.formattedDate]);
        connection.release();
        console.log('Data inserted successfully');
        event.reply('data-saved', 'Data saved successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        event.reply('data-saved', 'Error saving data');
    }
});


ipcMain.on('searchuser', async (event, { numb }) => { // Destructuring da numb from usernumb object
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM Clients WHERE mobile = ?', [numb]);
        connection.release();

        // Send back the search result to the renderer process
        event.sender.send('searchuser-result', rows);
        console.log(rows,"rows")
    } catch (error) {
        console.error('Error searching user:', error);
    }
});


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname,'preload.js') // Adjust the path if needed
        }
    });

    mainWindow.loadFile(path.join(__dirname,'src', 'index.html'));
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
