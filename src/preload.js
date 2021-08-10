const { contextBridge, ipcRenderer } = require("electron");

const validChannels = [
    "MINIMIZE_WINDOW",
    "MAXIMIZE_WINDOW",
    "WINDOW_FOCUS",
    "PARSE_CSV",
    "TEST_CONNECTION",
    "TEST_CONNECTION_STATUS",
    "GET_INFORMATION",
    "GET_INFORMATION_STATUS",
    "DELETE_EMAILS",
    "DELETE_EMAILS_STATUS",
];

contextBridge.exposeInMainWorld("ipc", {
    send: (channel, data) => {
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel, func) => {
        if (validChannels.includes(channel)) {
            // Strip event as it includes `sender` and is a security risk
            const subscription = (event, ...args) => func(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        }
    },
});
