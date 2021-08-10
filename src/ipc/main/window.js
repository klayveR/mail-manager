import { BrowserWindow, ipcMain } from "electron";

ipcMain.on("MINIMIZE_WINDOW", () => {
    BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on("MAXIMIZE_WINDOW", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win.isMaximizable()) {
        return;
    }

    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});
