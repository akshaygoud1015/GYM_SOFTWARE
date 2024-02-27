const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendInsertClient: (clientData) => {
        ipcRenderer.send('insert-client', clientData);
    },
   
    onDataSaved: (callback) => {
        ipcRenderer.on('data-saved', callback);
    },
    sendInsertStaff: (staffData) => {
        ipcRenderer.send('insert-staff', staffData);
    },
    onStaffDataSaved: (callback) => {
        ipcRenderer.on('staffdata-saved', callback);
    },
    searchuser: (usernumb) => {
        ipcRenderer.send('searchuser', usernumb);
    },
    onSearchResult: (callback) => { // Listen for search result from main process
        ipcRenderer.on('searchuser-result', callback);
    },
    makePayment: (paymentData) => {
        ipcRenderer.send('makePayment', paymentData);
    },
    onRenewal: (callback) => {
        ipcRenderer.on('paymentResult', callback);
    },
    searchForDues: () => {
        ipcRenderer.send('searchForDues');
    },
    userdues: (callback) => {
        ipcRenderer.on('duesresult', callback);
    },
    searchForOverDues: () => {
        ipcRenderer.send('searchForOverDues');
    },
    userOverDue: (callback) => {
        ipcRenderer.on('overDueResult', callback);
    },
    userDues: (callback) => {
        ipcRenderer.on('duesResult', callback);
    },
    searchForPayments: (userId) => {
        ipcRenderer.send('searchForPayments', userId);
    },
    onSearchPayment: (callback) => {
        ipcRenderer.on('onSearchPayment', callback);
    },
    getCustomers: () => {
        ipcRenderer.send('getCustomers');        
    },
    customersList: (callback) => {
        ipcRenderer.on('customersListResult', callback);
    },
    billingInfo: (dates) => {

        ipcRenderer.send("billingInfo", dates);
    },
    billingResults: (callback) => {
        ipcRenderer.on('billingResult', callback);
    },
    paymentUpdate: (callback) => {
        ipcRenderer.on('addingToPayments', callback);
    },
    getStaff: () => { // New method for fetching staff data
        ipcRenderer.send('getStaff');
    },

    staffList: (callback) => { // New method for receiving staff data
        ipcRenderer.on('staffListResult', callback);
     },
    checkLogin: (credentials) => {
        ipcRenderer.send('checkForLogin', credentials);
    },
    onLogin: (callback) => {
        ipcRenderer.once('loginStatus', callback);
    },
    newPassword: (newCredentials) => {
        ipcRenderer.send('setPassword', newCredentials);
    },
    onChangePassword: (callback) => {
        ipcRenderer.on('onSetPassword', callback);

    },
    addNewExpense:(expenseData)=>{
        ipcRenderer.send('addNewExpense',expenseData)
    },
    addedExpense:(callback)=>{
        ipcRenderer.on('updatedExpense',callback)
    },
    getExpenses:(timeperiod)=>{
        ipcRenderer.send('fetchingExpenses', timeperiod)
    },
    expenseResult:(callback)=>{
        ipcRenderer.on('expensesQuery',callback)
    },
    getMonthlyExpenses:()=>{
        ipcRenderer.send('getMonthlyExpenses')
    },
    thisMonthExpenses:(callback)=>{
        ipcRenderer.on('expenseThisMonth',callback)
    }

});
