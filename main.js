const electron = require("electron");
const { app, BrowserWindow ,ipcMain,dialog} = electron;
const path = require('path')
const fs = require('fs');
const xml2js = require('xml2js');

try {
  require('electron-reloader')(module)
} catch (_) {}

let localDataFile;

function createWindow () {
  // Create the browser window.
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

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Use local web browser to open links
app.on('web-contents-created', (e, contents) => {
  contents.on('new-window', (e, url) => {
    e.preventDefault();
    require('open')(url);
  });
  contents.on('will-navigate', (e, url) => {
    if (url !== contents.getURL()){
      e.preventDefault();
      require('open')(url);
    }
  });
});

ipcMain.on("getFileEvent",(event)=>{
  options={
    title:"Select XML Files to import",
    buttonLabel:"Import .XML File",
    defaultPath:app.getPath('desktop'),
    properties:['openFile'],
    filters :[
      {name: 'XML', extensions: ['xml']}
        ],
  }
  dialog.showOpenDialog(options).then((result)=>{
    pages = result.filePaths
    let filePath = result.filePaths.toString()
    if(false === result.canceled){
      const data = fs.readFileSync(filePath,
          {encoding:'utf8', flag:'r'});
        // Parse XML to JSON
        xml2js.parseString(data, (err, result) => {
          if(err) {
            throw err;
          }
          // Convert to JSON and event reply
          localDataFile = JSON.stringify(result, null, 0)
          event.reply("receiveDataReply",data)
        });
    }
    else{
      console.warn("File was not selected!")
    }
  })
})

ipcMain.on("saveFileEvent",(event)=>{
  options={
    title:"Select XML Files to export",
    buttonLabel:"Save",
    defaultPath:app.getPath('desktop'),
    filters :[
      {name: 'XML', extensions: ['xml']}
    ],
  }
  dialog.showSaveDialog(options).then((result)=>{
    if(false === result.canceled) {
      console.log("Out: " + localDataFile)
      //Problem is here, the JSON -> XML doesn't build all of the nodes out
      //It just turns the file to XML and gives it XML header.

      var builder = new xml2js.Builder();
      var xml = builder.buildObject(localDataFile).ele("Types");

      fs.writeFile(result.filePath, xml, (err) => {
      });
    }
    else{
      console.warn("File was not selected!")
    }
  })
})
