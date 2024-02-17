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
    }
});
