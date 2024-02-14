// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    sendInsertClient: (clientData) => {
        ipcRenderer.send('insert-client', clientData);
    },
    onDataSaved: (callback) => {
        ipcRenderer.on('data-saved', callback);
    }
});
