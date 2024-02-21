// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendInsertClient: (clientData) => {
        ipcRenderer.send('insert-client', clientData);
    },
    searchuser: (usernumb) => {
        ipcRenderer.send('searchuser', usernumb);
    },
    onDataSaved: (callback) => {
        ipcRenderer.on('data-saved', callback);
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
        ipcRenderer.on('duesresult',callback);
    },
    searchForOverDues:() => {
        ipcRenderer.send('searchForOverDues');
    },
    userOverDue: (callback) => {
        ipcRenderer.on('overDueResult', callback)
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
        ipcRenderer.send("billingInfo",dates);
    },
    billingResults: (callback) => {
        ipcRenderer.on('billingResult',callback);
    },
    paymentUpdate: (callback) => {
        ipcRenderer.on('addingToPayments',callback);
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
    }
});
