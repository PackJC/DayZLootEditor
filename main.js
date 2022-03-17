const electron = require("electron");
const {app, BrowserWindow, ipcMain, dialog} = electron;
const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');
const {autoUpdater} = require('electron-updater');

try {
    require('electron-reloader')(module)
} catch (_) {
}

let localDataFile;

function createWindow() {
    const mainWindow = new BrowserWindow(
        {
        width: 1200, height: 800, autoHideMenuBar: true, icon: './media/DayZLogo.PNG', webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        }
    })

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
    });
    mainWindow.loadFile('index.html').then(r => r)
    //mainWindow.webContents.openDevTools()

}

app.whenReady().then(() => {
    createWindow()
    autoUpdater.checkForUpdatesAndNotify().then(r => r);
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', {version: app.getVersion()});
});


ipcMain.on("getFileEvent", (event) => {
    let options = {
        title: "Select XML Files to import",
        buttonLabel: "Import .XML File",
        defaultPath: app.getPath('desktop'),
        properties: ['openFile'],
        filters: [{name: 'XML', extensions: ['xml']}],
    }
    dialog.showOpenDialog(options).then((result) => {
        let pages = result.filePaths
        let filePath = result.filePaths.toString()
        if (false === result.canceled) {
            const data = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }
                localDataFile = result
            });
            let localD = JSON.stringify(localDataFile)
            event.reply("checkJSON", localD)
            event.reply("receiveDataReply", localDataFile)
            event.reply("updateImportButton", pages)
        } else {
            console.warn("File was not selected!")
        }
    })
})

ipcMain.on("doc", async (event, data) => {
    saveTheFile(data);
})




function saveTheFile(thedata) {
    let options = {
        title: "Select XML Files to export",
        buttonLabel: "Save",
        defaultPath: app.getPath('desktop'),
        filters: [{name: 'XML', extensions: ['xml']}],
    }
    //removes white spaces create when removing excess xml elements
    thedata = thedata.replace(/^\s*\n/gm, "");
    console.log(thedata)
    thedata = thedata.replace(/usage1/g, "usage");
    thedata = thedata.replace(/usage2/g, "usage");
    thedata = thedata.replace(/usage3/g, "usage");
    thedata = thedata.replace(/value1/g, "value");
    thedata = thedata.replace(/value2/g, "value");

    console.log("end of the data")

    dialog.showSaveDialog(options).then((result) => {
        if (false === result.canceled) {
            fs.writeFile(result.filePath, thedata, () => {
            });
        } else {
            console.warn("File was not selected!")
        }
    })
}

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
