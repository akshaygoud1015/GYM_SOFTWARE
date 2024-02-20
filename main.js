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

ipcMain.on('insert-staff', async (event, staffData) => {
    try {
        // Replace undefined values with null
        
        const data = {
            name: staffData.name || null,
            phoneNumber: staffData.phoneNumber || null,
            alternatePhoneNumber: staffData.alternatePhoneNumber || null,
            age: staffData.age || null,
            salary: staffData.salary || null,
            date: staffData.date || null
        };
        

        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO staff (name, phone_number,alternate_phone_number,age,salary ,date_of_joining) VALUES (?, ?, ?, ?, ?, ?)', 
            [data.name, data.phoneNumber, data.alternatePhoneNumber, data.age, data.salary, data.date]);
        connection.release();
        console.log('Data inserted successfully');
        event.reply('staffdata-saved', 'Data saved successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
        event.reply('staffdata-saved', 'Error saving data');
    }
});
ipcMain.on('searchuser', async (event, { numb }) => { // Destructuring da numb from usernumb object
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM clients WHERE mobile = ?', [numb]);
        connection.release();

        // Send back the search result to the renderer process
        event.sender.send('searchuser-result', rows);
        console.log(rows,"rows")
    } catch (error) {
        console.error('Error searching user:', error);
    }
});

ipcMain.on('makePayment', async(event, paymentData) => {
    const payment_type = paymentData.payType;
    const id = paymentData.userId;
    const fees = paymentData.amount;
    console.log(id);
    console.log(payment_type);

    try {

        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        let todayDate = new Date().toISOString().split('T')[0];
        let nextRenewalDate = new Date(); // Initialize nextRenewalDate here
  
        // Calculate the next renewal date based on payment type
        if (payment_type === 'Monthly') {
            nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
        }
        else if (payment_type === 'Quarterly') {
            nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 3);
        }
        else if (payment_type === 'Half-yearly') {
            nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 6);
        }
        else if (payment_type === 'Annually') {
            nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
        }

        let nextRenewalFormatted = nextRenewalDate.toISOString().split('T')[0];
  
        // Update the payment date in the database
        await connection.execute('UPDATE clients SET last_payment = ?, validity = ? WHERE id = ?', [todayDate, nextRenewalFormatted, id]);
        await connection.execute('INSERT INTO payments (user_id, payment_date, payment_type, amount) VALUES (?,?,?,?)',[id, todayDate, payment_type, fees]);
        connection.release(); // Release the connection back to the pool
        console.log('success');
        event.sender.send('paymentResult', 'Your renewal was successful!'); // Send success response

    } catch(error){
        console.error('Error:', error);
        event.sender.send('paymentResult', 'Error occurred');
    }
});


ipcMain.on('searchForDues', async(event) => {
    try{
        const connection = await pool.getConnection();
        const currentDate = new Date();
        const threeDaysAgo = new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000));
         // Calculate three days ago
        const query = 'SELECT * FROM clients WHERE validity BETWEEN ? AND ?';
        const params = [currentDate,threeDaysAgo];
        const [rows] = await connection.execute(query, params);
        connection.release();
        console.log(threeDaysAgo)

        event.sender.send('duesResult',rows)
    }
    catch(error){
        console.log(error)
        rows="no upcoming dues"
        event.sender.send('duesResult',rows)
    }
});

ipcMain.on('searchForOverDues', async(event) => {
    try{
        const connection= await pool.getConnection();
        const currentDate = new Date();
        [data,fields] = await connection.execute('SELECT * FROM clients WHERE validity <  ?', [currentDate]);
        console.log(data);
        event.sender.send('overDueResult', data);
    }
    catch(error){
        data = "no dues";
        event.sender.send('overDueResult', data);
    }
});

ipcMain.on('searchForPayments', async(event, {id}) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM payments WHERE user_id = ?', [id]);
        connection.release();

        // Send back the search result to the renderer process
        event.sender.send('onSearchPayment', rows);
        console.log(rows, "rows");
    } catch (error) {
        console.error('Error searching user:', error);
    }    
});

ipcMain.on('getCustomers', async(event) => {
    try{
        const connection = await pool.getConnection();
        [rows, fields] = await connection.execute('SELECT * FROM clients');
        connection.release;
        console.log(rows);
        event.sender.send('customersListResult', rows);
    }
    catch(error){
        rows = "no customers found";
        event.sender.send('customersListResult', rows);
    }
});

// Assuming you have a database connection pool named 'pool'

ipcMain.on('getStaff', async (event) => {
    try {
        const connection = await pool.getConnection();
        [rows, fields] = await connection.execute('SELECT * FROM staff'); // Assuming 'staff' is the name of your staff table
        connection.release();
        console.log(rows);
        event.sender.send('staffListResult', rows);
    } catch (error) {
        console.error("Error fetching staff data:", error);
        event.sender.send('staffListResult', []); // Send an empty array in case of error
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
