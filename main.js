const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2/promise for async/await support
const { STATUS_CODES } = require('http');
const { eventNames } = require('process');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'gymclient',
    connectionLimit: 10 // Adjust the connection limit as per your requirements
});

ipcMain.on('checkForLogin', async (event, credentials) => {
    try {
        let key = 0;
        const user = credentials.user;
        const pass = credentials.pass;

        const connection = await pool.getConnection();
        const [passD, extra] = await connection.execute('SELECT password FROM login WHERE username = ?', [user]);
        connection.release();

        if(passD.length > 0) {
            const passkey = passD[0].password;

            if (passkey === pass) {
                if (user === 'owner') {
                    key = 1;
                } else if (user === 'trainer') {
                    key = 2;
                }
                event.sender.send('loginStatus', key);
            } else {
                event.sender.send('loginStatus', 'Invalid credentials');
            }
        } else {
            event.sender.send('loginStatus', 'No user found');
        }
    } catch (error) {
        console.error('Error logging in', error);
    }
});

ipcMain.on('setPassword', async (event, newCredentials) => {
    try {
        const user = newCredentials.user;
        const pass = newCredentials.pass;

        const connection = await pool.getConnection();
        await connection.execute('UPDATE login SET password = ? WHERE username = ?', [pass, user]);   
        connection.release();
        event.sender.send('onSetPassword', 'Password changed successfully');             

    } catch (error) {
        console.error('Error changing password', error);
    }
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

        const [userId,extra]= await connection.execute('SELECT id FROM clients WHERE mobile = ?', [data.mobile])    
        connection.release();
        console.log('Data inserted successfully', userId);
        event.reply('data-saved', 'Data saved successfully');
        event.reply('addingToPayments', userId);
    } catch (error) {
        console.error('Error inserting data:', error);
        event.reply('data-saved', 'Error saving data');
     
    }
});

ipcMain.on('insert-staff', async (event, staffData) => {
    try {
        const data = {
            name: staffData.name || null,
            mobile: staffData.mobile || null,
            alternateMobile: staffData.alternateMobile || null,
            age: staffData.age || null,
            salary: staffData.salary || null,
            dateOfJoining: staffData.dateOfJoining || null
        };
        
        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO staff (name, phone_number, alternate_phone_number, age, salary, date_of_joining) VALUES (?, ?, ?, ?, ?, ?)', 
            [data.name, data.mobile, data.alternateMobile, data.age, data.salary, data.dateOfJoining]);

        connection.release();
        
        console.log('Staff Data inserted successfully');
        event.reply('staffdata-saved', 'Staff Data saved successfully');
    } catch (error) {
        console.error('Error inserting staff data:', error);
        event.reply('staffdata-saved', 'Error saving staff data');
    }
});
// Assuming you have a database connection pool named 'pool'

ipcMain.on('getStaff', async (event) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT * FROM staff'); // Assuming 'staff' is the name of your staff table
        connection.release();
        console.log(rows);
        event.sender.send('staffListResult', rows);
    } catch (error) {
        console.error("Error fetching staff data:", error);
        event.sender.send('staffListResult', []); // Send an empty array in case of error
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


ipcMain.on("billingInfo", async(event,dates) => {
    const month=dates.month
    const year=dates.year
    try{
        const connection = await pool.getConnection();
        console.log(year,month)
        const startDate = new Date(year, month - 1, 1); 
        const endDate = new Date(year, month, 0);

        const[rows,fields] =  await connection.execute('SELECT * FROM payments WHERE payment_date BETWEEN ? AND ? ',[startDate,endDate]);
        const[clientCount,extra]=  await connection.execute('SELECT COUNT(*) AS count FROM clients WHERE date BETWEEN ? AND ? ',[startDate,endDate]);
        console.log(rows);
        console.log(clientCount[0]);
        event.sender.send("billingResult", rows, clientCount[0]);
    }
    catch(error){
        console.log(error)
        rows="No bills generated for the selected year/month"
        event.sender.send("billingResult", rows);
    }

})


ipcMain.on('addNewExpense',async(event,{expenseName,amount,enquired,date})=>{
    try{
        const connection= await pool.getConnection();
        await connection.execute("INSERT INTO expenses (expense_name,amount,made_by,expense_date) values (?,?,?,?)",[expenseName,amount,enquired,date])
        
        console.log("added expense");
        event.sender.send('updatedExpense',"added expense")
    
    }
    catch(error){
        console.log("error",error)
    }

})


ipcMain.on('fetchExpenses',async(event)=>{
    try{
        const connection=await pool.getConnection();

        const [rows,fields]= await connection.execute("SELECT * FROM Expenses");

        event.sender.send('expensesQuery',rows)
    }
    catch(error){
        rows="no Expenses Found"
        event.sender.send('expensesQuery',rows)
    }

})

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
