const electron = require("electron");
const {app, BrowserWindow, ipcMain, dialog} = electron;
const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');

try {
    require('electron-reloader')(module)
} catch (_) {
}

let localDataFile;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        icon: './media/DayZLogo.PNG',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        }
    })
    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("getFileEvent", (event) => {
    options = {
        title: "Select XML Files to import",
        buttonLabel: "Import .XML File",
        defaultPath: app.getPath('desktop'),
        properties: ['openFile'],
        filters: [
            {name: 'XML', extensions: ['xml']}
        ],
    }
    dialog.showOpenDialog(options).then((result) => {
        pages = result.filePaths
        let filePath = result.filePaths.toString()
        if (false === result.canceled) {
            const data = fs.readFileSync(filePath,
                {encoding: 'utf8', flag: 'r'});
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }
                localDataFile = result
            });
            localD = JSON.stringify(localDataFile)
            console.log(localD)
            event.reply("checkJSON", localD)
            event.reply("receiveDataReply", localDataFile)
            event.reply("updateImportButton", pages)
        } else {
            console.warn("File was not selected!")
        }
    })
})

ipcMain.on("saveFileEvent", (event) => {
    options = {
        title: "Select XML Files to export",
        buttonLabel: "Save",
        defaultPath: app.getPath('desktop'),
        filters: [
            {name: 'XML', extensions: ['xml']}
        ],
    }
    dialog.showSaveDialog(options).then((result) => {
        if (false === result.canceled) {
            localDataFile = JSON.stringify(localDataFile)
            console.log(localDataFile)
            const builder = new xml2js.Builder();
            const xml = builder.buildObject((JSON.parse(localDataFile)));
            console.log(xml)
            fs.writeFile(result.filePath, xml, (err) => {
            });
        } else {
            console.warn("File was not selected!")
        }
    })
})
